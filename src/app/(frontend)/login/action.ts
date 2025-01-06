"use server"
import { mergeUsersCart } from "@/components/cart/action"
import { setJWTSession } from "@/lib/session"
import { payload } from "@/payload"
import { redirect } from "next/navigation"

export async function loginUser({
    email, password, redirectUrl
}: {email: string, password: string, redirectUrl: string}) {
    const { token, user } = await payload.login({
        collection: "users",
        data: {
            email,
            password
        },
    })
    if(token && user.id) {
        await Promise.all([
            mergeUsersCart({ userId: user.id }),
            setJWTSession(token),
        ])
        redirect(redirectUrl)
    }
    return {status: false}
}

export async function signupUser({
    email, password
}: {
    email: string, password:string}) {
    try {
         await payload.create({
            collection: "users",
            data: {
                email,
                password
            }
        })
    } catch (error) {
        return {status: false, error}
    }
}

