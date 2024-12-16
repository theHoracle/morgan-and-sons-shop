import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return <div className="grid place-items-center size-full">    
        <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-2xl font-semibold">404 - Page Not Found</p>
            <Link
            href="/"
            className={buttonVariants()}
            >GO HOME</Link>
        </div>
    </div>
}