import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen haben"),
})

export const resetPasswordSchema = z.object({
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
})

export const profileSchema = z.object({
  full_name: z.string().min(1, "Name ist erforderlich").max(100),
  company: z.string().max(100).optional(),
})

export const inviteUserSchema = z.object({
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  full_name: z.string().min(1, "Name ist erforderlich").max(100),
  company: z.string().max(100).optional(),
  role: z.enum(["admin", "partner"]).default("partner"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type InviteUserFormData = z.infer<typeof inviteUserSchema>
