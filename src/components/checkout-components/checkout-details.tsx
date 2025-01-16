"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummary } from "./order-summary"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetUser } from "./checkout-hooks";
import DeliveryDetailsForm from "./DeliveryDetailsForm";
import { User } from "@/payload-types";

export function CheckoutDetails() {
    type DeliveryDetailT = NonNullable<User["deliveryDetails"]>[0]
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [selectedDeliveryDetails, setSelectedDeliveryDetails] = useState<DeliveryDetailT | undefined>();
    const { data } = useGetUser()
    const userId = data?.userId
    const deliveryDetails = data?.deliveryDetails

    useEffect(() => {
        if(deliveryDetails && !selectedDeliveryDetails) {
            setSelectedDeliveryDetails(deliveryDetails[0])
        }
    }, [deliveryDetails, selectedDeliveryDetails])
    console.log("Selected: ", selectedDeliveryDetails)

    const onPaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    }

    return (
        <div className="flex w-full flex-col-reverse md:grid md:grid-cols-3 gap-8">
            <div className="col-span-2 w-full md:px-0">
            <div className="flex flex-col space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 items-end">
                        {selectedDeliveryDetails ? (
                            <div className="flex flex-col space-y-2 w-full rounded-lg p-4 border-2 border-stone-300">
                                <h3 className="font-semibold text-lg tracking-tight leading-tight">
                                    {selectedDeliveryDetails.fullName}
                                </h3>
                                <p>{selectedDeliveryDetails.address}</p>
                                <p>{selectedDeliveryDetails.phoneNumber}</p>
                            </div>
                        ) :  (
                            <div className="flex flex-col space-y-2 rounded-lg p-4 border-2 w-full border-stone-300">
                                <p>No address selected</p>
                            </div>
                        )} 
                         <DeliveryDetailsForm userId={userId}
                                userDeliveryDetails={deliveryDetails}
                                selectedDeliveryDetail={selectedDeliveryDetails}
                                setSelectedDeliveryDetails={setSelectedDeliveryDetails}
                         />
                    </CardContent>
                </Card>

                {/* delivery details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-stone-500 rounded-lg p-4 flex items-start gap-2 ">
                            <div className="flex items-center justify-center p-2 rounded-full bg-green-500">
                            <CheckIcon className="text-white" />
                            </div>
                            <span className="flex-1">
                                Your order will be delivered to the address you provided above on <strong>{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>.
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
                        <RadioGroup defaultValue="paystackPayment" 
                          onChange={onPaymentMethodChange} name="paymentMethod" >
                            <div className="flex flex-col space-y-4 w-full">
                                <div className="flex items-center gap-4 border border-stone-300 p-4 rounded-lg">
                                    <RadioGroupItem id="r1" value="paystackPayment" />
                                    <label htmlFor="r1" className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Pay now with Paystack
                                        </h4>
                                        <p>Pay when you receive your order</p>
                                    </label>
                                </div>
                                <div className="flex items-center gap-4 border border-stone-300 p-4 rounded-lg">
                                    <RadioGroupItem id="r2" value="paymentOnDelivery" />
                                    <label htmlFor="r2" className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Paymenet on Delivery
                                        </h4>
                                        <p>Pay when you receive your order</p>
                                    </label>
                                </div>
                                <div className="flex items-center gap-4 border border-stone-300 p-4 rounded-lg">
                                    <RadioGroupItem id="r3" value="pickUp" />
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="r3" className="font-semibold text-lg tracking-tight leading-tight">
                                            Pick up in store
                                        </label>
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
               <OrderSummary deliveryDetail={selectedDeliveryDetails} />    
            </div>
            </div>
    )
}