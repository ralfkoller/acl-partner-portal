"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { faqCategories, faqItems } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function createFaqCategory(data: { name: string; description?: string; sortOrder?: number }) {
  try {
    await db.insert(faqCategories).values({
      id: nanoid(),
      name: data.name,
      description: data.description || null,
      sortOrder: data.sortOrder ?? 0,
      createdAt: new Date().toISOString(),
    })
    revalidatePath("/admin/wiki")
    revalidatePath("/wiki")
    return { success: true }
  } catch (err) {
    console.error("[createFaqCategory]", err)
    return { error: "Kategorie konnte nicht erstellt werden." }
  }
}

export async function updateFaqCategory(id: string, data: { name: string; description?: string; sortOrder?: number }) {
  try {
    await db.update(faqCategories).set({
      name: data.name,
      description: data.description || null,
      sortOrder: data.sortOrder ?? 0,
    }).where(eq(faqCategories.id, id))
    revalidatePath("/admin/wiki")
    revalidatePath("/wiki")
    return { success: true }
  } catch (err) {
    console.error("[updateFaqCategory]", err)
    return { error: "Kategorie konnte nicht aktualisiert werden." }
  }
}

export async function deleteFaqCategory(id: string) {
  try {
    await db.delete(faqCategories).where(eq(faqCategories.id, id))
    revalidatePath("/admin/wiki")
    revalidatePath("/wiki")
    return { success: true }
  } catch (err) {
    console.error("[deleteFaqCategory]", err)
    return { error: "Kategorie konnte nicht gelöscht werden." }
  }
}

export async function createFaqItem(data: {
  categoryId: string
  question: string
  answer: unknown
  sortOrder?: number
  isPublished?: boolean
}) {
  try {
    await db.insert(faqItems).values({
      id: nanoid(),
      categoryId: data.categoryId,
      question: data.question,
      answer: JSON.stringify(data.answer),
      sortOrder: data.sortOrder ?? 0,
      isPublished: data.isPublished ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    revalidatePath("/admin/wiki")
    revalidatePath("/wiki")
    return { success: true }
  } catch (err) {
    console.error("[createFaqItem]", err)
    return { error: "FAQ-Eintrag konnte nicht erstellt werden." }
  }
}

export async function updateFaqItem(id: string, data: {
  categoryId: string
  question: string
  answer: unknown
  sortOrder?: number
  isPublished?: boolean
}) {
  try {
    await db.update(faqItems).set({
      categoryId: data.categoryId,
      question: data.question,
      answer: JSON.stringify(data.answer),
      sortOrder: data.sortOrder ?? 0,
      isPublished: data.isPublished ?? true,
      updatedAt: new Date().toISOString(),
    }).where(eq(faqItems.id, id))
    revalidatePath("/admin/wiki")
    revalidatePath("/wiki")
    return { success: true }
  } catch (err) {
    console.error("[updateFaqItem]", err)
    return { error: "FAQ-Eintrag konnte nicht aktualisiert werden." }
  }
}

export async function deleteFaqItem(id: string) {
  try {
    await db.delete(faqItems).where(eq(faqItems.id, id))
    revalidatePath("/admin/wiki")
    revalidatePath("/wiki")
    return { success: true }
  } catch (err) {
    console.error("[deleteFaqItem]", err)
    return { error: "FAQ-Eintrag konnte nicht gelöscht werden." }
  }
}
