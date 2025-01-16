import { CheckoutDetails } from "@/components/checkout-components/checkout-details"
import { getServerSideUser } from "@/lib/session"
import { cookies } from "next/headers"

const CheckOutPage = async () => {
     
    return (  
            <div className="">
            <h1 className="text-2xl font-bold py-4 tracking-tight leading-tight">
                Checkout
            </h1>
            <CheckoutDetails />
            </div>
    )
}

export default CheckOutPage
