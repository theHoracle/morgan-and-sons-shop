"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummary } from "./order-summary"
import { Input } from "../ui/input";
import { useState } from "react";
import { useCart } from "../cart/cart-context";

export function CheckoutDetails(props: {
    
}) {
const { cart } = useCart();
    const [name, setName] = useState("")
    return (
        <div className="flex w-full flex-col-reverse md:grid md:grid-cols-3 gap-8">
            <div className="col-span-2 w-full px-4 md:px-0">
            <div className="flex flex-col space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" className="grid">
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name"
                             className="w-full" />
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
                <OrderSummary 
                    cartId={cart.id} 
                    cartSubTotal={cart.total}
                    fullName={name}
                    />    
            </div>
            </div>
    )
}