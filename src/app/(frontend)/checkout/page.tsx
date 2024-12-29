import { getCartById, getCookieCart } from "@/components/cart/action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNairaPrice } from "@/lib/helpers"
import { notFound, redirect } from "next/navigation"

const CheckOutPage = async () => {
    const PROCESSING_FEE = 1000;
    const cartId = await getCookieCart()
    if(!cartId) redirect("/")
    
    const cart = await getCartById(cartId)
    if(!cart) return notFound()
    
    return (
        <div >
            <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-8">
            <div className="col-span-2 w-dull">
            <h1 className="text-2xl font-bold tracking-tight leading-tight">
                Checkout
            </h1>
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
            <div className="col-span-1 w-full">
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
    )
}

export default CheckOutPage