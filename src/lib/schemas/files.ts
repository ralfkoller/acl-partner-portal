import { z } from "zod/v4"

export const fileUploadSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(200),
  description: z.string().max(500).optional(),
  category_id: z.string().uuid().optional(),
  is_published: z.boolean().default(true),
})

export const fileCategorySchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(100),
  description: z.string().max(300).optional(),
  sort_order: z.number().int().default(0),
})

export type FileUploadFormData = z.infer<typeof fileUploadSchema>
export type FileCategoryFormData = z.infer<typeof fileCategorySchema>
