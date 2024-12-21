"use client"
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddItem, useRemoveItem } from '@/hooks/cart'
import { UsersCart } from '@/payload-types'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  cart: UsersCart | undefined | null
}

export function Cart({ isOpen, onClose, cart }: CartProps) {
  const { mutate: onAddItem } = useAddItem()
  const { mutate: onRemoveItem } = useRemoveItem()
    
  if  (!cart) {
    if(isOpen) onClose()
    return null
  }
  const { items } = cart

  // get total price of all items in the cart
  const total = cart.total || items?.reduce((acc, item) => {
    if (typeof item.product === 'object' && item.product !== null) {
      const variant = item.product.variantInventory?.find(v => v.id === item.variantId)
      return acc + (variant?.price! * item.quantity)
    }
    return acc
  }, 0)

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
          {items?.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            items?.map((item) => {
              if(typeof item.product === "number" || !(item.product)) return null
              const variant = item.product.variantInventory?.find(v => v.id === item.variantId)
              return (
                <div key={item.id} className="flex items-center justify-between py-4 border-b">
                  <div>
                    <h3 className="font-medium">{item.product.title}</h3>
                    <p className="text-sm text-gray-500">
                      {variant?.size} / {variant?.color}
                    </p>
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() => onRemoveItem({ itemId: item.id!, removeCompletely: false })}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (typeof item.product === 'object' && item.product !== null && item.variantId) {
                            onAddItem({ selectedVariantId: item.variantId, product: item.product })
                          }
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(variant?.price! * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => onRemoveItem({ itemId: item.id!, removeCompletely: true })}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${total?.toFixed(2)}</span>
          </div>
          <Button className="w-full" disabled={items?.length === 0}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}