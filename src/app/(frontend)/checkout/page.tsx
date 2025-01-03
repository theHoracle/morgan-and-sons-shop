import { CheckoutDetails } from "@/components/checkout-components/checkout-details"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getServerSideUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"


const CheckOutPage = async () => {
    const nextCookies = await cookies()
    const { user } = await getServerSideUser(nextCookies)   
    return (  
            <div className="w-screen max-w-4xl px-4 mx-4">
            <h1 className="text-2xl font-bold py-4 tracking-tight leading-tight">
                Checkout
            </h1>
            <CheckoutDetails user={user} />
            </div>
    )
}

export default CheckOutPage
