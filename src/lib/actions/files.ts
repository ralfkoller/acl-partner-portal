"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { files, fileCategories } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getUser } from "@/lib/auth/session"
import { nanoid } from "nanoid"
import fs from "fs/promises"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

export async function createFileRecord(data: {
  name: string
  description?: string
  category_id?: string
  storage_path: string
  file_size: number
  mime_type: string
  is_published: boolean
}) {
  const user = await getUser()

  try {
    await db.insert(files).values({
      id: nanoid(),
      name: data.name,
      description: data.description || null,
      categoryId: data.category_id || null,
      storagePath: data.storage_path,
      fileSize: data.file_size,
      mimeType: data.mime_type,
      uploadedBy: user?.id ?? null,
      isPublished: data.is_published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    revalidatePath("/admin/dateien")
    revalidatePath("/dateien")
    return { success: true }
  } catch (err) {
    console.error("[createFileRecord]", err)
    return { error: "Datei-Eintrag konnte nicht erstellt werden." }
  }
}

export async function deleteFile(id: string, storagePath: string) {
  try {
    // Physische Datei löschen
    const absPath = path.join(UPLOADS_DIR, storagePath)
    await fs.unlink(absPath).catch(() => {
      // Ignorieren wenn Datei nicht existiert
    })

    await db.delete(files).where(eq(files.id, id))
    revalidatePath("/admin/dateien")
    revalidatePath("/dateien")
    return { success: true }
  } catch (err) {
    console.error("[deleteFile]", err)
    return { error: "Datei konnte nicht gelöscht werden." }
  }
}

export async function createFileCategory(data: {
  name: string
  description?: string
  sort_order?: number
}) {
  try {
    await db.insert(fileCategories).values({
      id: nanoid(),
      name: data.name,
      description: data.description || null,
      sortOrder: data.sort_order ?? 0,
      createdAt: new Date().toISOString(),
    })
    revalidatePath("/admin/dateien")
    revalidatePath("/dateien")
    return { success: true }
  } catch (err) {
    console.error("[createFileCategory]", err)
    return { error: "Kategorie konnte nicht erstellt werden." }
  }
}

export async function deleteFileCategory(id: string) {
  try {
    await db.delete(fileCategories).where(eq(fileCategories.id, id))
    revalidatePath("/admin/dateien")
    revalidatePath("/dateien")
    return { success: true }
  } catch (err) {
    console.error("[deleteFileCategory]", err)
    return { error: "Kategorie konnte nicht gelöscht werden." }
  }
}
