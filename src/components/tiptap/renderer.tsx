import { generateHTML } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"

interface TiptapRendererProps {
  content: any
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
  if (!content) return null

  try {
    const html = generateHTML(content, [
      StarterKit,
      Link.configure({
        HTMLAttributes: { class: "text-acl-orange underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full" },
      }),
    ])

    return (
      <div
        className="prose prose-sm max-w-none text-acl-dark"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  } catch {
    return <p className="text-sm text-acl-gray">Inhalt kann nicht angezeigt werden.</p>
  }
}
