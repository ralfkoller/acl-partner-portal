"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createFileRecord(data: {
  name: string
  description?: string
  category_id?: string
  storage_path: string
  file_size: number
  mime_type: string
  is_published: boolean
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from("files").insert({
    ...data,
    uploaded_by: user?.id,
    description: data.description || null,
    category_id: data.category_id || null,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/dateien")
  revalidatePath("/dateien")
  return { success: true }
}

export async function deleteFile(id: string, storagePath: string) {
  const supabase = await createClient()

  // Delete from storage first
  await supabase.storage.from("portal-files").remove([storagePath])

  // Then delete record
  const { error } = await supabase.from("files").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/dateien")
  revalidatePath("/dateien")
  return { success: true }
}

export async function createFileCategory(data: {
  name: string
  description?: string
  sort_order?: number
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("file_categories").insert({
    name: data.name,
    description: data.description || null,
    sort_order: data.sort_order ?? 0,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/dateien")
  revalidatePath("/dateien")
  return { success: true }
}

export async function deleteFileCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("file_categories").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/dateien")
  revalidatePath("/dateien")
  return { success: true }
}
