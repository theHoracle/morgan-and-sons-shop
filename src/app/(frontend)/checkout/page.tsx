import { getCartById, getCookieCart } from "@/components/cart/action"
import { CheckoutDetails } from "@/components/checkout-components/checkout-details"
import { OrderSummary } from "@/components/checkout-components/order-summary"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

const CheckOutPage = async () => {
    const PROCESSING_FEE = 1000;
    const cartId = await getCookieCart()
    if(!cartId) redirect("/")
    
    const cart = await getCartById(cartId)
    if(!cart) return notFound()
    
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
                        <Separator orientation="vertical" className="h-8" />
                        <Link href="/" 
                        className={cn(buttonVariants({ variant: "link" }), "flex items-center gap-2")}>
                            Continue shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </header>
            <div className="w-screen max-w-4xl mx-4">
            <h1 className="text-2xl font-bold py-4 tracking-tight leading-tight">
                Checkout
            </h1>
            <CheckoutDetails cart={cart} />
            </div>
        </div>
    )
}

export default CheckOutPage