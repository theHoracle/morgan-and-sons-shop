"use server"

import { payload } from "@/payload"
import { Product, UsersCart } from "@/payload-types"

export const getCart = async () => {
    const { docs: cart } = await payload.find({
        collection: 'users-cart',
        limit: 1
    })
    const [usersCart] = cart
    return usersCart
}

type AddItem = {
    previousData: UsersCart,
    item: UsersCart["items"][0]
}
export const addItem = async (addItem: AddItem) => {
    const { previousData, item } = addItem;

    const variant = item.variant;

    // Return early if no variant is available
    if (!variant) return;

    // Find if the item with matching variant exists
    const existingItemIndex = previousData.items.findIndex(
        (cartItem) =>
            cartItem.product === item.product &&
            cartItem.variant.size === variant.size &&
            cartItem.variant.color === variant.color
    );

    let updatedItems;

    if (existingItemIndex > -1) {
        // Update quantity of existing item
        updatedItems = previousData.items.map((cartItem, index) =>
            index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    } else {
        // Add a new item
        updatedItems = [
            ...previousData.items,
            {
                id: item.id,
                product: item.product,
                quantity: 1,
                variant: {
                    size: variant.size,
                    color: variant.color,
                },
            },
        ];
    }
    // Perform the update
    await payload.update({
        collection: "users-cart",
        id: previousData.id,
        data: {
            items: updatedItems,
        },
    });
};

export const removeItem = async (props: {
    previousData: UsersCart,
    itemId: string,
    removeCompletely?: boolean
}) => {
    const { itemId, previousData, removeCompletely } = props
    
    const existingItems = previousData.items ?? [];

    let updatedItems;
    if (removeCompletely) {
        // Straight delete: Remove the item completely
        updatedItems = existingItems.filter((cartItem) => cartItem?.id !== itemId);
    } else {
        // Reduce quantity or remove the item if quantity hits 0
        updatedItems = existingItems.flatMap((cartItem) => {
            if (cartItem?.id === itemId) {
                const updatedQuantity = (cartItem.quantity || 1) - 1;

                // Remove the item if quantity <= 0
                if (updatedQuantity <= 0) return []; // Exclude this item

                // Otherwise, return the updated item
                return [{ 
                    ...cartItem, 
                    quantity: updatedQuantity 
                }];
            }
            return [cartItem]; // Leave other items unchanged
        });
    }
    // Perform the update
    await payload.update({
        collection: "users-cart",
        id: previousData.id,
        data: {
            items: updatedItems,
        },
    });
}