import { cookies, headers as nextHeaders } from "next/headers"
import { payload } from "@/payload";

export async function getJWTSession() {
  const session = (await cookies()).get("JWTSession")?.value;
  if (!session) return null;
  return session;
}

export async function setJWTSession(token: string) {
  const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  (await cookies()).set("JWTSession", token, {
    expires: expiresInOneDay,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
}

export async function getUser() {
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })
  return user
}