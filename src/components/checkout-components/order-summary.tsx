"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNairaPrice } from "@/lib/helpers"
import { Button } from "../ui/button";
import { createPaymentSession } from "@/app/(frontend)/checkout/action";
import { toast } from "sonner";
import { User } from "@/payload-types";


export function OrderSummary(props: {
    cartId: string | number, 
    cartSubTotal: number | undefined | null,
    deliveryDetail: NonNullable<User["deliveryDetails"]>[0] | null,
}) {
    const PROCESSING_FEE = 1000;
    const  { cartId, cartSubTotal, deliveryDetail } = props;
    if(!cartId || !cartSubTotal) return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Cart is empty</p>
            </CardContent>
        </Card>
    )
    const cartTotal = PROCESSING_FEE + cartSubTotal

    async function handleConfirmOrder() {
        // create payment session
        if(!cartId || !cartSubTotal || !deliveryDetail) return;
        const response = await createPaymentSession({
            cartId,
            unitAmount: cartTotal,
            deliveryDetail
        })
        if(response.success) {
            if(response.sessionUrl) {
                window.location.href = response.sessionUrl;
                toast.success("Redirecting to payment provider...");
            } else {
                toast.error("Payment session URL is missing");
            }
        } else {
            toast.error(response.error);
        }

    }

    return (
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
                <p>{formatNairaPrice(cartTotal)}</p>
                </span>
                <span className="flex items-center py-2 justify-between">
                Processing fee:
                <p>{formatNairaPrice(PROCESSING_FEE)}</p>
                </span>
                </li>
                <li>
                <span className="flex items-center py-2 justify-between">
                Total:
                <p>{formatNairaPrice(PROCESSING_FEE + (cartTotal))}</p>
                </span>
                </li>
                </ul>
                <Button 
                size="lg" className="w-full"
                onClick={handleConfirmOrder}
                disabled={!cartId || !cartSubTotal || !deliveryDetail}
                >
                Confirm Order
                </Button>
            </div>
            </CardContent>
</Card>
    )
}