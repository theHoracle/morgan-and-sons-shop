import { CheckoutDetails } from "@/components/checkout-components/checkout-details"
import { getServerSideUser } from "@/lib/session"
import { cookies } from "next/headers"

const CheckOutPage = async () => {
    const nextCookies = await cookies()
    const { user } = await getServerSideUser(nextCookies)   
    return (  
            <div className="container mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold py-4 tracking-tight leading-tight">
                Checkout
            </h1>
            <CheckoutDetails user={user} />
            </div>
    )
}

export default CheckOutPage
