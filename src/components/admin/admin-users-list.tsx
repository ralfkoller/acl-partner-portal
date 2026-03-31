"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Shield, User, Search, Eye, EyeOff } from "lucide-react"
import { updateUserRole, createUser, inviteUser } from "@/lib/actions/users"
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

const INPUT_CLASS = "rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
const SUBMIT_CLASS = "w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"

export function AdminUsersList({ users }: { users: UserProfile[] }) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [showDialog, setShowDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"create" | "invite">("create")
  const [roleChange, setRoleChange] = useState<{ id: string; name: string; newRole: "admin" | "partner" } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Shared form fields
  const [formEmail, setFormEmail] = useState("")
  const [formName, setFormName] = useState("")
  const [formCompany, setFormCompany] = useState("")
  const [formRole, setFormRole] = useState<"admin" | "partner">("partner")
  const [formPassword, setFormPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (u.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  function resetForm() {
    setFormEmail("")
    setFormName("")
    setFormCompany("")
    setFormRole("partner")
    setFormPassword("")
    setShowPassword(false)
  }

  function handleOpenDialog(tab: "create" | "invite") {
    resetForm()
    setActiveTab(tab)
    setShowDialog(true)
  }

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = activeTab === "create"
        ? await createUser(formData)
        : await inviteUser(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(
          activeTab === "create"
            ? "Benutzer wurde erstellt."
            : "Einladung wurde gesendet."
        )
        setShowDialog(false)
        resetForm()
        router.refresh()
      }
    })
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenDialog("invite")}
            className="flex items-center gap-2 py-2.5 px-5 bg-white hover:bg-acl-light border border-gray-200 text-acl-dark text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <UserPlus className="w-4 h-4" /> Partner einladen
          </button>
          <button
            onClick={() => handleOpenDialog("create")}
            className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <UserPlus className="w-4 h-4" /> Benutzer erstellen
          </button>
        </div>
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

      {/* Create / Invite Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => { if (!open) { setShowDialog(false); resetForm() } }}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-acl-dark">Benutzer hinzufügen</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex rounded-xl bg-acl-light p-1 mb-2">
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "create"
                  ? "bg-white text-acl-dark shadow-sm"
                  : "text-acl-gray hover:text-acl-dark"
              }`}
            >
              Erstellen
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("invite")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "invite"
                  ? "bg-white text-acl-dark shadow-sm"
                  : "text-acl-gray hover:text-acl-dark"
              }`}
            >
              Einladen
            </button>
          </div>

          {activeTab === "create" && (
            <p className="text-xs text-acl-gray -mt-1 mb-1">
              Benutzer wird sofort angelegt. Der Admin vergibt das initiale Passwort.
            </p>
          )}
          {activeTab === "invite" && (
            <p className="text-xs text-acl-gray -mt-1 mb-1">
              Supabase sendet eine Einladungs-Email. Der Benutzer setzt sein Passwort selbst.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* hidden role field for FormData */}
            <input type="hidden" name="role" value={formRole} />

            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Name</Label>
              <Input
                name="full_name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Max Mustermann"
                required
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">E-Mail</Label>
              <Input
                name="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                type="email"
                placeholder="max@unternehmen.at"
                required
                className={INPUT_CLASS}
              />
            </div>

            {activeTab === "create" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-acl-dark">Passwort</Label>
                <div className="relative">
                  <Input
                    name="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Mindestens 8 Zeichen"
                    minLength={8}
                    required
                    className={`pr-11 ${INPUT_CLASS}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-acl-gray hover:text-acl-dark transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Unternehmen <span className="text-acl-gray font-normal">(optional)</span></Label>
              <Input
                name="company"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="Unternehmen GmbH"
                className={INPUT_CLASS}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Rolle</Label>
              <Select value={formRole} onValueChange={(v) => setFormRole(v as "admin" | "partner")}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button type="submit" disabled={isPending} className={SUBMIT_CLASS}>
              {isPending
                ? activeTab === "create" ? "Wird erstellt..." : "Wird eingeladen..."
                : activeTab === "create" ? "Benutzer erstellen" : "Einladung senden"
              }
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
