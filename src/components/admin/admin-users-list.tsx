"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Shield, User, Search } from "lucide-react"
import { updateUserRole } from "@/lib/actions/users"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface UserProfile {
  id: string
  full_name: string
  company: string | null
  role: "admin" | "partner"
  created_at: string
}

export function AdminUsersList({ users }: { users: UserProfile[] }) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [showInvite, setShowInvite] = useState(false)
  const [roleChange, setRoleChange] = useState<{ id: string; name: string; newRole: "admin" | "partner" } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Invite form
  const [invEmail, setInvEmail] = useState("")
  const [invName, setInvName] = useState("")
  const [invCompany, setInvCompany] = useState("")
  const [invRole, setInvRole] = useState<"admin" | "partner">("partner")

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  function handleRoleChange() {
    if (!roleChange) return
    startTransition(async () => {
      const result = await updateUserRole(roleChange.id, roleChange.newRole)
      if (result.error) toast.error(result.error)
      else {
        toast.success(`Rolle für ${roleChange.name} geändert`)
        router.refresh()
      }
      setRoleChange(null)
    })
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    // Note: supabase.auth.admin.inviteUserByEmail requires service role key
    // This would typically be done via an API route with the service role
    toast.info("Einladungsfunktion erfordert Supabase Service Role Key. Bitte konfigurieren Sie eine API-Route.")
    setShowInvite(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
            <Input
              placeholder="Suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64 rounded-xl bg-white border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "all")}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Rollen</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" /> Partner einladen
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-acl-light/30">
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Unternehmen</th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Rolle</th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Registriert</th>
              <th className="text-right text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-acl-light/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-acl-orange-light flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-acl-dark">
                        {u.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-acl-dark">{u.full_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-acl-gray">{u.company ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-acl-orange/10 text-acl-orange"
                      : "bg-blue-500/10 text-blue-600"
                  }`}>
                    {u.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role === "admin" ? "Admin" : "Partner"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-acl-gray">
                  {new Date(u.created_at).toLocaleDateString("de-AT")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      setRoleChange({
                        id: u.id,
                        name: u.full_name,
                        newRole: u.role === "admin" ? "partner" : "admin",
                      })
                    }
                    className="text-xs text-acl-orange hover:text-acl-orange-hover transition-colors"
                  >
                    {u.role === "admin" ? "Zum Partner" : "Zum Admin"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-acl-gray">
                  Keine Benutzer gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="rounded-xl">
          <DialogHeader><DialogTitle className="text-acl-dark">Partner einladen</DialogTitle></DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">E-Mail</Label>
              <Input value={invEmail} onChange={(e) => setInvEmail(e.target.value)} type="email" required className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Name</Label>
              <Input value={invName} onChange={(e) => setInvName(e.target.value)} required className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Unternehmen</Label>
              <Input value={invCompany} onChange={(e) => setInvCompany(e.target.value)} className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Rolle</Label>
              <Select value={invRole} onValueChange={(v) => setInvRole(v as any)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button type="submit" disabled={isPending} className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50">
              {isPending ? "Wird eingeladen..." : "Einladung senden"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role Change Confirm */}
      <ConfirmDialog
        open={roleChange !== null}
        onOpenChange={(open) => !open && setRoleChange(null)}
        title="Rolle ändern"
        description={roleChange ? `Möchten Sie ${roleChange.name} zum ${roleChange.newRole === "admin" ? "Admin" : "Partner"} machen?` : ""}
        confirmLabel="Rolle ändern"
        onConfirm={handleRoleChange}
        isPending={isPending}
      />
    </>
  )
}
