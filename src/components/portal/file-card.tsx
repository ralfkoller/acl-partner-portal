"use client"

import { FileText, FileSpreadsheet, FileArchive, FileImage, File, Download } from "lucide-react"

interface FileCardProps {
  id: string
  name: string
  description: string | null
  mimeType: string | null
  fileSize: number | null
  categoryName?: string
  storagePath: string
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return { icon: File, color: "#A5A5A5" }
  if (mimeType.includes("pdf")) return { icon: FileText, color: "#ef4444" }
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return { icon: FileSpreadsheet, color: "#F0A844" }
  if (mimeType.includes("zip") || mimeType.includes("archive"))
    return { icon: FileArchive, color: "#10b981" }
  if (mimeType.includes("image")) return { icon: FileImage, color: "#3b82f6" }
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return { icon: FileSpreadsheet, color: "#10b981" }
  return { icon: FileText, color: "#3b82f6" }
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileCard({
  name,
  description,
  mimeType,
  fileSize,
  categoryName,
  storagePath,
}: FileCardProps) {
  const { icon: FileIcon, color } = getFileIcon(mimeType)

  function handleDownload() {
    // storagePath ist relativ zu public/uploads/
    const url = `/uploads/${storagePath}`
    window.open(url, "_blank")
  }

  return (
    <div className="group bg-white rounded-xl p-6 border border-gray-100/80 card-hover relative">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <FileIcon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-acl-dark truncate">{name}</h3>
          {description && (
            <p className="text-xs text-acl-gray mt-1 line-clamp-1">{description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {categoryName && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-acl-orange/10 text-acl-orange">
                {categoryName}
              </span>
            )}
            {fileSize && (
              <span className="text-[10px] text-acl-gray">{formatFileSize(fileSize)}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-acl-orange/10 text-acl-orange hover:bg-acl-orange hover:text-white transition-all"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
