"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Category {
  id: string
  name: string
}

interface DateienFilterProps {
  categories: Category[]
}

export function DateienFilter({ categories }: DateienFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

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
    // Debounce
    const timeout = setTimeout(() => updateParams("search", value), 300)
    return () => clearTimeout(timeout)
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
        <Input
          placeholder="Dateien durchsuchen..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-11 py-3 rounded-xl bg-white border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams("category", "")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !activeCategory
              ? "bg-acl-orange text-white"
              : "bg-white text-acl-gray border border-gray-200 hover:border-acl-orange hover:text-acl-orange"
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
                ? "bg-acl-orange text-white"
                : "bg-white text-acl-gray border border-gray-200 hover:border-acl-orange hover:text-acl-orange"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
