"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
} from "lucide-react"

interface TiptapEditorProps {
  content?: any
  onChange?: (json: any) => void
  placeholder?: string
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Schreiben Sie hier...",
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-acl-orange underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] focus:outline-none px-4 py-3 text-acl-dark",
      },
    },
  })

  if (!editor) return null

  function addLink() {
    const url = window.prompt("URL eingeben:")
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  function addImage() {
    const url = window.prompt("Bild-URL eingeben:")
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        isActive
          ? "bg-acl-orange/10 text-acl-orange"
          : "text-acl-gray hover:bg-acl-light hover:text-acl-dark"
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-acl-light/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Überschrift 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Überschrift 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Fett"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Aufzählung"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Nummerierung"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Zitat"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Trennlinie"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Bild">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="flex-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Rückgängig"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Wiederholen">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
