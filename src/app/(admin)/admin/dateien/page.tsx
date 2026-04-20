import { db } from "@/lib/db"
import { files, fileCategories } from "@/lib/db/schema"
import { desc, asc } from "drizzle-orm"
import { AdminFilesList } from "@/components/admin/admin-files-list"

export const metadata = {
  title: "Dateien verwalten",
}

export default async function AdminDateienPage() {
  const [allFiles, allCategories] = await Promise.all([
    db.select().from(files).orderBy(desc(files.createdAt)),
    db.select().from(fileCategories).orderBy(asc(fileCategories.sortOrder)),
  ])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Dateien verwalten</h1>
        <p className="text-sm text-acl-gray mt-1">
          Laden Sie Dateien hoch und verwalten Sie Kategorien.
        </p>
      </div>

      <AdminFilesList files={allFiles} categories={allCategories} />
    </>
  )
}
