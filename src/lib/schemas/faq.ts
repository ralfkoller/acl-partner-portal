import { z } from "zod/v4"

export const faqCategorySchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  description: z.string().max(300).optional(),
  sort_order: z.number().int().default(0),
})

export const faqItemSchema = z.object({
  category_id: z.string().uuid("Kategorie ist erforderlich"),
  question: z.string().min(1, "Frage ist erforderlich").max(500),
  answer: z.record(z.string(), z.unknown()).describe("Tiptap JSON content"),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type FaqCategoryFormData = z.infer<typeof faqCategorySchema>
export type FaqItemFormData = z.infer<typeof faqItemSchema>
