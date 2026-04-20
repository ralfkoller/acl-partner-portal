import { db } from "@/lib/db"
import { faqCategories, faqItems } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { SectionHeaderV2 } from "@/components/v2/section-header-v2"
import { FaqAccordionV2 } from "@/components/v2/faq-accordion-v2"
import { WikiSearchV2 } from "@/components/v2/wiki-search-v2"
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
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Wiki / FAQ</h1>
        <p className="text-sm text-white/60 mt-1">
          Antworten auf häufig gestellte Fragen und Wissensdatenbank.
        </p>
      </div>

      <WikiSearchV2 />

      {groupedItems.length > 0 ? (
        groupedItems.map((category) => (
          <div key={category.id} className="mb-8">
            <SectionHeaderV2 title={category.name} />
            <div className="space-y-3">
              {category.items.map((item) => (
                <FaqAccordionV2
                  key={item.id}
                  question={item.question}
                  answer={extractTextFromTiptapJson(item.answer)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="v2-glass p-8 text-center">
          <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/60 text-sm">
            {params.search
              ? "Keine Ergebnisse für Ihre Suche."
              : "Noch keine FAQ-Einträge vorhanden."}
          </p>
        </div>
      )}
    </>
  )
}
