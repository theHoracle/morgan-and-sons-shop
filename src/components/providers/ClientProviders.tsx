"use client"
import { useGetCart } from "@/hooks/cart"
import { CartProvider } from "../cart/cart-context"
import { SidebarProvider } from "../ui/sidebar"
import QueryProvider from "./QueryProvider"

const ClientProviders = ({
    children
}: {
    children: React.ReactNode
}) => {
   
    return <SidebarProvider>
        <QueryProvider>
            <Cart>
            {children}
            </Cart>
        </QueryProvider>
    </SidebarProvider>
}

export default ClientProviders

const Cart = ({
    children
}: {
    children: React.ReactNode
}) => {
    const { data: cart } = useGetCart()
    return <CartProvider initialCart={cart}>
        {children}
    </CartProvider>
}