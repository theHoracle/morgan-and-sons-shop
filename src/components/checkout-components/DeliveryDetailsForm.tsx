import { useIsMobile } from "@/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, ChevronUp } from "lucide-react";
import { User } from "@/payload-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useUpdateInfo } from "./checkout-hooks";

const formSchema = z.object({
    address: z.string().min(8, "Address is too short"),
    phoneNumber: z.string().min(11, "Phone number is too short"),
    fullName: z.string().min(3, "Name is too short"),
})

const DeliveryDetailsForm = (props: {
    userId: User["id"] | undefined,
    userDeliveryDetails: User["deliveryDetails"],
    selectedDeliveryDetail: NonNullable<User["deliveryDetails"]>[0] | undefined,
    setSelectedDeliveryDetails: (details: NonNullable<User["deliveryDetails"]>[0]) => void
}) => {
    const { setSelectedDeliveryDetails, selectedDeliveryDetail, userDeliveryDetails, userId } = props
    const { mutate: addDeliveryDetail } = useUpdateInfo();
    const isMobile = useIsMobile();
    const [openForm, setOpenForm] = useState(isMobile ? true : false);
    
    const form  = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
                address: "",
                phoneNumber: "",
                fullName: "",
        },
      });

    
    
    const submitForm = (values: z.infer<typeof formSchema>) => {
        addDeliveryDetail({
            userId: userId!,
            newDeliveryDetail: values,
        })
        form.reset()
        setOpenForm(false)
        if(userDeliveryDetails) {
            setSelectedDeliveryDetails(userDeliveryDetails[userDeliveryDetails.length - 1]) // setSelectedDeliveryDetails(values)
        }
    }

    return (
        <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit delivery detail</Button>
            </DialogTrigger>
            <DialogContent className="h-3/4 overflow-y-scroll flex flex-col max-w-xl lg:w-3/5">
                <DialogHeader>
                    <DialogTitle>Delivery address</DialogTitle>
                </DialogHeader>
                <div className={`grid lg:grid-cols-2 gap-2 lg:gap-4`}>
                    {userDeliveryDetails ? <div>
                        <RadioGroup defaultValue={selectedDeliveryDetail ? selectedDeliveryDetail.id! : ""} 
                            onChange={(e) => {
                                const selected = userDeliveryDetails?.find(item => item.id === (e.target as HTMLInputElement).value);
                                if(selected) {
                                    setSelectedDeliveryDetails(selected);
                                }
                            }}
                            name="deliveryDetails"
                            >
                            <div className="flex flex-col space-y-4 w-full">
                                {userDeliveryDetails?.map((detail) => (
                                    <div key={detail.id} className="flex items-center gap-4 border-2 border-stone-300 p-4 rounded-lg">
                                        <RadioGroupItem id={detail.id!} value={detail.id!} />
                                        <label htmlFor={ detail.id! } className="flex flex-col items-start">
                                            <h4 className="font-semibold text-lg tracking-tight leading-tight">
                                                {detail.fullName}
                                            </h4>
                                            <p>{detail.address}</p>
                                            <p>{detail.phoneNumber}</p>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div> : <div className="text-center w-full py-8 border border-dashed rounded-lg border-stone-300">
                        NO PREVIOUS DELIVERY DETAIL
                    </div>
                    }
                    <div className="relative">
                        <div className="w-full absolute inset-x-0 h-14 top-0 rounded-md bg-black text-white px-4 py-2 flex items-center justify-between cursor-pointer transition-all"
                        onClick={() => setOpenForm(!openForm)}
                        >
                            Add new delivery detail
                            {openForm ? (
                                <ChevronDown className="size-5 " />
                            ) : (
                                <ChevronUp className="size-5 " />
                            )}
                        </div>
                        {openForm &&
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(submitForm)}
                            className="flex flex-col space-y-4 px-4 pt-4 mt-14 pb-10 bg-stone-200 rounded-bl-lg rounded-br-lg">
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
                        </Form>
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </div>
    )
}

export default DeliveryDetailsForm;