"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getUser } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function createEvent(data: {
  title: string
  description?: unknown
  location?: string
  eventUrl?: string
  startDate: string
  endDate?: string
  maxSeats?: number
  isPublished: boolean
}) {
  const user = await getUser()

  try {
    await db.insert(events).values({
      id: nanoid(),
      title: data.title,
      description: data.description ? JSON.stringify(data.description) : null,
      location: data.location || null,
      eventUrl: data.eventUrl || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      maxSeats: data.maxSeats || null,
      createdBy: user?.id ?? null,
      isPublished: data.isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    revalidatePath("/admin/kalender")
    revalidatePath("/kalender")
    return { success: true }
  } catch (err) {
    console.error("[createEvent]", err)
    return { error: "Event konnte nicht erstellt werden." }
  }
}

export async function updateEvent(id: string, data: {
  title: string
  description?: unknown
  location?: string
  eventUrl?: string
  startDate: string
  endDate?: string
  maxSeats?: number
  isPublished: boolean
}) {
  try {
    await db.update(events).set({
      title: data.title,
      description: data.description ? JSON.stringify(data.description) : null,
      location: data.location || null,
      eventUrl: data.eventUrl || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      maxSeats: data.maxSeats || null,
      isPublished: data.isPublished,
      updatedAt: new Date().toISOString(),
    }).where(eq(events.id, id))
    revalidatePath("/admin/kalender")
    revalidatePath("/kalender")
    return { success: true }
  } catch (err) {
    console.error("[updateEvent]", err)
    return { error: "Event konnte nicht aktualisiert werden." }
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.delete(events).where(eq(events.id, id))
    revalidatePath("/admin/kalender")
    revalidatePath("/kalender")
    return { success: true }
  } catch (err) {
    console.error("[deleteEvent]", err)
    return { error: "Event konnte nicht gelöscht werden." }
  }
}
