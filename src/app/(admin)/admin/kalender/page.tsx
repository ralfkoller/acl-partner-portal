import { createClient } from "@/lib/supabase/server"
import { AdminEventsList } from "@/components/admin/admin-events-list"

export const metadata = {
  title: "Events verwalten",
}

export default async function AdminKalenderPage() {
  const supabase = await createClient()

  const [eventsResult, registrationsResult] = await Promise.all([
    supabase.from("events").select("*").order("start_date", { ascending: false }),
    supabase.from("event_registrations").select("event_id, profiles(full_name, company)"),
  ])

  // Group registrations by event
  const regsByEvent: Record<string, Array<{ full_name: string; company: string | null }>> = {}
  const regsData = (registrationsResult.data ?? []) as Array<{
    event_id: string
    profiles: { full_name: string | null; company: string | null } | null
  }>
  for (const reg of regsData) {
    if (reg.event_id) {
      if (!regsByEvent[reg.event_id]) regsByEvent[reg.event_id] = []
      regsByEvent[reg.event_id].push({
        full_name: reg.profiles?.full_name ?? "Unbekannt",
        company: reg.profiles?.company ?? null,
      })
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Events verwalten</h1>
        <p className="text-sm text-acl-gray mt-1">
          Erstellen und verwalten Sie Events und Teilnehmerlisten.
        </p>
      </div>

      <AdminEventsList events={eventsResult.data ?? []} registrations={regsByEvent} />
    </>
  )
}
