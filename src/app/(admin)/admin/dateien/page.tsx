import { createClient } from "@/lib/supabase/server"
import { AdminFilesList } from "@/components/admin/admin-files-list"

export const metadata = {
  title: "Dateien verwalten",
}

export default async function AdminDateienPage() {
  const supabase = await createClient()

  const [filesResult, categoriesResult] = await Promise.all([
    supabase
      .from("files")
      .select("*, file_categories(name)")
      .order("uploaded_at", { ascending: false }),
    supabase.from("file_categories").select("*").order("sort_order"),
  ])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Dateien verwalten</h1>
        <p className="text-sm text-acl-gray mt-1">
          Laden Sie Dateien hoch und verwalten Sie Kategorien.
        </p>
      </div>

      <AdminFilesList
        files={filesResult.data ?? []}
        categories={categoriesResult.data ?? []}
      />
    </>
  )
}
