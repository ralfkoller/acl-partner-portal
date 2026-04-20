import { db } from "@/lib/db"
import { events, eventRegistrations, users } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { AdminEventsList } from "@/components/admin/admin-events-list"

export const metadata = {
  title: "Events verwalten",
}

export default async function AdminKalenderPage() {
  const [allEvents, allRegs] = await Promise.all([
    db.select().from(events).orderBy(desc(events.startDate)),
    db
      .select({
        eventId: eventRegistrations.eventId,
        fullName: users.fullName,
        company: users.company,
      })
      .from(eventRegistrations)
      .leftJoin(users, eq(eventRegistrations.userId, users.id)),
  ])

  const regsByEvent: Record<string, Array<{ fullName: string; company: string | null }>> = {}
  for (const reg of allRegs) {
    if (reg.eventId) {
      if (!regsByEvent[reg.eventId]) regsByEvent[reg.eventId] = []
      regsByEvent[reg.eventId].push({
        fullName: reg.fullName ?? "Unbekannt",
        company: reg.company ?? null,
      })
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Events verwalten</h1>
        <p className="text-sm text-white/60 mt-1">
          Erstellen und verwalten Sie Events und Teilnehmerlisten.
        </p>
      </div>

      <AdminEventsList events={allEvents} registrations={regsByEvent} />
    </>
  )
}
