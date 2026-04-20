import { db } from "@/lib/db"
import { news, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { AdminNewsList } from "@/components/admin/admin-news-list"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "News verwalten",
}

export default async function AdminNewsPage() {
  const allNews = await db
    .select({
      id: news.id,
      title: news.title,
      excerpt: news.excerpt,
      isPublished: news.isPublished,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      authorName: users.fullName,
    })
    .from(news)
    .leftJoin(users, eq(news.authorId, users.id))
    .orderBy(desc(news.createdAt))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-acl-dark">News verwalten</h1>
          <p className="text-sm text-acl-gray mt-1">
            Erstellen und verwalten Sie Neuigkeiten für Ihre Partner.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" /> Neuer Artikel
        </Link>
      </div>

      <AdminNewsList news={allNews} />
    </>
  )
}
