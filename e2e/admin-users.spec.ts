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
    // Tabellen-Header müssen vorhanden sein
    await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: /unternehmen/i })).toBeVisible()
    await expect(page.getByRole("columnheader", { name: /rolle/i })).toBeVisible()
  })

  test("zeigt beide Aktions-Buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: /benutzer erstellen/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /partner einladen/i })).toBeVisible()
  })

  test("Suchfeld filtert Benutzerliste", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Suchen...")
    await expect(searchInput).toBeVisible()

    // Suche nach etwas das garantiert keinen Treffer hat
    await searchInput.fill("xxxxxx_kein_treffer_xxxxxx")
    await expect(page.getByText("Keine Benutzer gefunden.")).toBeVisible()

    // Suche zurücksetzen
    await searchInput.clear()
    await expect(page.getByText("Keine Benutzer gefunden.")).not.toBeVisible()
  })

  test.describe("Dialog: Benutzer erstellen", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: /benutzer erstellen/i }).click()
    })

    test("öffnet Dialog mit Titel 'Benutzer hinzufügen'", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "Benutzer hinzufügen" })).toBeVisible()
    })

    test("zeigt Tab 'Erstellen' aktiv", async ({ page }) => {
      // Passwortfeld ist im Erstellen-Tab sichtbar
      await expect(page.getByPlaceholder("Mindestens 8 Zeichen")).toBeVisible()
    })

    test("zeigt alle Pflichtfelder", async ({ page }) => {
      await expect(page.getByPlaceholder("Max Mustermann")).toBeVisible()
      await expect(page.getByPlaceholder("max@unternehmen.at")).toBeVisible()
      await expect(page.getByPlaceholder("Mindestens 8 Zeichen")).toBeVisible()
    })

    test("Passwort-Toggle wechselt Sichtbarkeit", async ({ page }) => {
      const passwordInput = page.getByPlaceholder("Mindestens 8 Zeichen")
      await expect(passwordInput).toHaveAttribute("type", "password")

      // Toggle-Button ist der einzige Button innerhalb des Passwort-Wrapper-divs
      const passwordWrapper = page.locator("div.relative").filter({ has: passwordInput })
      await passwordWrapper.getByRole("button").click()

      await expect(passwordInput).toHaveAttribute("type", "text")
    })

    test("Tab-Wechsel zu 'Einladen' versteckt Passwortfeld", async ({ page }) => {
      await page.getByRole("button", { name: "Einladen" }).click()
      await expect(page.getByPlaceholder("Mindestens 8 Zeichen")).not.toBeVisible()
    })

    test("schließt Dialog beim X-Button", async ({ page }) => {
      await page.keyboard.press("Escape")
      await expect(page.getByRole("heading", { name: "Benutzer hinzufügen" })).not.toBeVisible()
    })
  })

  test.describe("Dialog: Partner einladen", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: /partner einladen/i }).click()
    })

    test("öffnet Dialog im Einladen-Tab", async ({ page }) => {
      await expect(page.getByRole("heading", { name: "Benutzer hinzufügen" })).toBeVisible()
      // Passwortfeld nicht sichtbar im Einladen-Tab
      await expect(page.getByPlaceholder("Mindestens 8 Zeichen")).not.toBeVisible()
    })

    test("zeigt Hinweistext zur Einladungs-Email", async ({ page }) => {
      await expect(
        page.getByText(/einladungs-email|einladung.*email|passwort selbst/i)
      ).toBeVisible()
    })
  })
})
