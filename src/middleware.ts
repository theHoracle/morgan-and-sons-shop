import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSideUser } from './lib/session'
 

export async function middleware(request: NextRequest) {
    const { user } = await getServerSideUser(request.cookies)
    // if no user, redirect to login page with redirect param
    if(!user) {
        return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url))
    }
    // redirect user to their requested page
    return NextResponse.next()

}
 
export const config = {
  matcher: ["/checkout"],
}