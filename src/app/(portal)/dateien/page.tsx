import { db } from "@/lib/db"
import { files, fileCategories } from "@/lib/db/schema"
import { eq, asc, desc, like } from "drizzle-orm"
import { FileCardV2 } from "@/components/v2/file-card-v2"
import { DateienFilterV2 } from "@/components/v2/dateien-filter-v2"
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

  const [allCategories, allFiles] = await Promise.all([
    db.select().from(fileCategories).orderBy(asc(fileCategories.sortOrder)),
    (async () => {
      let query = db
        .select({
          id: files.id,
          name: files.name,
          description: files.description,
          mimeType: files.mimeType,
          fileSize: files.fileSize,
          storagePath: files.storagePath,
          categoryId: files.categoryId,
        })
        .from(files)
        .where(eq(files.isPublished, true))
        .$dynamic()

      if (params.category) {
        query = query.where(eq(files.categoryId, params.category))
      }
      if (params.search) {
        query = query.where(like(files.name, `%${params.search}%`))
      }

      return query.orderBy(desc(files.createdAt))
    })(),
  ])

  const categoriesMap = Object.fromEntries(allCategories.map(c => [c.id, c.name]))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dateien</h1>
          <p className="text-sm text-white/60 mt-1">
            Laden Sie Dokumente, Präsentationen und Assets herunter.
          </p>
        </div>
      </div>

      <DateienFilterV2 categories={allCategories} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {allFiles.length > 0 ? (
          allFiles.map((file) => (
            <FileCardV2
              key={file.id}
              id={file.id}
              name={file.name}
              description={file.description}
              mimeType={file.mimeType}
              fileSize={file.fileSize}
              categoryName={file.categoryId ? categoriesMap[file.categoryId] : undefined}
              storagePath={file.storagePath}
            />
          ))
        ) : (
          <div className="col-span-full v2-glass p-8 text-center">
            <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Keine Dateien gefunden.</p>
          </div>
        )}
      </div>
    </>
  )
}
