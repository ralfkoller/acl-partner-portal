"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getUser } from "@/lib/auth/session"

export async function updateProfile(formData: FormData) {
  const user = await getUser()
  if (!user) return { error: "Nicht angemeldet." }

  const fullName = (formData.get("full_name") as string)?.trim()
  const company = (formData.get("company") as string)?.trim() || null

  if (!fullName) return { error: "Name ist erforderlich." }

  try {
    await db
      .update(users)
      .set({ fullName, company, updatedAt: new Date().toISOString() })
      .where(eq(users.id, user.id))
    revalidatePath("/profil")
    return { success: true }
  } catch (err) {
    console.error("[updateProfile]", err)
    return { error: "Profil konnte nicht gespeichert werden." }
  }
}
