"use client"

import { signupUser } from "@/app/(frontend)/login/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

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

    const onSubmit = async () => {
      if(form.getValues("password") === form.getValues("confirmPassword")) {
          await signupUser({
              email: form.getValues("email"),
              password: form.getValues("password")
            })
        }
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                        Enter your Password
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