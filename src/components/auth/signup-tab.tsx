"use client"

import { signupUser } from "@/app/(frontend)/login/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner";

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

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      if(values.password !== values.confirmPassword) {
        toast.error("Passwords do not match.")    
      }
      await signupUser({
            email: values.email,
            password: values.password
        })
    }
    
    return (
        <Form {...form}>    
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="shop@here.com" {...field} />
                    </FormControl>
                    <FormDescription>
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
                    <FormDescription>
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
                    <FormDescription>
                        Enter your password again
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default SignupTab