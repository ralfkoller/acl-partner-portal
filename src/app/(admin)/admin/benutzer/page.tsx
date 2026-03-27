import { createClient } from "@/lib/supabase/server"
import { AdminUsersList } from "@/components/admin/admin-users-list"

export const metadata = {
  title: "Benutzer verwalten",
}

export default async function AdminBenutzerPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Benutzer verwalten</h1>
        <p className="text-sm text-acl-gray mt-1">
          Verwalten Sie Partner-Zugänge und Rollen.
        </p>
      </div>

      <AdminUsersList users={users ?? []} />
    </>
  )
}
