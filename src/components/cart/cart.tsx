"use client"
import { ShoppingCart, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import Link from 'next/link'
import { formatNairaPrice } from '@/lib/helpers'
import Image from 'next/image'
import { useCart } from './cart-context'
import CartDetails from './cart-details'
import { useRouter } from 'next/navigation'

 
export default function Cart() {
  // const { data: cart } = useGetCart()
  const { cart } = useCart();
  const router = useRouter()
  console.log("Cart: ", cart)

  const totalCartItems = cart?.items?.length || 0
  // get total price of all items in the cart

  return ( <Sheet>
    <SheetTrigger asChild>
      <div className="relative p-2 text-gray-600 hover:text-gray-900">
      <ShoppingCart size={24} />
      {totalCartItems > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
            <CartDetails cart={cart} />
          )}
        </div>
        <SheetFooter className="border-t flex !flex-col items-center">
            <div className="flex justify-between items-center my-4 px-2 w-full">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatNairaPrice((cart.total ?? 0) )}</span>
            </div>
            <SheetClose asChild>
              <Button className="w-full !mr-2 mt-2 mb-6" 
              disabled={cart.items?.length === 0}
              onClick={() => router.push('/checkout')}
              >
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