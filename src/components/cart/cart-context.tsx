'use client';

import { Product, UsersCart } from "@/payload-types";
import React, { createContext, useContext, useMemo, useReducer } from "react";

type UpdateType = 'plus' | 'minus' | 'delete';
type CartItem = NonNullable<UsersCart["items"]>[number];
type ProductVariantId = NonNullable<CartItem>["variantId"];

type CartAction =
| { type: 'ADD_ITEM'; payload: { selectedVariantId: ProductVariantId; product: Product, quantity?: number } }
| { type: 'REMOVE_ITEM'; payload: { itemId: string; removeCompletely?: boolean } }

type CartContextType = {
  cart: UsersCart;
  addCartItem: (variantId: string, product: Product, quantity?: number) => void;
  deleteCartItem: (itemId: string, removeCompletely?: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: number): number {
  return price * quantity;
}

function getVariant(product: Product, variantId: ProductVariantId) {
  return product.variantInventory?.find((variant) => variant.id === variantId)?.price || 0;
}

function createOrUpdateItem(
  existingItem: CartItem | undefined,
  variantId: ProductVariantId,
  product: Product,
  quantity: number = 1,
): CartItem {
  const newQuantity = existingItem ? existingItem.quantity + (quantity) : 1;
  const variantPrice = getVariant(product, variantId);
  const subTotal = calculateItemCost(quantity, variantPrice);

  return {
    id: existingItem?.id ?? `${product.id}-${variantId}`,
    quantity: newQuantity,
    subTotal,
    variantId,
    product,
  };
}

function updateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    if(!item) return total;
    return total + (item?.subTotal ?? 0);
  }, 0);
}

function createEmptyCart(): UsersCart {
  return {
    id: 0,
    user: 0,
    items: null,
    total: 0,
    updatedAt: '',
    createdAt: '',
  };
}

function cartReducer(state: UsersCart | undefined, action: CartAction): UsersCart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'REMOVE_ITEM': {
      const { itemId, removeCompletely } = action.payload;
      let updatedItems: CartItem[] = [];
      if(removeCompletely) {
        updatedItems = currentCart.items?.filter((item) => item.id !== itemId) ?? [];
      }
      updatedItems = currentCart.items ? currentCart.items
        .map((item) =>
          item.product && typeof item.product !== 'number' && item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item).filter(
                (item): item is NonNullable<CartItem> => item !== null) 
                : [];

      if (updatedItems.length === 0) {
        return {
          ...currentCart,
          items: [],
          total: 0,   
        };
      }

      return {
        ...currentCart,
        items: updatedItems,
        total: updateCartTotal(updatedItems),
      };
    }

    case 'ADD_ITEM': {
      const { product, selectedVariantId, quantity } = action.payload;
      const existingItem = currentCart.items?.find(
        (item) => item.variantId === selectedVariantId
      );
      const updatedItem = createOrUpdateItem(existingItem, selectedVariantId, product, quantity);
      const updatedItems = existingItem && currentCart.items
        ? currentCart.items.map((item) =>
            item.variantId === selectedVariantId ? updatedItem : item
          )
        : currentCart.items 
          ? [...currentCart.items, updatedItem]
          : [updatedItem];

      return {
        ...currentCart,
        items: updatedItems,
        total: updateCartTotal(updatedItems),
      };
    }

    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: UsersCart | undefined;
}) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart || createEmptyCart());

  const addCartItem = (selectedVariantId: string, product: Product, quantity: number | undefined) => {
    dispatch({ type: 'ADD_ITEM', payload: { selectedVariantId, product, quantity } });
  };

  const deleteCartItem = (itemId: string, removeCompletely?: boolean) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId, removeCompletely } });
  };

  const value = useMemo(
    () => ({
      cart,
      addCartItem,
      deleteCartItem,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}