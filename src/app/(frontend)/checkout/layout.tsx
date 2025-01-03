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
        <header className="flex flex-col items-center w-screen px-4 h-16 border-b shadow-sm">
                <div className="flex items-center justify-between max-w-4xl h-full w-full">
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
        {children}
    </main>
}