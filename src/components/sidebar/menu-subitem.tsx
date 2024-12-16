"use client"

import { usePathname } from "next/navigation"
import { SidebarMenuSubItem, SidebarMenuSubButton } from "../ui/sidebar"

const MenuSubItem = (props: {
    categorySlug: string,
    categoryName: string
}) => {
    const { categorySlug, categoryName } = props
    const pathname = usePathname()

    return <SidebarMenuSubItem key={categoryName}>
    <SidebarMenuSubButton
      asChild
      isActive={pathname.includes(categorySlug)} 
    >
      <a href={categorySlug}>{categoryName}</a>
    </SidebarMenuSubButton>
  </SidebarMenuSubItem>
}

export default MenuSubItem