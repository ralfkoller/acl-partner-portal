import { db } from "@/lib/db"
import { users, files, events, news } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, FolderOpen, Calendar, Newspaper, Plus, Upload, UserPlus } from "lucide-react"
import { SectionHeaderV2 } from "@/components/v2/section-header-v2"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminDashboardPage() {
  const user = await getUser()
  if (!user || user.role !== "admin") redirect("/dashboard")

  const [
    [{ count: usersCount }],
    [{ count: filesCount }],
    [{ count: eventsCount }],
    [{ count: newsCount }],
    recentNews,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(files),
    db.select({ count: sql<number>`count(*)` }).from(events),
    db.select({ count: sql<number>`count(*)` }).from(news),
    db
      .select({ id: news.id, title: news.title, createdAt: news.createdAt, isPublished: news.isPublished })
      .from(news)
      .orderBy(sql`created_at DESC`)
      .limit(5),
  ])

  const stats = [
    { title: "Partner", value: usersCount, icon: Users, accentColor: "#F0A844" },
    { title: "Dateien", value: filesCount, icon: FolderOpen, accentColor: "#10b981" },
    { title: "Events", value: eventsCount, icon: Calendar, accentColor: "#3b82f6" },
    { title: "News", value: newsCount, icon: Newspaper, accentColor: "#8b5cf6" },
  ]

  const quickActions = [
    { label: "News erstellen", href: "/admin/news?new=true", icon: Plus },
    { label: "Datei hochladen", href: "/admin/dateien?new=true", icon: Upload },
    { label: "Event erstellen", href: "/admin/kalender?new=true", icon: Plus },
    { label: "Partner einladen", href: "/admin/benutzer?new=true", icon: UserPlus },
  ]

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-white/60 mt-1">
          Übersicht über alle Inhalte und Aktivitäten.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="v2-glass p-6"
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
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-white/60 mt-1">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <SectionHeaderV2 title="Schnellaktionen" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="v2-glass v2-border-animate flex items-center gap-3 p-4 text-sm font-medium text-white/80 hover:text-acl-orange transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-acl-orange/10 flex items-center justify-center flex-shrink-0">
              <action.icon className="w-4 h-4 text-acl-orange" />
            </div>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <SectionHeaderV2 title="Letzte Aktivitäten" />
      <div className="v2-glass divide-y divide-white/[0.06]">
        {recentNews.map((item) => (
          <div key={item.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">{item.title}</div>
              <div className="text-xs text-white/50 mt-0.5">
                {new Date(item.createdAt).toLocaleDateString("de-AT")}
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                item.isPublished
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-acl-orange/10 text-acl-orange"
              }`}
            >
              {item.isPublished ? "Veröffentlicht" : "Entwurf"}
            </span>
          </div>
        ))}
        {recentNews.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-white/50">
            Noch keine Aktivitäten.
          </div>
        )}
      </div>
    </>
  )
}
