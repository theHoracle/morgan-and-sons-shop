"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummary } from "./order-summary"
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { addDeliveryDetails } from "@/app/(frontend)/checkout/action";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { User } from "@/payload-types";
import { useGetCart } from "@/hooks/cart";

const formSchema = z.object({
    address: z.string().min(8, "Address is too short"),
    phoneNumber: z.string().min(11, "Phone number is too short"),
    fullName: z.string().min(3, "Name is too short"),
})

export function CheckoutDetails(props: {
    user: User | null
}) {
    const { data: cart } = useGetCart();
    console.log(cart);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    
    const userDeliveryDetails = props.user?.deliveryDetails;
    type UserDeliveryDetails = typeof userDeliveryDetails;
    const [selectedDeliveryDetails, setSelectedDeliveryDetails] = useState<NonNullable<UserDeliveryDetails>[0] | null>(userDeliveryDetails ? userDeliveryDetails[0] : null);
          
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
                            <div className="flex flex-col space-y-2 rounded-lg p-4 border-2 border-stone-300">
                                <p>No address selected</p>
                            </div>
                        )} 
                        <div>
                            <DeliveryDetailsForm userId={props.user?.id}
                                userDeliveryDetails={userDeliveryDetails}
                                setSelectedDeliveryDetails={setSelectedDeliveryDetails}
                            />
                        </div>
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
                                <div className="flex items-center gap-4 border-2 border-stone-300 p-4 rounded-lg">
                                    <RadioGroupItem id="r1" value="paystackPayment" />
                                    <label htmlFor="r1" className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Pay now with Paystack
                                        </h4>
                                        <p>Pay when you receive your order</p>
                                    </label>
                                </div>
                                <div className="flex items-center gap-4 border-2 border-stone-500 p-4 rounded-lg">
                                    <RadioGroupItem id="r2" value="paymentOnDelivery" />
                                    <label htmlFor="r2" className="flex flex-col items-start">
                                        <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                            Paymenet on Delivery
                                        </h4>
                                        <p>Pay when you receive your order</p>
                                    </label>
                                </div>
                                <div className="flex items-center gap-4 border-2 border-stone-500 p-4 rounded-lg">
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
               {cart && 
               <OrderSummary 
                    cartId={cart.id}
                    cartSubTotal={cart.total}
                    deliveryDetail={selectedDeliveryDetails}
                 />    
                }
            </div>
            </div>
    )
}


const DeliveryDetailsForm = (props: {
    userId: User["id"] | undefined,
    userDeliveryDetails: User["deliveryDetails"],
    setSelectedDeliveryDetails: (details: NonNullable<User["deliveryDetails"]>[0]) => void
}) => {
    const [openForm, setOpenForm] = useState(false);
    const form  = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
                address: "",
                phoneNumber: "",
                fullName: "",
        },
      });

    
    const submitForm = async (values: z.infer<typeof formSchema>) => {
        const res = await addDeliveryDetails(((props.userId ?? "")), {...values});
        if(res.success) {
            toast.success("Address added successfully");
            return;
        }
        toast.error(res.error);
    }


    return <Dialog>
    <DialogTrigger>
        <Button>Edit delivery detail</Button>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Select an address</DialogTitle>
        </DialogHeader>
        <div className="w-full rounded-lg bg-stone-300 px-4 py-2 flex items-center justify-between cursor-pointer transition-all"
        onClick={() => setOpenForm(!openForm)}
        >
            Add new address
            {openForm ? (
                <ChevronDown className="size-5 " />
            ) : (
                <ChevronUp className="size-5 " />
            )}
        </div>
        {openForm &&
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)}
            className="flex flex-col space-y-4">
                <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Jon Doe" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only" >
                        Enter your Name
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="08012345678" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only" >
                        Enter your email
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                        <Input placeholder="123, Main Street" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only" >
                        Enter your Address
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Add Details</Button>
            </form>
        </Form>}
    </DialogContent>
</Dialog>
}