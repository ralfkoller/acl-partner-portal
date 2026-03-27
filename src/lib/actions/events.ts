"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createEvent(data: {
  title: string
  description?: any
  location?: string
  event_url?: string
  start_date: string
  end_date?: string
  max_seats?: number
  is_published: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from("events").insert({
    title: data.title,
    description: data.description || null,
    location: data.location || null,
    event_url: data.event_url || null,
    start_date: data.start_date,
    end_date: data.end_date || null,
    max_seats: data.max_seats || null,
    created_by: user?.id,
    is_published: data.is_published,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/kalender")
  revalidatePath("/kalender")
  return { success: true }
}

export async function updateEvent(id: string, data: {
  title: string
  description?: any
  location?: string
  event_url?: string
  start_date: string
  end_date?: string
  max_seats?: number
  is_published: boolean
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").update({
    title: data.title,
    description: data.description || null,
    location: data.location || null,
    event_url: data.event_url || null,
    start_date: data.start_date,
    end_date: data.end_date || null,
    max_seats: data.max_seats || null,
    is_published: data.is_published,
  }).eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/kalender")
  revalidatePath("/kalender")
  return { success: true }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/kalender")
  revalidatePath("/kalender")
  return { success: true }
}
