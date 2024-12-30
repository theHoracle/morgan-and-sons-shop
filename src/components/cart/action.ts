"use server";

import { getServerSideUser } from "@/lib/session";
import { payload } from "@/payload";
import { Product, User, UsersCart } from "@/payload-types";
import { cookies } from "next/headers";

type CartItem = NonNullable<UsersCart["items"]>[0];
const COOKIE_CART_KEY = "cartID";


// -- Cookie Handling
export const getCookieCart = async () => {
    console.log("Getting cookie cart");
    const cartId = (await cookies()).get(COOKIE_CART_KEY)?.value;
    return cartId ? cartId : null;
};

export const setCookieCart = async (cartId: string | number) => {
    console.log("Setting cookie cart: ", cartId);
    (await cookies()).set(COOKIE_CART_KEY, cartId.toString());
};

export const getCartById = async (cartId: string) => (
    await payload.findByID({
        collection: "users-cart",
        id: cartId
    })
)

// -- Fetch Cart or Create New Cart
export const getCart = async () => {
    const nextCookies = await cookies();
    const { user } = await getServerSideUser(nextCookies)

    // if no user, check for cookie cart. If no cookie cart, create a new cart
    if (!user) {
        const cartId = await getCookieCart()
        if (!cartId) {
            const newCart = await createCart()
            await setCookieCart(newCart.id)
            return newCart
        }
        return getCartById(cartId)
    }
    const { docs: carts } = await payload.find({
        collection: "users-cart",
        where: {
            user: { equals: user?.id },
        },
    });
    const [cart] = carts
    if(!cart) return await createCart(user?.id)
    return cart;
};


// -- Create Cart
export const createCart = async (userId?: number) => {
        const cart = await payload.create({
            collection: "users-cart",
            data: {
                user: userId,
                items: [],
                total: 0,
            },
        });
        return cart;
};

// -- Add Item to Cart
export const addItem = async ({
    selectedVariantId,
    product,
    quantity = 1,
}: AddItem) => {
    try {
        const currentCart = await getCart();
        if (!currentCart) return;
        const existingItems = currentCart.items || [];
        console.log("selectedVariant: ", selectedVariantId, "\nexistingItems: ")
        console.dir(existingItems)
        const existingItemIndex = existingItems.findIndex(
            (item) => item.variantId === selectedVariantId
        );
        console.log("Itemindex: ", existingItems)
        let updatedItems;
        if (existingItemIndex > -1) {
            updatedItems = existingItems.map((item, index) => {
                if (index === existingItemIndex) {
                    const updatedQuantity = (item.quantity || 0) + quantity;
                    return { ...item, quantity: updatedQuantity };
                }
                return item;
            });
        } else {
            const selectedVariant = product.variantInventory?.find(
                (variant) => variant.id === selectedVariantId
            );
            if (!selectedVariant?.id) return null;

            const newItem: CartItem = {
                id: ``, // or Will be generated by payload
                quantity,
                variantId: selectedVariant.id,
                product: product,
                subTotal: (selectedVariant.price ?? 0) * quantity,
                
            };
            updatedItems = [...existingItems, newItem];
        }

        const updatedCart = {
            ...currentCart,
            items: updatedItems,
        };
        console.dir(updatedCart);
        await payload.update({
                collection: "users-cart",
                id: currentCart.id,
                data: updatedCart,
            }); 
    } catch (err) {
        console.error("Error adding item: ", err);
    }
};

// -- Remove Item from Cart
export const removeItem = async ({
    itemId,
    removeCompletely,
}: RemoveItem) => {
    try {
        const currentCart = await getCart();
        if (!currentCart) return;

        const existingItems = currentCart.items ?? [];

        let updatedItems;
        if (removeCompletely) {
            updatedItems = existingItems.filter(
                (cartItem) => cartItem.id !== itemId
            );
        } else {
            updatedItems = existingItems.flatMap((cartItem) => {
                if (cartItem.id === itemId) {
                    const updatedQuantity = (cartItem.quantity || 1) - 1;
                    if (updatedQuantity <= 0) return [];
                    return [
                        {
                            ...cartItem,
                            quantity: updatedQuantity,
                        },
                    ];
                }
                return [cartItem];
            });
        }

        const updatedCart = {
            ...currentCart,
            items: updatedItems,
            total: updatedItems.reduce(
                (acc, item) => acc + (item.subTotal || 0),
                0
            ),
        };
        // update cart
        await payload.update({
            collection: "users-cart",
            id: currentCart.id,
            data: updatedCart,
        });
    } catch (err) {
        console.error("Error removing item: ", err);
    }
};

type AddItem = {
    selectedVariantId: string;
    product: Product;
    quantity?: number;
};

type RemoveItem = {
    itemId: string;
    removeCompletely?: boolean;
};


export const mergeUsersCart = async ({ userId }: {userId: number}) => {
    // get guest cart
    const getCookieCartId = await getCookieCart()
    if(!getCookieCartId) return

    // get carts
    const [ guestCart, { docs: usersCart } ] = await Promise.all([
        getCartById(getCookieCartId),
        payload.find({ collection: "users-cart", where: { user: { equals: userId } } })
    ])
    const [userCart] = usersCart
    if(!userCart) {
        const cart = await payload.create({
            collection: "users-cart",
            data: {
                user: userId,
                items: guestCart.items,
                total: guestCart.total
            }
        })
        await Promise.all([
            payload.delete({ collection: "users-cart", id: guestCart.id }),
            setCookieCart(cart.id)
        ])
        return;
    }
    if(!guestCart?.items && !userCart.items) return ( await setCookieCart(userCart.id) );
    
    // Merge carts
    const updatedItems = guestCart.items ? [...guestCart.items] : []
    userCart.items?.forEach(userCartItem => {
        const existingItem = updatedItems.find(item => item.variantId === userCartItem.variantId)
        if(existingItem) {
            existingItem.quantity += userCartItem.quantity
        } else {
            updatedItems.push(userCartItem)
        }
    })
    
    await Promise.all([
        payload.update({ collection: "users-cart", id: userCart.id, data: { items: updatedItems } }),
        payload.delete({ collection: "users-cart", id: guestCart.id }),
        setCookieCart(userCart.id),
    ]) 
}