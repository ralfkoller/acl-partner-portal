import { describe, it, expect } from "vitest"
import { loginSchema, resetPasswordSchema, profileSchema, inviteUserSchema } from "./auth"

describe("loginSchema", () => {
  it("akzeptiert gültige Credentials", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "secret123" })
    expect(result.success).toBe(true)
  })

  it("lehnt ungültige E-Mail ab", () => {
    const result = loginSchema.safeParse({ email: "kein-email", password: "secret123" })
    expect(result.success).toBe(false)
  })

  it("lehnt zu kurzes Passwort ab", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "abc" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/6 Zeichen/)
    }
  })

  it("lehnt fehlende Felder ab", () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("resetPasswordSchema", () => {
  it("akzeptiert gültige E-Mail", () => {
    const result = resetPasswordSchema.safeParse({ email: "user@example.com" })
    expect(result.success).toBe(true)
  })

  it("lehnt ungültige E-Mail ab", () => {
    const result = resetPasswordSchema.safeParse({ email: "kein-email" })
    expect(result.success).toBe(false)
  })
})

describe("profileSchema", () => {
  it("akzeptiert Name ohne Unternehmen", () => {
    const result = profileSchema.safeParse({ full_name: "Max Mustermann" })
    expect(result.success).toBe(true)
  })

  it("akzeptiert Name mit Unternehmen", () => {
    const result = profileSchema.safeParse({ full_name: "Max Mustermann", company: "ACL GmbH" })
    expect(result.success).toBe(true)
  })

  it("lehnt leeren Namen ab", () => {
    const result = profileSchema.safeParse({ full_name: "" })
    expect(result.success).toBe(false)
  })

  it("lehnt zu langen Namen ab (>100 Zeichen)", () => {
    const result = profileSchema.safeParse({ full_name: "A".repeat(101) })
    expect(result.success).toBe(false)
  })
})

describe("inviteUserSchema", () => {
  it("akzeptiert vollständige Daten", () => {
    const result = inviteUserSchema.safeParse({
      email: "partner@example.com",
      full_name: "Anna Partner",
      company: "Partner GmbH",
      role: "partner",
    })
    expect(result.success).toBe(true)
  })

  it("verwendet partner als Standard-Rolle", () => {
    const result = inviteUserSchema.safeParse({
      email: "partner@example.com",
      full_name: "Anna Partner",
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.role).toBe("partner")
  })

  it("akzeptiert admin als Rolle", () => {
    const result = inviteUserSchema.safeParse({
      email: "admin@example.com",
      full_name: "Admin User",
      role: "admin",
    })
    expect(result.success).toBe(true)
  })

  it("lehnt ungültige Rolle ab", () => {
    const result = inviteUserSchema.safeParse({
      email: "user@example.com",
      full_name: "Test User",
      role: "superuser",
    })
    expect(result.success).toBe(false)
  })

  it("lehnt ungültige E-Mail ab", () => {
    const result = inviteUserSchema.safeParse({
      email: "kein-email",
      full_name: "Test User",
    })
    expect(result.success).toBe(false)
  })
})
