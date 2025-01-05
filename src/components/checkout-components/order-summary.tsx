"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNairaPrice } from "@/lib/helpers"
import { Button } from "../ui/button";
import { createPaymentSession } from "@/app/(frontend)/checkout/action";
import { toast } from "sonner";
import { User } from "@/payload-types";
import { useGetCart } from "@/hooks/cart";


export function OrderSummary(props: {
    deliveryDetail: NonNullable<User["deliveryDetails"]>[0] | null,
}) {
    const PROCESSING_FEE = 1000;
    const { data: cart } = useGetCart();
    console.log(cart);
    const { deliveryDetail } = props;
    console.log("OrderSummary props: ", props)
    
    if(!cart || !cart.items) return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Cart is empty</p>
            </CardContent>
        </Card>
    )
    const cartTotal = cart.total ? cart.total : cart.items.reduce((sum, item) => sum += (item.subTotal ?? 0), 0);
    const orderTotal = PROCESSING_FEE + cartTotal

    async function handleConfirmOrder() {
        // create payment session
        if(!deliveryDetail || !cart) return;
        const response = await createPaymentSession({
            cartId: cart.id,
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
                <p>{formatNairaPrice(orderTotal)}</p>
                </span>
                </li>
                </ul>
                <Button 
                size="lg" className="w-full"
                onClick={handleConfirmOrder}
                disabled={!deliveryDetail}
                >
                Confirm Order
                </Button>
            </div>
            </CardContent>
</Card>
    )
}