"use client"

import { ShoppingCart, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import Link from 'next/link'
import { formatNairaPrice } from '@/lib/helpers'
import Image from 'next/image'
import { UsersCart } from '@/payload-types'
import { useAddItem, useGetCart, useRemoveItem } from '@/hooks/cart'
import { useRouter } from 'next/navigation'

 
export default function Cart() {
  const { data: cart } = useGetCart()
  const { mutate: addCartItem } = useAddItem();
  const { mutate: deleteCartItem } = useRemoveItem()
  console.log("Cart: ", cart)
  const router = useRouter()

  const totalCartItems = cart?.items?.length || 0;

  return ( <Sheet>
    <SheetTrigger asChild>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700-- dark:text-white--">
      <ShoppingCart className='h-4 transition-all ease-in-out hover:scale-110' />
      {totalCartItems > 0 && (
        <span className="absolute top-0 right-0 -mr-2 -mt-2 h-4 w-4 rounded-full flex items-center flex-col justify-center bg-red-600 text-[11px] font-medium text-white">
          {totalCartItems}
        </span>
      )}
      </div>
    </SheetTrigger>

    <SheetContent className='w-screen md:max-w-[400px]' >
      <SheetHeader className="flex items-start pb-1 border-b">
        <SheetTitle className="text-2xl tracking-tight leading-tight font-semibold">Cart</SheetTitle>
      </SheetHeader>
      {cart ?  <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto py-4">
          {cart.items?.length === 0 ? (
            <SheetDescription className="text-center text-gray-500">Your cart is empty</SheetDescription>
          ) : (
            cart.items?.map((item: NonNullable<UsersCart["items"]>[0]) => {
              if(typeof item.product === "number" || !(item.product)) return null

              const variant = item.product.variantInventory?.find(v => v.id === item.variantId)
              
              // make variant image later
              const productImage =  item.product.images && typeof item.product.images === "object" && typeof item.product.images[0] === "object"
                    ? (item.product.images[0].thumbnailURL ?? "placeholder.png") 
                    : "/placeholder.png"
              return (
                <div key={item.id} className="flex items-center justify-between py-4 border-b">
                  <div className='flex gap-4 items-center'>
                      <Image
                      src={productImage}
                      alt={item.product.title}
                      width={80}
                      height={80}
                      />
                    <div>
                      <h3 className="font-medium">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">
                        {variant?.size} / {variant?.color}
                      </p>
                      <div className="flex items-center mt-1">
                        <button
                          onClick={() => deleteCartItem({
                            itemId: item.id!, 
                            removeCompletely: false})}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (typeof item.product === 'object' && item.product !== null && item.variantId) {
                              addCartItem({
                               selectedVariantId: item.variantId,
                               product: item.product})
                            }
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatNairaPrice(variant?.price! * item.quantity)}</p>
                    <button
                      onClick={() => deleteCartItem({
                        itemId: item.id!, 
                        removeCompletely: true
                      })}
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
        <SheetFooter className="border-t flex !flex-col items-center">
            <div className="flex justify-between items-center my-4 px-2 w-full">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatNairaPrice((cart.total ?? 0) )}</span>
            </div>
            <SheetClose asChild>
              <Button className="w-full !mr-2 mt-2 mb-6" 
                onClick={() => router.push('/checkout')}
                disabled={cart.items?.length === 0}>
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
