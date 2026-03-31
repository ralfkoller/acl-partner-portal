import { describe, it, expect } from "vitest"
import { newsSchema } from "./news"

describe("newsSchema", () => {
  const validContent = { type: "doc", content: [] }

  it("akzeptiert gültige News", () => {
    const result = newsSchema.safeParse({
      title: "Neue Partnerschaft",
      content: validContent,
    })
    expect(result.success).toBe(true)
  })

  it("setzt is_published standardmäßig auf false", () => {
    const result = newsSchema.safeParse({
      title: "Neue Partnerschaft",
      content: validContent,
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.is_published).toBe(false)
  })

  it("akzeptiert veröffentlichte News", () => {
    const result = newsSchema.safeParse({
      title: "Neue Partnerschaft",
      content: validContent,
      is_published: true,
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.is_published).toBe(true)
  })

  it("lehnt leeren Titel ab", () => {
    const result = newsSchema.safeParse({ title: "", content: validContent })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/erforderlich/)
    }
  })

  it("lehnt Titel > 200 Zeichen ab", () => {
    const result = newsSchema.safeParse({ title: "A".repeat(201), content: validContent })
    expect(result.success).toBe(false)
  })

  it("lehnt Excerpt > 500 Zeichen ab", () => {
    const result = newsSchema.safeParse({
      title: "Titel",
      content: validContent,
      excerpt: "A".repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it("akzeptiert gültige cover_image URL", () => {
    const result = newsSchema.safeParse({
      title: "Titel",
      content: validContent,
      cover_image: "https://example.com/image.jpg",
    })
    expect(result.success).toBe(true)
  })

  it("akzeptiert leeren String als cover_image", () => {
    const result = newsSchema.safeParse({
      title: "Titel",
      content: validContent,
      cover_image: "",
    })
    expect(result.success).toBe(true)
  })

  it("lehnt ungültige URL als cover_image ab", () => {
    const result = newsSchema.safeParse({
      title: "Titel",
      content: validContent,
      cover_image: "kein-url",
    })
    expect(result.success).toBe(false)
  })
})
