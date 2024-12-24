"use client"

import { loginUser } from "@/app/(frontend)/login/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const LoginTab = () => {
    const form  = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      });
      const searchParams = useSearchParams()
        const redirectUrl = searchParams.get("redirect") || "/"

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const res = await loginUser({...values, redirectUrl})
        if(res && !res.status) {
          toast.error("Login failed. Please try again.")
          return
        }
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
                    <FormDescription className="sr-only" >
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
                    <FormDescription className="sr-only">
                        Enter your Password
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



export default LoginTab