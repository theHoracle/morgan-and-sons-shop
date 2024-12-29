import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Page() {
    return <div className="grid place-items-center h-screen w-screen bg-stone-900 text-stone-100">    
        <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-2xl font-semibold flex space-x-1 items-center">
                404 <Separator /> Page Not Found
            </p>
            <Link
            href="/"
            className={buttonVariants()}
            >GO HOME</Link>
        </div>
    </div>
}