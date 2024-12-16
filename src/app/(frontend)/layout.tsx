import type { Metadata } from 'next';
import "./globals.css"
import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Geist } from 'next/font/google'

const { NEXT_PUBLIC_URL } = process.env
export const metadata: Metadata = {
    title: {
        template: "%s | Morgan and Sons",
        default: "Morgan and Sons"
    },
    openGraph: {
        description: "Morgan and Sons supplies store!",
        url: NEXT_PUBLIC_URL!,
        siteName: "Morgan and Sons",
    },
}


const geist = Geist({
    subsets: ['latin'],
})

export default function RootLayout({
    children
}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geist.className} antialiased`}>
            <SidebarProvider>
                
              {children}
          </SidebarProvider>
        </body>
        </html>
    )
}

export const revalidate = 86400; // One day