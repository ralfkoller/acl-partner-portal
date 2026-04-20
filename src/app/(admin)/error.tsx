"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        Admin-Fehler
      </h2>
      <p className="text-white/60 mb-6 text-center max-w-sm">
        Beim Laden des Admin-Bereichs ist ein Fehler aufgetreten.
      </p>
      {error.digest && (
        <p className="text-xs text-white/40 mb-4 font-mono">
          Fehler-ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.12] bg-white/[0.05] text-white/80 hover:bg-white/[0.1] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Admin Dashboard
        </Link>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-acl-orange hover:bg-acl-orange/90 text-white text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}
