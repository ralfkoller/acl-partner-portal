import { db } from "@/lib/db"
import { faqCategories, faqItems } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { SectionHeader } from "@/components/portal/section-header"
import { FaqAccordion } from "@/components/portal/faq-accordion"
import { WikiSearch } from "@/components/portal/wiki-search"
import { BookOpen } from "lucide-react"

export const metadata = {
  title: "Wiki / FAQ",
}

function extractTextFromTiptapJson(json: unknown): string {
  if (!json) return ""
  if (typeof json === "string") {
    try {
      const parsed = JSON.parse(json)
      return extractTextFromTiptapJson(parsed)
    } catch {
      return json
    }
  }
  const node = json as Record<string, unknown>
  if (node.type === "text") return (node.text as string) || ""
  if (node.content) {
    return (node.content as unknown[]).map(extractTextFromTiptapJson).join(" ")
  }
  return ""
}

export default async function WikiPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams

  const [allCategories, allItems] = await Promise.all([
    db.select().from(faqCategories).orderBy(asc(faqCategories.sortOrder)),
    db.select().from(faqItems).where(eq(faqItems.isPublished, true)).orderBy(asc(faqItems.sortOrder)),
  ])

  let items = allItems
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    items = items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchLower) ||
        extractTextFromTiptapJson(item.answer).toLowerCase().includes(searchLower)
    )
  }

  const groupedItems = allCategories
    .map((cat) => ({
      ...cat,
      items: items.filter((item) => item.categoryId === cat.id),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-acl-dark">Wiki / FAQ</h1>
        <p className="text-sm text-acl-gray mt-1">
          Antworten auf häufig gestellte Fragen und Wissensdatenbank.
        </p>
      </div>

      <WikiSearch />

      {groupedItems.length > 0 ? (
        groupedItems.map((category) => (
          <div key={category.id} className="mb-8">
            <SectionHeader title={category.name} />
            <div className="space-y-3">
              {category.items.map((item) => (
                <FaqAccordion
                  key={item.id}
                  question={item.question}
                  answer={extractTextFromTiptapJson(item.answer)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl p-8 border border-gray-100/80 text-center">
          <BookOpen className="w-10 h-10 text-acl-gray/40 mx-auto mb-3" />
          <p className="text-acl-gray text-sm">
            {params.search
              ? "Keine Ergebnisse für Ihre Suche."
              : "Noch keine FAQ-Einträge vorhanden."}
          </p>
        </div>
      )}
    </div>
  )
}
