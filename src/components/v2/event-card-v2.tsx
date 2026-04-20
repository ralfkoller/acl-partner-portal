"use client"

import { format } from "date-fns"
import { de } from "date-fns/locale"
import { MapPin, Clock, Users } from "lucide-react"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { registerForEvent, unregisterFromEvent } from "@/lib/actions/registrations"

interface EventCardV2Props {
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

export function EventCardV2({
  id,
  title,
  location,
  startDate,
  maxSeats,
  registrationCount,
  isRegistered,
}: EventCardV2Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isFull = maxSeats !== null && registrationCount >= maxSeats
  const date = new Date(startDate)

  async function handleRegister() {
    startTransition(async () => {
      const result = await registerForEvent(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Erfolgreich angemeldet")
        router.refresh()
      }
    })
  }

  async function handleUnregister() {
    startTransition(async () => {
      const result = await unregisterFromEvent(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Erfolgreich abgemeldet")
        router.refresh()
      }
    })
  }

  return (
    <div className="v2-glass v2-border-animate p-6">
      <div className="flex gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500/10 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-blue-400 leading-none">
            {format(date, "dd")}
          </span>
          <span className="text-[10px] font-medium text-blue-400 uppercase">
            {format(date, "MMM", { locale: de })}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mb-3">
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
              className="px-4 py-1.5 rounded-xl text-xs font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50"
            >
              {isPending ? "..." : "Angemeldet — Abmelden?"}
            </button>
          ) : isFull ? (
            <span className="px-4 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400">
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
