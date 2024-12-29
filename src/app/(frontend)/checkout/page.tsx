import { getCartById, getCookieCart } from "@/components/cart/action"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatNairaPrice } from "@/lib/helpers"
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
                <div className="flex items-center justify-between max-w-4xl h-full">
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
            <div className="max-w-4xl mx-4">
            <h1 className="text-2xl font-bold tracking-tight leading-tight">
                Checkout
            </h1>
            <div className="flex w-full md:mx-10  flex-col-reverse md:grid md:grid-cols-3 gap-8">
            <div className="col-span-2 w-full ">
            <div className="flex flex-col space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" className="grid">

                        </form>
                    </CardContent>
                </Card>

                {/* delivery details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" className="grid">

                        </form>
                    </CardContent>
                </Card>

                {/* Payment type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" className="grid">

                        </form>
                    </CardContent>
                </Card>
            </div>
            </div>
            <div className="col-span-1 w-full md:mt-20">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <ul className="flex flex-col divide-y border-stone-400">
                            <li>
                                <span className="flex items-center py-2 justify-between">
                                    Subtotal:
                                    <p>{formatNairaPrice(cart.total ?? 0)}</p>
                                </span>
                                <span className="flex items-center py-2 justify-between">
                                    Processing fee:
                                    <p>{formatNairaPrice(PROCESSING_FEE)}</p>
                                </span>
                            </li>
                            <li>
                                <span className="flex items-center py-2 justify-between">
                                    Total:
                                    <p>{formatNairaPrice(PROCESSING_FEE + (cart.total ?? 0))}</p>
                                </span>
                            </li>
                        </ul>
                        <Button size="lg" className="w-full" >
                            Confirm Order
                        </Button>
                      </div>
                    </CardContent>
                </Card>
            </div>
            </div>
            </div>
        </div>
    )
}

export default CheckOutPage