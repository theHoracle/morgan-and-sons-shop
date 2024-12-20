"use client"
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