import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ShoppingCart } from "lucide-react";
import { getPayload } from 'payload'
import config from '@payload-config'
import { payload } from "@/payload";

export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { docs: menus } = await payload.find({
      collection: 'menu',
      depth: 2
    })
    
    return (
        <>
        <AppSidebar menus={menus} />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
              <div className="flex items-center gap-2">  
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Indetifications
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart />
            </div>
            </header>
            <div className="flex flex-1 flex-col p-4">
            {children}
            </div>
        </SidebarInset>
        </>
    )
}