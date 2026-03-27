import { z } from "zod/v4"

export const eventSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich").max(200),
  description: z.record(z.string(), z.unknown()).optional(),
  location: z.string().max(200).optional(),
  event_url: z.string().url().optional().or(z.literal("")),
  start_date: z.string().min(1, "Startdatum ist erforderlich"),
  end_date: z.string().optional(),
  max_seats: z.number().int().positive().optional(),
  is_published: z.boolean().default(false),
})

export type EventFormData = z.infer<typeof eventSchema>
