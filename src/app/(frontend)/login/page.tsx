import AuthForm from "@/components/auth/auth-form"
import { Card } from "@/components/ui/card"
import { getUser } from "@/lib/session"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"


// import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const user = await getUser()
  if(user) redirect('/') 
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Morgan and Sons Shop
        </Link>
        <AuthForm />
      </div>
    </div>
  )
}
