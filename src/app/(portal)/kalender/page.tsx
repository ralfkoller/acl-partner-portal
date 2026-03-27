import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { CalendarGrid } from "@/components/portal/calendar-grid"
import { EventCard } from "@/components/portal/event-card"
import { SectionHeader } from "@/components/portal/section-header"
import { Calendar } from "lucide-react"

export const metadata = {
  title: "Kalender",
}

export default async function KalenderPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  const [eventsResult, registrationsResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("start_date", { ascending: true }),
    supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", user.id),
  ])

  const events = eventsResult.data ?? []
  const registeredEventIds = new Set(
    (registrationsResult.data ?? []).map((r) => r.event_id)
  )

  // Count registrations per event
  const regCountsResult = await supabase
    .from("event_registrations")
    .select("event_id")

  const regCounts = (regCountsResult.data ?? []).reduce(
    (acc, r) => {
      if (r.event_id) {
        acc[r.event_id] = (acc[r.event_id] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>
  )

  const upcomingEvents = events.filter(
    (e) => new Date(e.start_date) >= new Date()
  )

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Kalender</h1>
        <p className="text-sm text-acl-gray mt-1">
          Entdecken Sie kommende Events und melden Sie sich direkt an.
        </p>
      </div>

      <CalendarGrid events={events} />

      <SectionHeader title="Kommende Events" />

      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              location={event.location}
              startDate={event.start_date}
              endDate={event.end_date}
              maxSeats={event.max_seats}
              registrationCount={regCounts[event.id] ?? 0}
              isRegistered={registeredEventIds.has(event.id)}
              userId={user.id}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 border border-gray-100/80 text-center">
            <Calendar className="w-10 h-10 text-acl-gray/40 mx-auto mb-3" />
            <p className="text-acl-gray text-sm">Keine kommenden Events.</p>
          </div>
        )}
      </div>
    </>
  )
}
