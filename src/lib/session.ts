import { cookies, headers as nextHeaders } from "next/headers"
import { payload } from "@/payload";
import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { User } from "@/payload-types";

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

export const getServerSideUser = async (
  cookies: NextRequest["cookies"] | ReadonlyRequestCookies
) => {
  const token = cookies.get("JWTSession")?.value;
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  const { user } = (await meRes.json()) as { user: User | null };
  return { user };
};

export async function getUser() {
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })
  return user
}

export async function logoutUser() {
  (await cookies()).delete("JWTSession")
}