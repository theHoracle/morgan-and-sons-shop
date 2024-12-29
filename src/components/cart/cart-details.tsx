"use client"
import { formatNairaPrice } from "@/lib/helpers"
import { UsersCart } from "@/payload-types"
import Image from "next/image"
import { useCart } from "./cart-context";

interface CartDetailsProps {
    cart: UsersCart;
}
const CartDetails = ({  cart }: CartDetailsProps) => {
    const { deleteCartItem, addCartItem } = useCart()
    return cart.items?.map((item: NonNullable<UsersCart["items"]>[0]) => {
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
                    onClick={() => deleteCartItem(item.id!, false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (typeof item.product === 'object' && item.product !== null && item.variantId) {
                        addCartItem(item.variantId, item.product)
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
                onClick={() => deleteCartItem(item.id!, true)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )
      })
}

export default CartDetails