"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function WikiSearch() {
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
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
      <Input
        placeholder="FAQ durchsuchen..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-11 py-3 rounded-xl bg-white border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
      />
    </div>
  )
}
