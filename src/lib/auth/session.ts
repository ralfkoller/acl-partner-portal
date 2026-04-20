import { cookies } from "next/headers"
import { signJWT, verifyJWT, type JWTPayload } from "./jwt"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { users, type User } from "@/lib/db/schema"

const COOKIE_NAME = "acl_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 Tage in Sekunden

export async function setSessionCookie(payload: Omit<JWTPayload, "iat" | "exp">) {
  const token = await signJWT(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSessionPayload(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyJWT(token)
}

/** Gibt den vollständigen User aus der Datenbank zurück. */
export async function getUser(): Promise<User | null> {
  const session = await getSessionPayload()
  if (!session) return null

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.sub))
      .limit(1)
      .then((rows) => rows[0] ?? null)

    return user
  } catch (err) {
    console.error("[getUser] DB error:", err)
    return null
  }
}
