"use client"

import { UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const AuthLinkWithRedirect = ( ) => {
    const pathname = usePathname()
    const href = `/login?redirect=${pathname}`
    return (
        <Link 
        href={href}
        className="hover:bg-stone-950 bg-stone-800 hover:shadow-sm">
              <UserRound />
        </Link>
    )
} 

export default AuthLinkWithRedirect