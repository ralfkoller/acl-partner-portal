import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { FolderOpen, Calendar, Newspaper, UserCheck } from "lucide-react"
import { HeroBanner } from "@/components/portal/hero-banner"
import { StatCard } from "@/components/portal/stat-card"
import { NewsCard } from "@/components/portal/news-card"
import { SectionHeader } from "@/components/portal/section-header"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  // Fetch stats in parallel
  const [filesResult, eventsResult, newsCountResult, registrationsResult, newsResult] =
    await Promise.all([
      supabase.from("files").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true)
        .gte("start_date", new Date().toISOString()),
      supabase.from("news").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(5),
    ])

  const stats = [
    {
      title: "Neue Dateien",
      value: filesResult.count ?? 0,
      icon: FolderOpen,
      accentColor: "#F0A844",
      href: "/dateien",
    },
    {
      title: "Events diesen Monat",
      value: eventsResult.count ?? 0,
      icon: Calendar,
      accentColor: "#3b82f6",
      href: "/kalender",
    },
    {
      title: "Aktuelle News",
      value: newsCountResult.count ?? 0,
      icon: Newspaper,
      accentColor: "#10b981",
      href: "#news",
    },
    {
      title: "Meine Anmeldungen",
      value: registrationsResult.count ?? 0,
      icon: UserCheck,
      accentColor: "#8b5cf6",
      href: "/kalender",
    },
  ]

  const news = newsResult.data ?? []

  return (
    <>
      <HeroBanner userName={user.full_name} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* News Feed */}
      <div id="news">
        <SectionHeader title="Neuigkeiten" />
        <div className="space-y-4">
          {news.length > 0 ? (
            news.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                excerpt={item.excerpt}
                publishedAt={item.published_at}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-100/80 text-center">
              <Newspaper className="w-10 h-10 text-acl-gray/40 mx-auto mb-3" />
              <p className="text-acl-gray text-sm">Noch keine Neuigkeiten vorhanden.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
