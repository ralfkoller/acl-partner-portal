"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { registerForEvent, unregisterFromEvent } from "@/lib/actions/registrations"

interface EventRegisterButtonProps {
  eventId: string
  isRegistered: boolean
  isFull: boolean
}

export function EventRegisterButton({
  eventId,
  isRegistered,
  isFull,
}: EventRegisterButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleRegister() {
    setIsPending(true)
    try {
      const result = await registerForEvent(eventId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Erfolgreich angemeldet")
        router.refresh()
      }
    } finally {
      setIsPending(false)
    }
  }

  async function handleUnregister() {
    setIsPending(true)
    try {
      const result = await unregisterFromEvent(eventId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Erfolgreich abgemeldet")
        router.refresh()
      }
    } finally {
      setIsPending(false)
    }
  }

  if (isRegistered) {
    return (
      <button
        onClick={handleUnregister}
        disabled={isPending}
        className="px-4 py-1.5 rounded-xl text-xs font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50"
      >
        {isPending ? "..." : "Angemeldet — Abmelden?"}
      </button>
    )
  }

  if (isFull) {
    return (
      <span className="px-4 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400">
        Ausgebucht
      </span>
    )
  }

  return (
    <button
      onClick={handleRegister}
      disabled={isPending}
      className="px-4 py-1.5 rounded-xl text-xs font-medium bg-acl-orange/10 text-acl-orange hover:bg-acl-orange hover:text-white transition-all disabled:opacity-50"
    >
      {isPending ? "..." : "Anmelden"}
    </button>
  )
}
