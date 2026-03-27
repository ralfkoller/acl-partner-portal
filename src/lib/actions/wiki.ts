"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createFaqCategory(data: { name: string; description?: string; sort_order?: number }) {
  const supabase = await createClient()
  const { error } = await supabase.from("faq_categories").insert({
    name: data.name,
    description: data.description || null,
    sort_order: data.sort_order ?? 0,
  })
  if (error) return { error: error.message }
  revalidatePath("/admin/wiki")
  revalidatePath("/wiki")
  return { success: true }
}

export async function updateFaqCategory(id: string, data: { name: string; description?: string; sort_order?: number }) {
  const supabase = await createClient()
  const { error } = await supabase.from("faq_categories").update({
    name: data.name,
    description: data.description || null,
    sort_order: data.sort_order ?? 0,
  }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/wiki")
  revalidatePath("/wiki")
  return { success: true }
}

export async function deleteFaqCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("faq_categories").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/wiki")
  revalidatePath("/wiki")
  return { success: true }
}

export async function createFaqItem(data: { category_id: string; question: string; answer: any; sort_order?: number; is_published?: boolean }) {
  const supabase = await createClient()
  const { error } = await supabase.from("faq_items").insert({
    category_id: data.category_id,
    question: data.question,
    answer: data.answer,
    sort_order: data.sort_order ?? 0,
    is_published: data.is_published ?? true,
  })
  if (error) return { error: error.message }
  revalidatePath("/admin/wiki")
  revalidatePath("/wiki")
  return { success: true }
}

export async function updateFaqItem(id: string, data: { category_id: string; question: string; answer: any; sort_order?: number; is_published?: boolean }) {
  const supabase = await createClient()
  const { error } = await supabase.from("faq_items").update({
    category_id: data.category_id,
    question: data.question,
    answer: data.answer,
    sort_order: data.sort_order ?? 0,
    is_published: data.is_published ?? true,
  }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/wiki")
  revalidatePath("/wiki")
  return { success: true }
}

export async function deleteFaqItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("faq_items").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/wiki")
  revalidatePath("/wiki")
  return { success: true }
}
