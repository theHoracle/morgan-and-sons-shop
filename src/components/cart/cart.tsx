"use client"
import { ShoppingCart, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAddItem, useGetCart, useRemoveItem } from '@/hooks/cart'
import { UsersCart } from '@/payload-types'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import Link from 'next/link'
import { formatNairaPrice } from '@/lib/helpers'

 
export default function Cart() {
  const { mutate: onAddItem } = useAddItem()
  const { mutate: onRemoveItem } = useRemoveItem()
  const { data: cart } = useGetCart()
  
  console.log("Cart: ", cart)

  const getTotal = (cart: UsersCart | null | undefined) => {
    if (!cart) return 0
    return cart.total || cart.items?.reduce((acc, item) => {
      if (typeof item.product === 'object' && item.product !== null) {
        const variant = item.product.variantInventory?.find(v => v.id === item.variantId)
        return acc + (variant?.price! * item.quantity)
      }
      return acc
    }, 0)
  }
  
  const totalCartItems = cart?.items?.length || 0
  // get total price of all items in the cart

  return ( <Sheet>
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

    <SheetContent
      className=''
      >
      <SheetHeader className="flex justify-between items-center p-4 border-b">
        <SheetTitle className="text-lg font-semibold">Your Cart</SheetTitle>
      </SheetHeader>
      {cart ?  <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4">
          {cart.items?.length === 0 ? (
            <SheetDescription className="text-center text-gray-500">Your cart is empty</SheetDescription>
          ) : (
            cart.items?.map((item: NonNullable<UsersCart["items"]>[0]) => {
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
        <SheetFooter className="border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{formatNairaPrice(getTotal(cart) || 0)}</span>
          </div>
          <SheetClose>  
          <Button className="w-full" disabled={cart.items?.length === 0}>
            Proceed to Checkout
          </Button>
          </SheetClose>
        </SheetFooter>
      </div> : <div className="flex flex-col h-full items-center justify-center gap-4">
      <SheetDescription className="text-center text-gray-500">Your cart is empty</SheetDescription>
      <SheetClose>
        <Link  href="/"
        className={buttonVariants()}
        > 
            Browse products
        </Link>
      </SheetClose>
      </div> }
    </SheetContent>
    </Sheet>
  )
}