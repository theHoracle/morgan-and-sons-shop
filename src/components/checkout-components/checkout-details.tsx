"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummary } from "./order-summary"
import { Input } from "../ui/input";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useGetCart } from "@/hooks/cart";
import { CheckIcon } from "lucide-react";

export function CheckoutDetails(props: {
    
}) {
    const { data: cart } = useGetCart(); 
    const [name, setName] = useState("")

    const onPaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }



    return (
        <div className="flex w-full flex-col-reverse md:grid md:grid-cols-3 gap-8">
            <div className="col-span-2 w-full md:px-0">
            <div className="flex flex-col space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action="" className="grid">
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Full Address"
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
                        <div className="border-2 border-stone-700 rounded-md p-4 ">
                            <CheckIcon className="fill-green-500" />
                            <span className="">
                                Your order will be delivered to the address you provided above on <strong>7th of August</strong>.
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Payment method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="paymentOnDelivery" 
                          onChange={onPaymentMethodChange} name="paymentMethod" >
                            <div className="flex flex-col space-y-4 w-full">
                                <div className="flex items-center gap-4 border-2 border-stone-700 rounded-md">
                                    <RadioGroupItem id="r1" value="paymentOnDelivery" />
                                    <div className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Pay now with Paystack
                                        </h4>
                                        <p>Pay when you receive your order</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-2 border-stone-700 rounded-md">
                                    <RadioGroupItem id="r2" value="paymentOnDelivery" />
                                    <div className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Paymenet on Delivery
                                        </h4>
                                        <p>Pay when you receive your order</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-2 border-stone-700 rounded-md">
                                    <RadioGroupItem id="r1" value="paymentOnDelivery" />
                                    <div className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Pick up
                                        </h4>
                                        <p>Make yout order and make a stop at our location to pick up your order</p>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>
            </div>
            <div className="col-span-1 w-full">
               {cart && <OrderSummary 
                    cartId={cart.id} 
                    cartSubTotal={cart.total}
                    fullName={name}
                    />    }
            </div>
            </div>
    )
}