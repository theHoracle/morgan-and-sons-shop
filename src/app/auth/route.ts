import { payload } from "@/payload"

export const POST = async (req: Request) => {
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
  })
  
  
  return new Response(JSON.stringify(user), { status: 200, statusText: 'OK' })
}
