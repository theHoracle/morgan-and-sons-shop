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
        <div className="relative h-screen w-screen flex flex-col items-center" >
            <header className="flex flex-col items-center w-screen px-4 h-16 border-b shadow-sm">
                <div className="flex items-center justify-between max-w-4xl h-full w-full">
                    <h1 className="text-2xl font-extrabold leading-tight tracking-tight">M&S</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/contact"
                        className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2")}>
                            Contact us 
                        </Link>
                        <Separator orientation="vertical" className="h-8 hidden md:inline-block" />
                        <Link href="/" 
                        className={cn(buttonVariants({ variant: "link" }), "items-center gap-2 hidden md:flex")}>
                            Continue shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </header>
            <div className="w-screen max-w-4xl px-4 mx-4">
            <h1 className="text-2xl font-bold py-4 tracking-tight leading-tight">
                Checkout
            </h1>
            <CheckoutDetails user={user} />
            </div>
        </div>
    )
}

export default CheckOutPage
