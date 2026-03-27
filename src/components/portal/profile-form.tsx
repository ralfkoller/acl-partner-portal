"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Tables } from "@/lib/types/database"

interface ProfileFormProps {
  user: Tables<"profiles">
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.full_name)
  const [company, setCompany] = useState(user.company ?? "")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, company: company || null })
        .eq("id", user.id)

      if (error) {
        toast.error("Fehler beim Speichern")
      } else {
        toast.success("Profil aktualisiert")
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-acl-dark">Name</Label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-acl-dark">Unternehmen</Label>
        <Input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-acl-dark">E-Mail</Label>
        <Input
          value={user.id}
          disabled
          className="rounded-xl bg-acl-light/30 border-gray-200 text-acl-gray cursor-not-allowed"
        />
        <p className="text-xs text-acl-gray">Die E-Mail-Adresse kann nicht geändert werden.</p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-acl-dark">Rolle</Label>
        <Input
          value={user.role === "admin" ? "Administrator" : "Partner"}
          disabled
          className="rounded-xl bg-acl-light/30 border-gray-200 text-acl-gray cursor-not-allowed"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isPending ? "Speichern..." : "Änderungen speichern"}
      </button>
    </form>
  )
}
