"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="de">
      <body className="min-h-screen flex items-center justify-center bg-acl-light">
        <div className="animate-fade-in text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-acl-dark mb-2">
            Etwas ist schiefgelaufen
          </h1>
          <p className="text-acl-gray mb-6">
            Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
          </p>
          {error.digest && (
            <p className="text-xs text-acl-gray/60 mb-4 font-mono">
              Fehler-ID: {error.digest}
            </p>
          )}
          <Button
            onClick={reset}
            className="bg-acl-orange hover:bg-acl-orange/90 text-white rounded-xl gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Erneut versuchen
          </Button>
        </div>
      </body>
    </html>
  )
}
