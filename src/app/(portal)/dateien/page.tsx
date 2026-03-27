import { createClient } from "@/lib/supabase/server"
import { SectionHeader } from "@/components/portal/section-header"
import { FileCard } from "@/components/portal/file-card"
import { DateienFilter } from "@/components/portal/dateien-filter"
import { FolderOpen } from "lucide-react"

export const metadata = {
  title: "Dateien",
}

export default async function DateienPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const [categoriesResult, filesQuery] = await Promise.all([
    supabase.from("file_categories").select("*").order("sort_order"),
    (async () => {
      let query = supabase
        .from("files")
        .select("*, file_categories(name)")
        .eq("is_published", true)
        .order("uploaded_at", { ascending: false })

      if (params.category) {
        query = query.eq("category_id", params.category)
      }

      if (params.search) {
        query = query.ilike("name", `%${params.search}%`)
      }

      return query
    })(),
  ])

  const categories = categoriesResult.data ?? []
  const files = filesQuery.data ?? []

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-acl-dark">Dateien</h1>
          <p className="text-sm text-acl-gray mt-1">
            Laden Sie Dokumente, Präsentationen und Assets herunter.
          </p>
        </div>
      </div>

      <DateienFilter categories={categories} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {files.length > 0 ? (
          files.map((file) => (
            <FileCard
              key={file.id}
              id={file.id}
              name={file.name}
              description={file.description}
              mimeType={file.mime_type}
              fileSize={file.file_size}
              categoryName={(file.file_categories as any)?.name}
              storagePath={file.storage_path}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl p-8 border border-gray-100/80 text-center">
            <FolderOpen className="w-10 h-10 text-acl-gray/40 mx-auto mb-3" />
            <p className="text-acl-gray text-sm">Keine Dateien gefunden.</p>
          </div>
        )}
      </div>
    </>
  )
}
