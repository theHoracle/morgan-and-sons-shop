import { payload } from "@/payload"
import { PayloadRequest } from "payload"


export const POST = async (req: PayloadRequest, res: Response) => {
  const body = req.text ? await req.text() : ''
  const { email, password } = await JSON.parse(body)
  if (!email || !password) {
    return new Response('Email and password are required', { status: 400, statusText: 'Bad Request' })
  }

  const user = await payload.login({
    collection: 'users',
    data: {
      email,
      password
    },
    req,
  })
  
  
  return new Response(JSON.stringify(user), { status: 200, statusText: 'OK' })
}
