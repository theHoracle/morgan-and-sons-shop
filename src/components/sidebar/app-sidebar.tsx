"use client"
import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"
import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Menu } from "@/payload-types"
import { usePathname } from "next/navigation"

interface AppSidebarProps {
  menus:Menu[],
}
export function AppSidebar({ 
  menus, ...props 
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Morgan and Sons</span>
                  <span className="text-sm">supply store</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menus.map((menu, index) => (
              <Collapsible
                key={menu.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <span className="truncate">{menu.title}</span>{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {Array.isArray(menu.categories?.docs) && menu.categories?.docs.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                      {menu.categories.docs?.filter((category) => typeof category !== 'number')
                         .map((category) => (
                          <SidebarMenuSubItem key={category.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname.includes(category.slug)} 
                              >
                                <a href={`/${category.slug}`}
                                className="truncate"
                                >{category.name}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                         ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
