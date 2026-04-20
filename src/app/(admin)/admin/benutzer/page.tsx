import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { AdminUsersList } from "@/components/admin/admin-users-list"

export const metadata = {
  title: "Benutzer verwalten",
}

export default async function AdminBenutzerPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Benutzer verwalten</h1>
        <p className="text-sm text-white/60 mt-1">
          Verwalten Sie Partner-Zugänge und Rollen.
        </p>
      </div>

      <AdminUsersList users={allUsers} />
    </>
  )
}
