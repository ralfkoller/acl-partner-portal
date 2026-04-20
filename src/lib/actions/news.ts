"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { news } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getUser } from "@/lib/auth/session"
import { nanoid } from "nanoid"

export async function createNews(data: {
  title: string
  content: unknown
  excerpt?: string
  isPublished: boolean
}) {
  const user = await getUser()

  try {
    await db.insert(news).values({
      id: nanoid(),
      title: data.title,
      content: JSON.stringify(data.content),
      excerpt: data.excerpt || null,
      authorId: user?.id ?? null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    revalidatePath("/admin/news")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("[createNews]", err)
    return { error: "News konnte nicht erstellt werden." }
  }
}

export async function updateNews(
  id: string,
  data: {
    title: string
    content: unknown
    excerpt?: string
    isPublished: boolean
  }
) {
  try {
    await db.update(news).set({
      title: data.title,
      content: JSON.stringify(data.content),
      excerpt: data.excerpt || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }).where(eq(news.id, id))
    revalidatePath("/admin/news")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("[updateNews]", err)
    return { error: "News konnte nicht aktualisiert werden." }
  }
}

export async function deleteNews(id: string) {
  try {
    await db.delete(news).where(eq(news.id, id))
    revalidatePath("/admin/news")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("[deleteNews]", err)
    return { error: "News konnte nicht gelöscht werden." }
  }
}

export async function toggleNewsPublished(id: string, isPublished: boolean) {
  try {
    await db.update(news).set({
      isPublished,
      publishedAt: isPublished ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    }).where(eq(news.id, id))
    revalidatePath("/admin/news")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("[toggleNewsPublished]", err)
    return { error: "Status konnte nicht geändert werden." }
  }
}
