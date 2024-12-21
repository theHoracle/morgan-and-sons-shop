"use client"
import { ShoppingCart } from "lucide-react"
import { useGetCart } from "@/hooks/cart"
import { useState } from "react"
import { Cart } from "./cart"
import { Sheet, SheetTrigger } from "../ui/sheet"

export function CartButton() {
  const { data: cart } = useGetCart()
  
  console.log("Cart: ", cart)
  
  const totalCartItems = cart?.items?.length || 0

  return <Sheet>
    <SheetTrigger asChild
      className="relative p-2 text-gray-600 hover:text-gray-900"
    >
      <>
      <ShoppingCart size={24} />
      {totalCartItems > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalCartItems}
        </span>
      )}
      </>
    </SheetTrigger>
    <Cart
      cart={cart}
    />
  </Sheet>
}
