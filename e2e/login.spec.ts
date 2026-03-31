import { test, expect } from "@playwright/test"

/**
 * Login-Flow E2E Tests — laufen ohne gespeicherte Auth-Session
 * (chromium-no-auth Projekt in playwright.config.ts)
 */
test.describe("Login-Seite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
  })

  test("zeigt Login-Formular", async ({ page }) => {
    await expect(page.getByLabel(/e-mail/i)).toBeVisible()
    await expect(page.getByLabel(/passwort/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /anmelden/i })).toBeVisible()
  })

  test("zeigt Fehler bei falschen Credentials", async ({ page }) => {
    await page.getByLabel(/e-mail/i).fill("falsch@example.com")
    await page.getByLabel(/passwort/i).fill("wrongpassword")
    await page.getByRole("button", { name: /anmelden/i }).click()

    // Fehlermeldung erscheint (Toast oder Inline-Error)
    await expect(
      page.getByText(/ungültig|invalid|fehl|falsch/i).first()
    ).toBeVisible({ timeout: 8_000 })

    // Bleibt auf Login-Seite
    await expect(page).toHaveURL(/login/)
  })

  test("zeigt Fehler bei leerem Passwort", async ({ page }) => {
    await page.getByLabel(/e-mail/i).fill("user@example.com")
    await page.getByRole("button", { name: /anmelden/i }).click()

    // Bleibt auf Login-Seite (Browser-Validierung oder Server-Error)
    await expect(page).toHaveURL(/login/)
  })

  test("Button 'Passwort vergessen?' ist sichtbar", async ({ page }) => {
    await expect(page.getByRole("button", { name: /passwort vergessen/i })).toBeVisible()
  })

  test("Happy Path: erfolgreicher Login leitet auf Dashboard weiter", async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL
    const password = process.env.E2E_ADMIN_PASSWORD

    if (!email || !password) {
      test.skip(true, "E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD nicht gesetzt")
      return
    }

    await page.getByLabel(/e-mail/i).fill(email)
    await page.getByLabel(/passwort/i).fill(password)
    await page.getByRole("button", { name: /anmelden/i }).click()

    await page.waitForURL("**/dashboard", { timeout: 10_000 })
    await expect(page).toHaveURL(/dashboard/)
  })
})
