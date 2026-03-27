import { z } from "zod/v4"

export const newsSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich").max(200, "Titel darf max. 200 Zeichen haben"),
  content: z.record(z.string(), z.unknown()).describe("Tiptap JSON content"),
  excerpt: z.string().max(500).optional(),
  cover_image: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean().default(false),
})

export type NewsFormData = z.infer<typeof newsSchema>
