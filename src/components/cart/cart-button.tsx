"use client"

import { ShoppingCart } from "lucide-react"
import { useGetCart } from "@/hooks/cart"
import { useState } from "react"
import { Cart } from "./cart"

export function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { data: cart } = useGetCart()

  const totalCartItems = cart?.items?.length || 0

  return <div>
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 text-gray-600 hover:text-gray-900"
    >
      <ShoppingCart size={24} />
      {totalCartItems > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalCartItems}
        </span>
      )}
    </button>
    <Cart
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cart={cart}
    />
  </div>
}
