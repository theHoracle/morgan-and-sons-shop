"use server"

import { setJWTSession } from "@/lib/session"
import { payload } from "@/payload"

export async function loginUser({
    email, password
}: {email: string, password: string}) {
    const { token } = await payload.login({
        collection: "users",
        data: {
            email,
            password
        },
    })
    if(token) await setJWTSession(token)
}

export async function signupUser({email, password}: {email: string, password:string}) {
    const { email:e, password:p } = await payload.create({
        collection: "users",
        data: {
            email,
            password
        }
    })
    if(e && p)  await loginUser({
        email: e,
        password: p
    })
}

