"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface DateienFilterV2Props {
  categories: Category[]
}

export function DateienFilterV2({ categories }: DateienFilterV2Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeCategory = searchParams.get("category") ?? ""
  const searchValue = searchParams.get("search") ?? ""
  const [search, setSearch] = useState(searchValue)

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/dateien?${params.toString()}`)
    })
  }

  function handleSearch(value: string) {
    setSearch(value)
    const timeout = setTimeout(() => updateParams("search", value), 300)
    return () => clearTimeout(timeout)
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          placeholder="Dateien durchsuchen..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 focus:border-acl-orange/50 focus:ring-2 focus:ring-acl-orange/10 focus:outline-none transition-all text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams("category", "")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !activeCategory
              ? "bg-acl-orange text-white v2-glow-sm"
              : "text-white/50 border border-white/10 hover:border-acl-orange/30 hover:text-acl-orange"
          }`}
        >
          Alle
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParams("category", cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-acl-orange text-white v2-glow-sm"
                : "text-white/50 border border-white/10 hover:border-acl-orange/30 hover:text-acl-orange"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
