"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { comparePassword } from "@/lib/auth/password"
import { setSessionCookie, clearSessionCookie, getUser } from "@/lib/auth/session"

export async function login(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string
  if (!email || !password) return { error: "E-Mail und Passwort sind erforderlich." }

  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(r => r[0] ?? null)
    if (!user) return { error: "E-Mail oder Passwort ist falsch." }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) return { error: "E-Mail oder Passwort ist falsch." }

    await setSessionCookie({ sub: user.id, email: user.email, role: user.role })
    revalidatePath("/", "layout")
    return { redirect: "/dashboard" }
  } catch (err) {
    console.error("[login] Error:", err)
    return { error: "Anmeldung fehlgeschlagen. Bitte erneut versuchen." }
  }
}

export async function logout() {
  await clearSessionCookie()
  revalidatePath("/", "layout")
  redirect("/login")
}

export { getUser }

export async function getSession() {
  const user = await getUser()
  return user
}
