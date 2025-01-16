import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-separator"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Layout ({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return <main>
        <header className="flex items-center w-screen h-16 border-b shadow-sm px-4 md:px-8 lg:px-20">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-2xl font-extrabold leading-tight tracking-tight">M&S</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/contact"
                        className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2")}>
                            Contact us 
                        </Link>
                        <Separator orientation="vertical" className="h-8 hidden md:inline-block" />
                        <Link href="/" 
                        className={cn(buttonVariants({ variant: "link" }), "items-center gap-2 hidden md:flex")}>
                            Continue shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </header>
            <div className="container mx-auto px-4">
        {children}
            </div>
    </main>
}