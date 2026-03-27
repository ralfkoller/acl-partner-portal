import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Users,
  FolderOpen,
  Calendar,
  Newspaper,
  Plus,
  Upload,
  UserPlus,
} from "lucide-react"
import { SectionHeader } from "@/components/portal/section-header"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminDashboardPage() {
  const user = await getUser()
  if (!user || user.role !== "admin") redirect("/dashboard")

  const supabase = await createClient()

  const [profilesResult, filesResult, eventsResult, newsResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("files").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("news").select("id", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Partner",
      value: profilesResult.count ?? 0,
      icon: Users,
      accentColor: "#F0A844",
    },
    {
      title: "Dateien",
      value: filesResult.count ?? 0,
      icon: FolderOpen,
      accentColor: "#10b981",
    },
    {
      title: "Events",
      value: eventsResult.count ?? 0,
      icon: Calendar,
      accentColor: "#3b82f6",
    },
    {
      title: "News",
      value: newsResult.count ?? 0,
      icon: Newspaper,
      accentColor: "#8b5cf6",
    },
  ]

  const quickActions = [
    { label: "News erstellen", href: "/admin/news?new=true", icon: Plus },
    { label: "Datei hochladen", href: "/admin/dateien?new=true", icon: Upload },
    { label: "Event erstellen", href: "/admin/kalender?new=true", icon: Plus },
    { label: "Partner einladen", href: "/admin/benutzer?new=true", icon: UserPlus },
  ]

  // Recent news for activity feed
  const recentNews = await supabase
    .from("news")
    .select("id, title, created_at, is_published")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Admin Dashboard</h1>
        <p className="text-sm text-acl-gray mt-1">
          Übersicht über alle Inhalte und Aktivitäten.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-6 border border-gray-100/80"
            style={{ borderLeft: `4px solid ${stat.accentColor}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.accentColor}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.accentColor }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-acl-dark">{stat.value}</div>
            <div className="text-sm text-acl-gray mt-1">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <SectionHeader title="Schnellaktionen" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-white rounded-xl p-4 border border-gray-100/80 card-hover flex items-center gap-3 text-sm font-medium text-acl-dark hover:text-acl-orange transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-acl-orange/10 flex items-center justify-center flex-shrink-0">
              <action.icon className="w-4 h-4 text-acl-orange" />
            </div>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <SectionHeader title="Letzte Aktivitäten" />
      <div className="bg-white rounded-xl border border-gray-100/80 divide-y divide-gray-100">
        {(recentNews.data ?? []).map((item) => (
          <div key={item.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-acl-dark">{item.title}</div>
              <div className="text-xs text-acl-gray mt-0.5">
                {new Date(item.created_at).toLocaleDateString("de-AT")}
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                item.is_published
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-acl-orange/10 text-acl-orange"
              }`}
            >
              {item.is_published ? "Veröffentlicht" : "Entwurf"}
            </span>
          </div>
        ))}
        {(recentNews.data ?? []).length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-acl-gray">
            Noch keine Aktivitäten.
          </div>
        )}
      </div>
    </>
  )
}
