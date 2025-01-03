import { formatNairaPrice } from "@/lib/helpers";
import { payload } from "@/payload";
import Image from "next/image";
import { notFound } from "next/navigation";

const OrderSettlementPage = async ({ params }: {params: Promise<{orderId: string}>}) => {
    const { orderId } = await params
    if(!orderId) {
        return notFound()
    }
    const order = await payload.findByID({
        collection: 'orders',
        id: orderId
    })
    if(!order) {
        return notFound()
    }
    console.log(order)
    const cart = typeof order.order === "number" ? await payload.findByID({ collection: 'users-cart', id: order.order }) : order.order
    return (
        <div>
        <h1 className="text-2xl font-bold tracking-tighter leading-tight mb-4">
            Order Confirmation
        </h1>
        <hr className='mt-1 w-full stroke-neutral-700' />
        <p className="text-lg text-neutral-600 mt-4">
            Your order has been received and is being processed. You will receive an email confirmation shortly.
        </p>
        <div>
            <h2 className="text-xl font-semibold mt-8">Order Summary</h2>
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex justify-between">
                    <p>Order ID</p>
                    <p>{order.referenceId}</p>
                </div>
                <div className="flex justify-between">
                    <p>Order Date</p>
                    <p>{new Date(order.createdAt).toDateString()}</p>
                </div>
                <div className="flex justify-between">
                    <p>Order Summary</p>
                    <p>Order Total: {formatNairaPrice(order.orderTotal)}</p>
                    <ul>
                    {cart.items?.map((item) => (
                        <div key={item.id}
                        className="flex items-center gap-4">
                            <div className="relative w-16 h-16 overflow-hidden rounded-md">
                                <Image 
                                    src={typeof item.product === "object" && item.product.images && typeof item.product.images === "object" && typeof item.product.images[0] === "object"
                                        ? item.product.images[0].thumbnailURL ?? "/placeholder.png"
                                        : "/placeholder.png" } 
                                    alt={typeof item.product === "object" && item.product ? item.product.title : "Product image"} 
                                    fill
                                    className="object-cover object-center"
                                />
                            </div>
                            <div>
                                <p className="font-semibold">{typeof item.product === "object" && item.product ? item.product.title : "Product"}</p>
                                <p className="text-sm text-neutral-500">{typeof item.product === "object" && item.product.variantInventory && typeof item.variantId === "string" ? item.product.variantInventory.find(v => v.id === item.variantId)?.size : "Size"} / {typeof item.product === "object" && item.product.variantInventory && typeof item.variantId === "string" ? item.product.variantInventory.find(v => v.id === item.variantId)?.color : "Color"}</p>
                            </div>
                        </div>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
        </div>
    );
}

export default OrderSettlementPage;