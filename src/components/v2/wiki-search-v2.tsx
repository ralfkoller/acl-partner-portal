"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"

export function WikiSearchV2() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [, startTransition] = useTransition()

  function handleSearch(value: string) {
    setSearch(value)
    const timeout = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams()
        if (value) params.set("search", value)
        router.push(`/wiki?${params.toString()}`)
      })
    }, 300)
    return () => clearTimeout(timeout)
  }

  return (
    <div className="relative max-w-md mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
      <input
        placeholder="FAQ durchsuchen..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 focus:border-acl-orange/50 focus:ring-2 focus:ring-acl-orange/10 focus:outline-none transition-all text-sm"
      />
    </div>
  )
}
