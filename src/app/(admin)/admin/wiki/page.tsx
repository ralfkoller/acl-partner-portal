import { db } from "@/lib/db"
import { faqCategories, faqItems } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { AdminWikiManager } from "@/components/admin/admin-wiki-manager"

export const metadata = {
  title: "Wiki verwalten",
}

export default async function AdminWikiPage() {
  const [allCategories, allItems] = await Promise.all([
    db.select().from(faqCategories).orderBy(asc(faqCategories.sortOrder)),
    db.select().from(faqItems).orderBy(asc(faqItems.sortOrder)),
  ])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Wiki / FAQ verwalten</h1>
        <p className="text-sm text-white/60 mt-1">
          Verwalten Sie Kategorien und FAQ-Einträge.
        </p>
      </div>

      <AdminWikiManager categories={allCategories} items={allItems} />
    </>
  )
}
