"use client"

import { signupUser } from "@/app/(frontend)/login/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
})

const SignupTab = () => {
    const form  = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
          confirmPassword: "",
        },
    });
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      if(values.password !== values.confirmPassword) {
        toast.error("Passwords do not match.")    
      }
      const res = await signupUser({
            email: values.email,
            password: values.password
        })
      if(res && !res.status) {
        toast.error("Signup failed. Please try again.")
        console.log(res.error)
        return
      }
      router.refresh()
      toast.success("Signup successful. Please login.")
    }
    
    return (
        <Form {...form}>    
            <form className="space-y-2.5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="shop@here.com" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                        Enter your email
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                        Enter your Password
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormDescription className="sr-only">
                        Enter your password again
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button className="w-full flex items-center" disabled={form.formState.isSubmitting} type="submit">
                Submit
                {form.formState.isSubmitting && <Loader2 className="size-5 animate-spin ml-1" />}    
            </Button>
            </form>
        </Form>
    )
}

export default SignupTab