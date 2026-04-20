import { db } from "@/lib/db"
import { news } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { TiptapRenderer } from "@/components/tiptap/renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await db.select({ title: news.title }).from(news).where(eq(news.id, id)).limit(1).then(r => r[0] ?? null)
  return { title: article?.title ?? "News" }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user) redirect("/login")

  const { id } = await params
  const article = await db
    .select()
    .from(news)
    .where(eq(news.id, id))
    .limit(1)
    .then(r => r[0] ?? null)

  if (!article || !article.isPublished) notFound()

  let content: any = null
  try {
    content = typeof article.content === "string" ? JSON.parse(article.content) : article.content
  } catch {
    // content bleibt null
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Dashboard
      </Link>

      {/* Article */}
      <article className="v2-glass p-8">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-acl-orange/10 text-acl-orange">
            Neuigkeit
          </span>
          {article.publishedAt && (
            <span className="text-xs text-white/50">
              {format(new Date(article.publishedAt), "dd. MMMM yyyy", { locale: de })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-6">{article.title}</h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-white/60 text-base mb-6 border-l-2 border-acl-orange/40 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-white/[0.08] mb-6" />

        {/* Content */}
        {content ? (
          <TiptapRenderer content={content} dark />
        ) : (
          <p className="text-white/50 text-sm">Kein Inhalt verfügbar.</p>
        )}
      </article>
    </div>
  )
}
