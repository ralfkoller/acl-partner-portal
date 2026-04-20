"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/lib/actions/profile"
import type { User } from "@/lib/db/schema"

interface ProfileFormV2Props {
  user: User
}

export function ProfileFormV2({ user }: ProfileFormV2Props) {
  const [fullName, setFullName] = useState(user.fullName)
  const [company, setCompany] = useState(user.company ?? "")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const formData = new FormData()
      formData.set("full_name", fullName)
      formData.set("company", company)

      const result = await updateProfile(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Profil aktualisiert")
        router.refresh()
      }
    })
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 focus:border-acl-orange/50 focus:ring-2 focus:ring-acl-orange/10 focus:outline-none transition-all text-sm"
  const disabledClass = "w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/50 cursor-not-allowed text-sm"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Unternehmen</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">E-Mail</label>
        <input value={user.email} disabled className={disabledClass} />
        <p className="text-xs text-white/20">Die E-Mail-Adresse kann nicht geändert werden.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Rolle</label>
        <input
          value={user.role === "admin" ? "Administrator" : "Partner"}
          disabled
          className={disabledClass}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="py-3 px-6 bg-gradient-to-r from-acl-orange to-acl-orange-hover text-white font-medium rounded-xl v2-glow-sm hover:shadow-[0_0_25px_rgba(240,168,68,0.5)] active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isPending ? "Speichern..." : "Änderungen speichern"}
      </button>
    </form>
  )
}
