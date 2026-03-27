"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createNews(data: {
  title: string
  content: any
  excerpt?: string
  is_published: boolean
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase.from("news").insert({
    title: data.title,
    content: data.content,
    excerpt: data.excerpt || null,
    author_id: user?.id,
    is_published: data.is_published,
    published_at: data.is_published ? new Date().toISOString() : null,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/news")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateNews(
  id: string,
  data: {
    title: string
    content: any
    excerpt?: string
    is_published: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("news")
    .update({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      is_published: data.is_published,
      published_at: data.is_published ? new Date().toISOString() : null,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/news")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteNews(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("news").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/news")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function toggleNewsPublished(id: string, isPublished: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("news")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/news")
  revalidatePath("/dashboard")
  return { success: true }
}
