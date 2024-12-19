// 'use client';

// import { Product, UsersCart } from "@/payload-types";
// import React, { createContext, useContext, useMemo, useReducer } from "react";

// type UpdateType = 'plus' | 'minus' | 'delete';
// type CartItem = NonNullable<UsersCart["items"]>[number];
// type ProductVariantId = CartItem["variantId"];

// type CartAction =
//   | { type: 'UPDATE_ITEM'; payload: { productId: number; updateType: UpdateType } }
//   | { type: 'ADD_ITEM'; payload: { variant: ProductVariantId; product: Product } };

// type CartContextType = {
//   cart: UsersCart;
//   addCartItem: (variant: ProductVariantId, product: Product) => void;
//   updateCartItem: (productId: number, updateType: UpdateType) => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// function calculateItemCost(quantity: number, price: number): number {
//   return price * quantity;
// }

// function getVariant(product: Product, variantId: ProductVariantId) {
//   return product.variantInventory?.find((variant) => variant.id === variantId)?.price || 0;
// }

// function updateCartItem(item: CartItem, updateType: UpdateType): CartItem | null {
//   if (updateType === 'delete') return null;

//   const newQuantity = updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
//   if (newQuantity <= 0) return null;
//   const product = typeof item.product === 'number' ? null : item.product;

//   if (!product) return null;

//   const subTotal = calculateItemCost(newQuantity, product.price);

//   return {
//     ...item,
//     quantity: newQuantity,
//     subTotal,
//   };
// }

// function createOrUpdateItem(
//   existingItem: CartItem | undefined,
//   variant: ProductVariantId,
//   product: Product
// ): CartItem {
//   const quantity = existingItem ? existingItem.quantity + 1 : 1;
//   const variantPrice = getVariant(product, variant);
//   const subTotal = calculateItemCost(quantity, variantPrice);

//   return {
//     id: existingItem?.id ?? undefined,
//     quantity,
//     subTotal,
//     variantId: variant,
//     product,
//   };
// }

// function updateCartTotal(items: CartItem[]): number {
//   return items.reduce((total, item) => {
//     const product = typeof item.product === 'number' ? null : item.product;
//     if (!product) return total;
//     const variantPrice = getVariant(product, item.variantId);
//     return total + calculateItemCost(item.quantity, variantPrice);
//   }, 0);
// }

// function createEmptyCart(): UsersCart {
//   return {
//     id: 0,
//     user: 0,
//     items: null,
//     total: 0,
//     updatedAt: '',
//     createdAt: '',
//   };
// }

// function cartReducer(state: UsersCart | undefined, action: CartAction): UsersCart {
//   const currentCart = state || createEmptyCart();

//   switch (action.type) {
//     case 'UPDATE_ITEM': {
//       const { productId, updateType } = action.payload;
//       const updatedItems = currentCart.items ? currentCart.items
//         .map((item) =>
//           item.product && typeof item.product !== 'number' && item.product.id === productId
//             ? updateCartItem(item, updateType)
//             : item
//         )
//         .filter((item): item is CartItem => item !== null) : [];

//       if (updatedItems.length === 0) {
//         return {
//           ...currentCart,
//           items: null,
//           total: 0,   
//         };
//       }

//       return {
//         ...currentCart,
//         items: updatedItems,
//         total: updateCartTotal(updatedItems),
//       };
//     }

//     case 'ADD_ITEM': {
//       const { product, variant } = action.payload;
//       const existingItem = currentCart.items?.find(
//         (item) => item.variantId === variant
//       );
//       const updatedItem = createOrUpdateItem(existingItem, variant, product);

//       const updatedItems = existingItem && currentCart.items
//         ? currentCart.items.map((item) =>
//             item.variantId === variant ? updatedItem : item
//           )
//         : currentCart.items 
//           ? [...currentCart.items, updatedItem]
//           : [updatedItem];

//       return {
//         ...currentCart,
//         items: updatedItems,
//         total: updateCartTotal(updatedItems),
//       };
//     }

//     default:
//       return currentCart;
//   }
// }

// export function CartProvider({
//   children,
//   initialCart,
// }: {
//   children: React.ReactNode;
//   initialCart: UsersCart;
// }) {
//   const [cart, dispatch] = useReducer(cartReducer, initialCart);

//   const addCartItem = (variant: ProductVariantId, product: Product) => {
//     dispatch({ type: 'ADD_ITEM', payload: { variant, product } });
//   };

//   const updateCartItem = (productId: number, updateType: UpdateType) => {
//     dispatch({ type: 'UPDATE_ITEM', payload: { productId, updateType } });
//   };

//   const value = useMemo(
//     () => ({
//       cart,
//       addCartItem,
//       updateCartItem,
//     }),
//     [cart]
//   );

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// }