"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { hashPassword } from "@/lib/auth/password"
import { nanoid } from "nanoid"

export async function updateUserRole(userId: string, role: "admin" | "partner") {
  try {
    await db.update(users).set({ role, updatedAt: new Date().toISOString() }).where(eq(users.id, userId))
    revalidatePath("/admin/benutzer")
    return { success: true }
  } catch (err) {
    console.error("[updateUserRole]", err)
    return { error: "Rolle konnte nicht aktualisiert werden." }
  }
}

export async function getUsers() {
  try {
    const data = await db.select().from(users).orderBy(desc(users.createdAt))
    return { data }
  } catch (err) {
    console.error("[getUsers]", err)
    return { error: "Benutzer konnten nicht geladen werden." }
  }
}

export async function createUser(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string
  const fullName = (formData.get("full_name") as string)?.trim()
  const company = (formData.get("company") as string)?.trim() || null
  const role = (formData.get("role") as "admin" | "partner") ?? "partner"

  if (!email || !password || !fullName) return { error: "E-Mail, Passwort und Name sind erforderlich." }

  try {
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) return { error: "Ein Benutzer mit dieser E-Mail existiert bereits." }

    const passwordHash = await hashPassword(password)
    await db.insert(users).values({
      id: nanoid(),
      email,
      passwordHash,
      fullName,
      company,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidatePath("/admin/benutzer")
    return { success: true }
  } catch (err) {
    console.error("[createUser]", err)
    return { error: "Benutzer konnte nicht erstellt werden." }
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  if (!newPassword || newPassword.length < 8) return { error: "Passwort muss mindestens 8 Zeichen lang sein." }
  try {
    const passwordHash = await hashPassword(newPassword)
    await db.update(users)
      .set({ passwordHash, mustChangePassword: true, updatedAt: new Date().toISOString() })
      .where(eq(users.id, userId))
    revalidatePath("/admin/benutzer")
    return { success: true }
  } catch (err) {
    console.error("[resetUserPassword]", err)
    return { error: "Passwort konnte nicht zurückgesetzt werden." }
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId))
    revalidatePath("/admin/benutzer")
    return { success: true }
  } catch (err) {
    console.error("[deleteUser]", err)
    return { error: "Benutzer konnte nicht gelöscht werden." }
  }
}
