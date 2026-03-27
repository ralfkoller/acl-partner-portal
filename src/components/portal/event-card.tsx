"use client"

import { format } from "date-fns"
import { de } from "date-fns/locale"
import { MapPin, Clock, Users } from "lucide-react"
import { useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EventCardProps {
  id: string
  title: string
  location: string | null
  startDate: string
  endDate: string | null
  maxSeats: number | null
  registrationCount: number
  isRegistered: boolean
  userId: string
}

export function EventCard({
  id,
  title,
  location,
  startDate,
  endDate,
  maxSeats,
  registrationCount,
  isRegistered,
  userId,
}: EventCardProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isFull = maxSeats !== null && registrationCount >= maxSeats

  const date = new Date(startDate)

  async function handleRegister() {
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.from("event_registrations").insert({
        event_id: id,
        user_id: userId,
      })
      if (error) {
        toast.error("Anmeldung fehlgeschlagen")
      } else {
        toast.success("Erfolgreich angemeldet")
        router.refresh()
      }
    })
  }

  async function handleUnregister() {
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", id)
        .eq("user_id", userId)
      if (error) {
        toast.error("Abmeldung fehlgeschlagen")
      } else {
        toast.success("Erfolgreich abgemeldet")
        router.refresh()
      }
    })
  }

  return (
    <div
      className="bg-white rounded-xl p-6 border border-gray-100/80 card-hover"
      style={{ borderLeft: "4px solid #3b82f6" }}
    >
      <div className="flex gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500/10 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-blue-600 leading-none">
            {format(date, "dd")}
          </span>
          <span className="text-[10px] font-medium text-blue-600 uppercase">
            {format(date, "MMM", { locale: de })}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-acl-dark mb-1">{title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-acl-gray mb-3">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {format(date, "HH:mm")} Uhr
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />{" "}
              {registrationCount}
              {maxSeats ? ` / ${maxSeats}` : ""} Teilnehmer
            </span>
          </div>

          {isRegistered ? (
            <button
              onClick={handleUnregister}
              disabled={isPending}
              className="px-4 py-1.5 rounded-xl text-xs font-medium bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 transition-all disabled:opacity-50"
            >
              {isPending ? "..." : "Angemeldet \u2014 Abmelden?"}
            </button>
          ) : isFull ? (
            <span className="px-4 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-500">
              Ausgebucht
            </span>
          ) : (
            <button
              onClick={handleRegister}
              disabled={isPending}
              className="px-4 py-1.5 rounded-xl text-xs font-medium bg-acl-orange/10 text-acl-orange hover:bg-acl-orange hover:text-white transition-all disabled:opacity-50"
            >
              {isPending ? "..." : "Anmelden"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
