import { db } from "@/lib/db"
import { files, events, news, eventRegistrations } from "@/lib/db/schema"
import { eq, gte, sql, and } from "drizzle-orm"
import { getUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { FolderOpen, Calendar, Newspaper, UserCheck } from "lucide-react"
import { HeroBannerV2 } from "@/components/v2/hero-banner-v2"
import { StatCardV2 } from "@/components/v2/stat-card-v2"
import { NewsCardV2 } from "@/components/v2/news-card-v2"
import { SectionHeaderV2 } from "@/components/v2/section-header-v2"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const now = new Date().toISOString()

  const [
    [{ count: filesCount }],
    [{ count: eventsCount }],
    [{ count: newsCount }],
    [{ count: registrationsCount }],
    latestNews,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(files).where(eq(files.isPublished, true)),
    db.select({ count: sql<number>`count(*)` }).from(events).where(and(eq(events.isPublished, true), gte(events.startDate, now))),
    db.select({ count: sql<number>`count(*)` }).from(news).where(eq(news.isPublished, true)),
    db.select({ count: sql<number>`count(*)` }).from(eventRegistrations).where(eq(eventRegistrations.userId, user.id)),
    db
      .select({ id: news.id, title: news.title, excerpt: news.excerpt, publishedAt: news.publishedAt })
      .from(news)
      .where(eq(news.isPublished, true))
      .orderBy(sql`published_at DESC`)
      .limit(5),
  ])

  const stats = [
    { title: "Neue Dateien", value: filesCount, icon: FolderOpen, accentColor: "#F0A844", href: "/dateien" },
    { title: "Events diesen Monat", value: eventsCount, icon: Calendar, accentColor: "#3b82f6", href: "/kalender" },
    { title: "Aktuelle News", value: newsCount, icon: Newspaper, accentColor: "#10b981", href: "#news" },
    { title: "Meine Anmeldungen", value: registrationsCount, icon: UserCheck, accentColor: "#8b5cf6", href: "/kalender" },
  ]

  return (
    <>
      <HeroBannerV2 userName={user.fullName} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <StatCardV2 key={stat.title} {...stat} />
        ))}
      </div>

      <div id="news">
        <SectionHeaderV2 title="Neuigkeiten" />
        <div className="space-y-4">
          {latestNews.length > 0 ? (
            latestNews.map((item) => (
              <NewsCardV2
                key={item.id}
                id={item.id}
                title={item.title}
                excerpt={item.excerpt}
                publishedAt={item.publishedAt}
              />
            ))
          ) : (
            <div className="v2-glass p-8 text-center">
              <Newspaper className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 text-sm">Noch keine Neuigkeiten vorhanden.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
