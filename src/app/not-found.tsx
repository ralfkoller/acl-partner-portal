import Link from "next/link"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-acl-light">
      <div className="animate-fade-in text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-acl-orange/10 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-acl-orange" />
        </div>
        <h1 className="text-6xl font-bold text-acl-dark mb-2">404</h1>
        <h2 className="text-xl font-semibold text-acl-dark mb-2">
          Seite nicht gefunden
        </h2>
        <p className="text-acl-gray mb-8">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-acl-orange hover:bg-acl-orange/90 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zum Dashboard
        </Link>
      </div>
    </div>
  )
}
