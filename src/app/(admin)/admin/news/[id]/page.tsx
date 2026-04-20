import { db } from "@/lib/db"
import { news } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { NewsEditor } from "@/components/admin/news-editor"

export const metadata = {
  title: "Artikel bearbeiten",
}

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id === "new") {
    return <NewsEditor />
  }

  const item = await db.select().from(news).where(eq(news.id, id)).limit(1).then(r => r[0] ?? null)
  if (!item) redirect("/admin/news")

  return <NewsEditor news={item} />
}
