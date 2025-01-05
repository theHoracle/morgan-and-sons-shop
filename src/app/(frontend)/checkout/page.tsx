import { CheckoutDetails } from "@/components/checkout-components/checkout-details"
import { getServerSideUser } from "@/lib/session"
import { cookies } from "next/headers"

const CheckOutPage = async () => {
    const nextCookies = await cookies()
    const { user } = await getServerSideUser(nextCookies)   
    return (  
            <div className="w-screen max-w-4xl px-4 mx-4 lg:mx-auto">
            <h1 className="text-2xl font-bold py-4 tracking-tight leading-tight">
                Checkout
            </h1>
            <CheckoutDetails user={user} />
            </div>
    )
}

export default CheckOutPage
