"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function updateUserRole(userId: string, role: "admin" | "partner") {
  const supabase = await createClient()
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)

  if (error) return { error: error.message }
  revalidatePath("/admin/benutzer")
  return { success: true }
}

export async function getUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const company = formData.get("company") as string
  const role = (formData.get("role") as "admin" | "partner") ?? "partner"

  const adminClient = createAdminClient()

  // Auth-User anlegen — user_metadata wird vom Trigger `on_auth_user_created`
  // automatisch in public.profiles übernommen (full_name, company, role).
  // Kein manueller profiles-INSERT nötig.
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // sofort aktiv, keine Bestätigungs-Email
    user_metadata: {
      full_name: fullName,
      company: company || null,
      role,
    },
  })

  if (authError) return { error: authError.message }
  if (!authData.user) return { error: "Benutzer konnte nicht erstellt werden." }

  revalidatePath("/admin/benutzer")
  return { success: true }
}

export async function inviteUser(formData: FormData) {
  const email = formData.get("email") as string
  const fullName = formData.get("full_name") as string
  const company = formData.get("company") as string
  const role = (formData.get("role") as "admin" | "partner") ?? "partner"

  const adminClient = createAdminClient()

  // Einladungs-Email via Supabase senden.
  // `data` landet in raw_user_meta_data und wird vom Trigger `on_auth_user_created`
  // beim ersten Akzeptieren der Einladung automatisch in public.profiles übernommen.
  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login`,
      data: { full_name: fullName, company: company || null, role },
    }
  )

  if (inviteError) return { error: inviteError.message }
  if (!inviteData.user) return { error: "Einladung konnte nicht gesendet werden." }

  revalidatePath("/admin/benutzer")
  return { success: true }
}
