import { test, expect } from "@playwright/test"

/**
 * Admin Benutzerverwaltung E2E Tests
 * Laufen mit gespeicherter Admin-Session (chromium-Projekt)
 */
test.describe("Admin Benutzerverwaltung", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/benutzer")
  })

  test("zeigt Benutzerliste", async ({ page }) => {
    await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: /unternehmen/i })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: /rolle/i })).toBeVisible()
  })

  test("zeigt Benutzer erstellen Button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /benutzer erstellen/i })).toBeVisible()
  })

  test("Suchfeld filtert Benutzerliste", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Suchen...")
    await expect(searchInput).toBeVisible()

    await searchInput.fill("xxxxxx_kein_treffer_xxxxxx")
    await expect(page.getByText("Keine Benutzer gefunden.")).toBeVisible()

    await searchInput.clear()
    await expect(page.getByText("Keine Benutzer gefunden.")).not.toBeVisible()
  })

  test.describe("Dialog: Benutzer erstellen", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: /benutzer erstellen/i }).click()
      await expect(page.getByRole("dialog")).toBeVisible()
    })

    test("öffnet Dialog", async ({ page }) => {
      await expect(page.getByRole("heading", { name: /benutzer erstellen/i })).toBeVisible()
    })

    test("zeigt alle Pflichtfelder", async ({ page }) => {
      await expect(page.getByPlaceholder("Max Mustermann")).toBeVisible()
      await expect(page.getByPlaceholder("max@unternehmen.at")).toBeVisible()
      await expect(page.getByPlaceholder("Mindestens 8 Zeichen")).toBeVisible()
    })

    test("Passwort-Toggle wechselt Sichtbarkeit", async ({ page }) => {
      const passwordInput = page.getByPlaceholder("Mindestens 8 Zeichen")
      await expect(passwordInput).toHaveAttribute("type", "password")

      const passwordWrapper = page.locator("div.relative").filter({ has: passwordInput })
      await passwordWrapper.getByRole("button").click()

      await expect(passwordInput).toHaveAttribute("type", "text")
    })

    test("schließt Dialog bei Escape", async ({ page }) => {
      await page.keyboard.press("Escape")
      await expect(page.getByRole("dialog")).not.toBeVisible()
    })
  })
})
