"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Portal error:", error)
  }, [error])

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-acl-dark mb-2">
        Fehler beim Laden
      </h2>
      <p className="text-acl-gray mb-6 text-center max-w-sm">
        Beim Laden dieser Seite ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      {error.digest && (
        <p className="text-xs text-acl-gray/60 mb-4 font-mono">
          Fehler-ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-xl gap-2")}
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <Button
          onClick={reset}
          className="bg-acl-orange hover:bg-acl-orange/90 text-white rounded-xl gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Erneut versuchen
        </Button>
      </div>
    </div>
  )
}
