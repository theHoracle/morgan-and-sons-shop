import AuthLinkWithRedirect from "@/components/auth/add-redirect-link";
import BreadCrumb from "@/components/BreadCrumb";
import Cart from "@/components/cart/cart";
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getServerSideUser } from "@/lib/session";
import { payload } from "@/payload";
import { cookies } from "next/headers";


export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const nextCookies = await cookies()
    const [{ user } , { docs: menus }] = await Promise.all([
      getServerSideUser(nextCookies),
      payload.find({ collection: 'menus', depth: 1 })
    ])
    
    return (
        <>
        <AppSidebar menus={menus}  />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
              <div className="flex items-center gap-2">  
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadCrumb />
            </div>
            <div className="flex items-center gap-2">
            {/*  */}
            {user ? (
              <div className="flex flex-col aspect-square items-center justify-center border border-stone-900 bg-stone-100 text-stone-900 rounded-full px-1 py-0.5">
              <span className="uppercase font-semibold tracking-tight " >
                {user.email.substring(0, 2)}
                </span>
              </div>) : (
              <AuthLinkWithRedirect />
            )}
            <Separator orientation="vertical" className="h-4" />
            <Cart />
            </div>
            </header>
            <div className="flex flex-1 flex-col p-4">
            {children}
            </div>
        </SidebarInset>
        </>
    )
}