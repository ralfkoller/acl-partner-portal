import { createClient } from "@/lib/supabase/server"
import { AdminWikiManager } from "@/components/admin/admin-wiki-manager"

export const metadata = {
  title: "Wiki verwalten",
}

export default async function AdminWikiPage() {
  const supabase = await createClient()

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase.from("faq_categories").select("*").order("sort_order"),
    supabase.from("faq_items").select("*").order("sort_order"),
  ])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Wiki / FAQ verwalten</h1>
        <p className="text-sm text-acl-gray mt-1">
          Verwalten Sie Kategorien und FAQ-Einträge.
        </p>
      </div>

      <AdminWikiManager
        categories={categoriesResult.data ?? []}
        items={itemsResult.data ?? []}
      />
    </>
  )
}
