"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { TiptapEditor } from "@/components/tiptap/editor"
import { createNews, updateNews } from "@/lib/actions/news"
import { toast } from "sonner"

interface NewsEditorProps {
  news?: {
    id: string
    title: string
    content: any
    excerpt: string | null
    isPublished: boolean
  }
}

export function NewsEditor({ news }: NewsEditorProps) {
  const isEditing = !!news
  const [title, setTitle] = useState(news?.title ?? "")
  const [content, setContent] = useState<any>(news?.content ?? null)
  const [excerpt, setExcerpt] = useState(news?.excerpt ?? "")
  const [isPublished, setIsPublished] = useState(news?.isPublished ?? false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !content) {
      toast.error("Titel und Inhalt sind erforderlich")
      return
    }

    startTransition(async () => {
      const data = { title, content, excerpt, isPublished }
      const result = isEditing
        ? await updateNews(news!.id, data)
        : await createNews(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditing ? "Artikel aktualisiert" : "Artikel erstellt")
        router.push("/admin/news")
      }
    })
  }

  return (
    <>
      <Link
        href="/admin/news"
        className="flex items-center gap-2 text-sm text-acl-gray hover:text-acl-dark mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
      </Link>

      <h1 className="text-2xl font-bold text-acl-dark mb-6">
        {isEditing ? "Artikel bearbeiten" : "Neuer Artikel"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-xl p-6 border border-gray-100/80 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-acl-dark">Titel</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Artikeltitel eingeben..."
              required
              className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-acl-dark">Vorschautext</Label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Kurze Zusammenfassung für die Vorschau..."
              rows={2}
              className="rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-acl-dark">Inhalt</Label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="published"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked as boolean)}
              className="border-gray-300 data-[state=checked]:bg-acl-orange data-[state=checked]:border-acl-orange"
            />
            <Label htmlFor="published" className="text-sm text-acl-dark cursor-pointer">
              Sofort veröffentlichen
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isPending ? "Speichern..." : isEditing ? "Aktualisieren" : "Erstellen"}
          </button>
          <Link
            href="/admin/news"
            className="py-3 px-6 bg-acl-light text-acl-dark font-medium rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </>
  )
}
