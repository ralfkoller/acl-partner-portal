"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { deleteNews, toggleNewsPublished } from "@/lib/actions/news"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { toast } from "sonner"

interface NewsItem {
  id: string
  title: string
  isPublished: boolean
  createdAt: string
  publishedAt: string | null
  authorName: string | null
}

export function AdminNewsList({ news }: { news: NewsItem[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteNews(deleteId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Artikel gelöscht")
        router.refresh()
      }
      setDeleteId(null)
    })
  }

  function handleTogglePublish(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleNewsPublished(id, !current)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(current ? "Artikel zurückgezogen" : "Artikel veröffentlicht")
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="rounded-xl bg-white/[0.07] border border-white/[0.12] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.03]">
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">
                Titel
              </th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">
                Autor
              </th>
              <th className="text-left text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">
                Datum
              </th>
              <th className="text-right text-xs font-medium text-white/50 uppercase tracking-wider px-6 py-3">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.05] transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-white">{item.title}</span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(item.id, item.isPublished)}
                    disabled={isPending}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      item.isPublished
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        : "bg-acl-orange/10 text-acl-orange hover:bg-acl-orange/20"
                    }`}
                  >
                    {item.isPublished ? "Veröffentlicht" : "Entwurf"}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-white/50">
                  {item.authorName ?? "—"}
                </td>
                <td className="px-6 py-4 text-sm text-white/50">
                  {new Date(item.createdAt).toLocaleDateString("de-AT")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="p-1.5 rounded-lg text-white/50 hover:text-acl-orange hover:bg-acl-orange/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-white/50">
                  Noch keine Artikel vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Artikel löschen"
        description="Möchten Sie diesen Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        isDestructive
        isPending={isPending}
      />
    </>
  )
}
