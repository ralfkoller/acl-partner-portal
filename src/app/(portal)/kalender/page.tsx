import { db } from "@/lib/db"
import { events, eventRegistrations } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { CalendarGridV2 } from "@/components/v2/calendar-grid-v2"
import { EventCardV2 } from "@/components/v2/event-card-v2"
import { SectionHeaderV2 } from "@/components/v2/section-header-v2"
import { Calendar } from "lucide-react"

export const metadata = {
  title: "Kalender",
}

export default async function KalenderPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const [allEvents, userRegs, allRegs] = await Promise.all([
    db.select().from(events).where(eq(events.isPublished, true)).orderBy(asc(events.startDate)),
    db.select({ eventId: eventRegistrations.eventId }).from(eventRegistrations).where(eq(eventRegistrations.userId, user.id)),
    db.select({ eventId: eventRegistrations.eventId }).from(eventRegistrations),
  ])

  const registeredEventIds = new Set(userRegs.map(r => r.eventId))

  const regCounts = allRegs.reduce((acc, r) => {
    acc[r.eventId] = (acc[r.eventId] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const now = new Date()
  const upcomingEvents = allEvents.filter(e => new Date(e.startDate) >= now)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Kalender</h1>
        <p className="text-sm text-white/60 mt-1">
          Entdecken Sie kommende Events und melden Sie sich direkt an.
        </p>
      </div>

      <CalendarGridV2 events={allEvents} />

      <SectionHeaderV2 title="Kommende Events" />

      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <EventCardV2
              key={event.id}
              id={event.id}
              title={event.title}
              location={event.location}
              startDate={event.startDate}
              endDate={event.endDate}
              maxSeats={event.maxSeats}
              registrationCount={regCounts[event.id] ?? 0}
              isRegistered={registeredEventIds.has(event.id)}
              userId={user.id}
            />
          ))
        ) : (
          <div className="v2-glass p-8 text-center">
            <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Keine kommenden Events.</p>
          </div>
        )}
      </div>
    </>
  )
}
