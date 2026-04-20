"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { eventRegistrations } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getUser } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function registerForEvent(eventId: string) {
  const user = await getUser()
  if (!user) return { error: "Nicht angemeldet." }

  try {
    await db.insert(eventRegistrations).values({
      id: nanoid(),
      eventId,
      userId: user.id,
      registeredAt: new Date().toISOString(),
    })
    revalidatePath("/kalender")
    return { success: true }
  } catch (err) {
    console.error("[registerForEvent]", err)
    return { error: "Anmeldung fehlgeschlagen." }
  }
}

export async function unregisterFromEvent(eventId: string) {
  const user = await getUser()
  if (!user) return { error: "Nicht angemeldet." }

  try {
    await db
      .delete(eventRegistrations)
      .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.userId, user.id)))
    revalidatePath("/kalender")
    return { success: true }
  } catch (err) {
    console.error("[unregisterFromEvent]", err)
    return { error: "Abmeldung fehlgeschlagen." }
  }
}
