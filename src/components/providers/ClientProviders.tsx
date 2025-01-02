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
            {children}
        </QueryProvider>
    </SidebarProvider>
}

export default ClientProviders
