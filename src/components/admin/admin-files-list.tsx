"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Upload, FolderOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createFileRecord, deleteFile, createFileCategory, deleteFileCategory } from "@/lib/actions/files"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface FileItem {
  id: string
  name: string
  description: string | null
  storage_path: string
  file_size: number | null
  mime_type: string | null
  is_published: boolean
  uploaded_at: string
  file_categories: { name: string } | null
}

interface Category {
  id: string
  name: string
  description: string | null
  sort_order: number
}

export function AdminFilesList({
  files,
  categories,
}: {
  files: FileItem[]
  categories: Category[]
}) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; path: string } | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showCategory, setShowCategory] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Upload state
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [fileDesc, setFileDesc] = useState("")
  const [fileCat, setFileCat] = useState("")

  // Category state
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const result = await deleteFile(deleteTarget.id, deleteTarget.path)
      if (result.error) toast.error(result.error)
      else {
        toast.success("Datei gelöscht")
        router.refresh()
      }
      setDeleteTarget(null)
    })
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    startTransition(async () => {
      const supabase = createClient()
      const path = `uploads/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from("portal-files")
        .upload(path, file)

      if (uploadError) {
        toast.error("Upload fehlgeschlagen: " + uploadError.message)
        return
      }

      const result = await createFileRecord({
        name: fileName || file.name,
        description: fileDesc,
        category_id: fileCat || undefined,
        storage_path: path,
        file_size: file.size,
        mime_type: file.type,
        is_published: true,
      })

      if (result.error) toast.error(result.error)
      else {
        toast.success("Datei hochgeladen")
        setShowUpload(false)
        setFile(null)
        setFileName("")
        setFileDesc("")
        setFileCat("")
        router.refresh()
      }
    })
  }

  function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createFileCategory({ name: catName, description: catDesc })
      if (result.error) toast.error(result.error)
      else {
        toast.success("Kategorie erstellt")
        setShowCategory(false)
        setCatName("")
        setCatDesc("")
        router.refresh()
      }
    })
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return "—"
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <>
      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
          <Upload className="w-4 h-4" /> Datei hochladen
        </button>
        <button
          onClick={() => setShowCategory(true)}
          className="flex items-center gap-2 py-2.5 px-5 bg-acl-light text-acl-dark text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" /> Kategorie
        </button>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-acl-light/30">
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Kategorie</th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Größe</th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Datum</th>
              <th className="text-right text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {files.map((f) => (
              <tr key={f.id} className="hover:bg-acl-light/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-acl-dark">{f.name}</td>
                <td className="px-6 py-4 text-sm text-acl-gray">
                  {(f.file_categories as any)?.name ?? "—"}
                </td>
                <td className="px-6 py-4 text-sm text-acl-gray">{formatSize(f.file_size)}</td>
                <td className="px-6 py-4 text-sm text-acl-gray">
                  {new Date(f.uploaded_at).toLocaleDateString("de-AT")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setDeleteTarget({ id: f.id, path: f.storage_path })}
                    className="p-1.5 rounded-lg text-acl-gray hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-acl-gray">
                  <FolderOpen className="w-8 h-8 text-acl-gray/40 mx-auto mb-2" />
                  Noch keine Dateien hochgeladen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-acl-dark">Datei hochladen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Datei</Label>
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    setFile(f)
                    if (!fileName) setFileName(f.name)
                  }
                }}
                required
                className="block w-full text-sm text-acl-gray file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-acl-orange/10 file:text-acl-orange hover:file:bg-acl-orange/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Name</Label>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
                className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Beschreibung</Label>
              <Textarea
                value={fileDesc}
                onChange={(e) => setFileDesc(e.target.value)}
                rows={2}
                className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Kategorie</Label>
              <Select value={fileCat} onValueChange={(v) => setFileCat(v ?? "")}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Kategorie wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              type="submit"
              disabled={isPending || !file}
              className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending ? "Wird hochgeladen..." : "Hochladen"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategory} onOpenChange={setShowCategory}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-acl-dark">Neue Kategorie</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Name</Label>
              <Input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
                className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Beschreibung</Label>
              <Textarea
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                rows={2}
                className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
              />
            </div>
            <button
              type="submit"
              disabled={isPending || !catName}
              className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending ? "Wird erstellt..." : "Erstellen"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Datei löschen"
        description="Möchten Sie diese Datei wirklich löschen? Die Datei wird auch aus dem Storage entfernt."
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        isDestructive
        isPending={isPending}
      />
    </>
  )
}
