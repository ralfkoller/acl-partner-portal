import { test, expect } from "@playwright/test"

/**
 * Admin Dateien — Upload & Kategorie E2E Tests
 * Laufen mit gespeicherter Admin-Session (chromium-Projekt)
 */
test.describe("Admin Dateien — Upload & Kategorie", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/dateien")
  })

  test("Dateien-Seite lädt korrekt", async ({ page }) => {
    await expect(page.getByRole("button", { name: /datei hochladen/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /kategorie/i })).toBeVisible()
  })

  test("Upload-Dialog öffnet sich", async ({ page }) => {
    await page.getByRole("button", { name: /datei hochladen/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: /datei hochladen/i })).toBeVisible()
  })

  test("Kategorie-Dialog öffnet sich", async ({ page }) => {
    await page.getByRole("button", { name: /^kategorie$/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: /neue kategorie/i })).toBeVisible()
  })

  test("Neue Kategorie kann erstellt werden", async ({ page }) => {
    const catName = `Test-Kat-${Date.now()}`

    await page.getByRole("button", { name: /^kategorie$/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()

    const nameInput = page.getByRole("dialog").getByRole("textbox").first()
    await nameInput.fill(catName)

    await page.getByRole("button", { name: /erstellen/i }).click()

    await expect(page.getByText(/kategorie erstellt/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 })
  })

  test("Upload-Dialog: Kategorie-Select öffnet sich und zeigt Optionen", async ({ page }) => {
    // Kategorie erstellen und Seite neu laden damit sie im Select erscheint
    const catName = `Select-Kat-${Date.now()}`
    await page.getByRole("button", { name: /^kategorie$/i }).click()
    await page.getByRole("dialog").getByRole("textbox").first().fill(catName)
    await page.getByRole("button", { name: /erstellen/i }).click()
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 })

    // Seite neu laden damit die neue Kategorie im Upload-Dialog erscheint
    await page.reload()

    // Upload-Dialog öffnen
    await page.getByRole("button", { name: /datei hochladen/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()

    // Kategorie-Select Trigger anklicken
    const categoryTrigger = page.getByRole("dialog").getByRole("combobox")
    await expect(categoryTrigger).toBeVisible()
    await categoryTrigger.click()

    // "Keine Kategorie" Option muss sichtbar sein
    await expect(page.getByRole("option", { name: /keine kategorie/i })).toBeVisible({ timeout: 3000 })

    // Erstellte Kategorie muss in der Liste sein
    await expect(page.getByRole("option", { name: catName })).toBeVisible({ timeout: 3000 })

    // Kategorie auswählen — kein Fehler
    await page.getByRole("option", { name: catName }).click()

    // Dialog ist noch offen (Auswahl schließt das Dropdown, nicht den Dialog)
    await expect(page.getByRole("heading", { name: /datei hochladen/i })).toBeVisible()
  })

  test("Upload-Dialog: Datei hochladen mit Kategorie", async ({ page }) => {
    // Kategorie erstellen
    const catName = `Upload-Kat-${Date.now()}`
    await page.getByRole("button", { name: /^kategorie$/i }).click()
    await page.getByRole("dialog").getByRole("textbox").first().fill(catName)
    await page.getByRole("button", { name: /erstellen/i }).click()
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 })

    // Seite reload damit Kategorie im Upload-Dialog verfügbar
    await page.reload()

    // Upload starten
    await page.getByRole("button", { name: /datei hochladen/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()

    // Eindeutigen Dateinamen verwenden
    const testFileName = `test-${Date.now()}.txt`

    const fileInput = page.getByRole("dialog").locator("input[type=file]")
    await fileInput.setInputFiles({
      name: testFileName,
      mimeType: "text/plain",
      buffer: Buffer.from("Playwright Testdatei"),
    })

    // Kategorie wählen
    const categoryTrigger = page.getByRole("dialog").getByRole("combobox")
    await categoryTrigger.click()
    await page.getByRole("option", { name: catName }).click()

    // Hochladen
    await page.getByRole("button", { name: /hochladen/i }).click()

    // Erfolg-Toast
    await expect(page.getByText(/datei hochgeladen/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 3000 })

    // Datei erscheint in der Tabelle (first() um strict mode zu vermeiden)
    await expect(page.getByRole("cell", { name: testFileName }).first()).toBeVisible({ timeout: 3000 })
  })
})
