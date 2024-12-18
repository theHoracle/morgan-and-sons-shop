"use client"
import { useState, useEffect } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddItem, useGetCart, useRemoveItem } from '@/hooks/cart'
import { UsersCart } from '@/payload-types'


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
      cart={cart!}
      />
  </div>
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  cart: UsersCart
}

function Cart({ isOpen, onClose, cart }: CartProps) {
  const { mutate: onAddItem } = useAddItem()
  const { mutate: onRemoveItem } = useRemoveItem()
    
  const [mounted, setMounted] = useState(false)
  const { items } = cart
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const total = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="font-medium">{
                  typeof item.product !== "number" ? item.product.title : "Unknown Product"
                  }</h3>
                  <p className="text-sm text-gray-500">
                    {item.variant.size} / {item.variant.color}
                  </p>
                  <div className="flex items-center mt-1">
                    <button
                      onClick={() => onRemoveItem({
                        itemId: item.id!,
                        previousData: cart,
                      })}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => onAddItem({
                        item: item,
                        previousData: cart
                      })}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.variant.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => onRemoveItem({
                      itemId: item.id!,
                      previousData: cart,
                      removeCompletely: true
                    })}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" disabled={items.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
