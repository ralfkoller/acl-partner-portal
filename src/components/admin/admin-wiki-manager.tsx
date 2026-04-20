"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react"
import { createFaqCategory, deleteFaqCategory, createFaqItem, updateFaqItem, deleteFaqItem } from "@/lib/actions/wiki"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { TiptapEditor } from "@/components/tiptap/editor"
import { SectionHeader } from "@/components/portal/section-header"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  description: string | null
  sortOrder: number
}

interface FaqItem {
  id: string
  categoryId: string | null
  question: string
  answer: any
  sortOrder: number
  isPublished: boolean
}

export function AdminWikiManager({ categories, items }: { categories: Category[]; items: FaqItem[] }) {
  const [showCatForm, setShowCatForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editItem, setEditItem] = useState<FaqItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "item"; id: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Category form
  const [catName, setCatName] = useState("")
  const [catDesc, setCatDesc] = useState("")

  // Item form
  const [itemCatId, setItemCatId] = useState("")
  const [itemQuestion, setItemQuestion] = useState("")
  const [itemAnswer, setItemAnswer] = useState<any>(null)
  const [itemPublished, setItemPublished] = useState(true)

  function openNewItem() {
    setEditItem(null)
    setItemCatId(categories[0]?.id ?? "")
    setItemQuestion("")
    setItemAnswer(null)
    setItemPublished(true)
    setShowItemForm(true)
  }

  function openEditItem(item: FaqItem) {
    setEditItem(item)
    setItemCatId(item.categoryId ?? "")
    setItemQuestion(item.question)
    setItemAnswer(item.answer)
    setItemPublished(item.isPublished)
    setShowItemForm(true)
  }

  function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createFaqCategory({ name: catName, description: catDesc })
      if (result.error) toast.error(result.error)
      else {
        toast.success("Kategorie erstellt")
        setShowCatForm(false)
        setCatName("")
        setCatDesc("")
        router.refresh()
      }
    })
  }

  function handleSubmitItem(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const data = { categoryId: itemCatId, question: itemQuestion, answer: itemAnswer || {}, isPublished: itemPublished }
      const result = editItem ? await updateFaqItem(editItem.id, data) : await createFaqItem(data)
      if (result.error) toast.error(result.error)
      else {
        toast.success(editItem ? "FAQ aktualisiert" : "FAQ erstellt")
        setShowItemForm(false)
        router.refresh()
      }
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const result = deleteTarget.type === "category"
        ? await deleteFaqCategory(deleteTarget.id)
        : await deleteFaqItem(deleteTarget.id)
      if (result.error) toast.error(result.error)
      else {
        toast.success(deleteTarget.type === "category" ? "Kategorie gelöscht" : "FAQ gelöscht")
        router.refresh()
      }
      setDeleteTarget(null)
    })
  }

  return (
    <>
      <div className="flex gap-3 mb-6">
        <button onClick={openNewItem} className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
          <Plus className="w-4 h-4" /> Neuer FAQ-Eintrag
        </button>
        <button onClick={() => setShowCatForm(true)} className="flex items-center gap-2 py-2.5 px-5 bg-white/[0.07] text-white text-sm font-medium rounded-xl border border-white/[0.12] hover:bg-white/[0.1] transition-colors">
          <Plus className="w-4 h-4" /> Kategorie
        </button>
      </div>

      {categories.length > 0 ? (
        categories.map((cat) => {
          const catItems = items.filter((i) => i.categoryId === cat.id)
          return (
            <div key={cat.id} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title={cat.name} />
                <button
                  onClick={() => setDeleteTarget({ type: "category", id: cat.id })}
                  className="p-1.5 rounded-lg text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div key={item.id} className="rounded-xl bg-white/[0.07] border border-white/[0.12] px-6 py-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white">{item.question}</span>
                      {!item.isPublished && (
                        <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-acl-orange/10 text-acl-orange">Entwurf</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditItem(item)} className="p-1.5 rounded-lg text-white/50 hover:text-acl-orange hover:bg-acl-orange/10 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget({ type: "item", id: item.id })} className="p-1.5 rounded-lg text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {catItems.length === 0 && (
                  <p className="text-sm text-white/50 px-2">Keine FAQ-Einträge in dieser Kategorie.</p>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <div className="rounded-xl bg-white/[0.07] border border-white/[0.12] p-8 text-center">
          <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-sm text-white/50">Erstellen Sie zuerst eine Kategorie.</p>
        </div>
      )}

      {/* Category Form */}
      <Dialog open={showCatForm} onOpenChange={setShowCatForm}>
        <DialogContent className="rounded-xl">
          <DialogHeader><DialogTitle className="text-acl-dark">Neue Kategorie</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Name</Label>
              <Input value={catName} onChange={(e) => setCatName(e.target.value)} required className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Beschreibung</Label>
              <Input value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <button type="submit" disabled={isPending || !catName} className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50">
              {isPending ? "Erstellen..." : "Erstellen"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Item Form */}
      <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
        <DialogContent className="rounded-xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-acl-dark">{editItem ? "FAQ bearbeiten" : "Neuer FAQ-Eintrag"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmitItem} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Kategorie</Label>
              <Select value={itemCatId} onValueChange={(v) => setItemCatId(v ?? "")}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Kategorie wählen..." /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Frage</Label>
              <Input value={itemQuestion} onChange={(e) => setItemQuestion(e.target.value)} required className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Antwort</Label>
              <TiptapEditor content={itemAnswer} onChange={setItemAnswer} placeholder="Antwort eingeben..." />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="item-published" checked={itemPublished} onCheckedChange={(checked) => setItemPublished(checked as boolean)} className="border-gray-300 data-[state=checked]:bg-acl-orange data-[state=checked]:border-acl-orange" />
              <Label htmlFor="item-published" className="text-sm text-acl-dark cursor-pointer">Veröffentlichen</Label>
            </div>
            <button type="submit" disabled={isPending} className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50">
              {isPending ? "Speichern..." : editItem ? "Aktualisieren" : "Erstellen"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget?.type === "category" ? "Kategorie löschen" : "FAQ-Eintrag löschen"}
        description={deleteTarget?.type === "category" ? "Alle FAQ-Einträge in dieser Kategorie werden ebenfalls gelöscht." : "Dieser FAQ-Eintrag wird unwiderruflich gelöscht."}
        confirmLabel="Löschen"
        onConfirm={handleDelete}
        isDestructive
        isPending={isPending}
      />
    </>
  )
}
