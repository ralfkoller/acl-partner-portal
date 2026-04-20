import { test, expect } from "@playwright/test"

/**
 * Portal Kalender — Event-Anmeldung E2E Tests
 * Laufen mit gespeicherter Admin-Session (portal-Projekt)
 */
test.describe("Portal Kalender — Event-Anmeldung", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/kalender")
  })

  test("Kalender-Seite lädt korrekt", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /kalender/i })).toBeVisible()
    await expect(page.getByRole("heading", { name: /kommende events/i })).toBeVisible()
  })

  test("Monats-Navigation funktioniert", async ({ page }) => {
    // Aktueller Monat ist sichtbar
    const monthHeader = page.locator(".v2-glass-glow h3").first()
    await expect(monthHeader).toBeVisible()

    const initialMonth = await monthHeader.textContent()

    // Navigations-Buttons im Kalender-Header — Zurück ist der erste, Vor der letzte
    // Wir klicken den "Vor"-Button (letzter Button in der Navigationsreihe vor "Heute")
    const navButtons = page.locator(".v2-glass-glow button")
    await navButtons.last().click()
    const newMonth = await monthHeader.textContent()
    expect(newMonth).not.toBe(initialMonth)

    // Heute-Button zurück
    await page.getByRole("button", { name: /heute/i }).click()
    await expect(monthHeader).toHaveText(initialMonth!)
  })

  test("Anmelden-Button ist sichtbar wenn Event vorhanden", async ({ page }) => {
    // Wenn kein Event vorhanden — Test überspringen
    const noEvents = page.getByText(/keine kommenden events/i)
    const hasNoEvents = await noEvents.isVisible().catch(() => false)
    if (hasNoEvents) {
      test.skip()
      return
    }

    // Falls bereits angemeldet: erst abmelden damit wir den Anmelden-Button sehen
    const alreadyRegistered = page.getByRole("button", { name: /angemeldet.*abmelden/i }).first()
    if (await alreadyRegistered.isVisible().catch(() => false)) {
      await alreadyRegistered.click()
      await page.waitForTimeout(1500)
    }

    await expect(page.getByRole("button", { name: /^anmelden$/i }).first()).toBeVisible()
  })

  test("Anmelden-Button ist klickbar und löst Aktion aus", async ({ page }) => {
    const noEvents = page.getByText(/keine kommenden events/i)
    const hasNoEvents = await noEvents.isVisible().catch(() => false)
    if (hasNoEvents) {
      test.skip()
      return
    }

    // Falls bereits angemeldet: erst abmelden
    const alreadyRegistered = page.getByRole("button", { name: /angemeldet.*abmelden/i }).first()
    if (await alreadyRegistered.isVisible().catch(() => false)) {
      await alreadyRegistered.click()
      await page.waitForTimeout(1500)
    }

    const registerBtn = page.getByRole("button", { name: /^anmelden$/i }).first()
    await expect(registerBtn).toBeVisible()
    await expect(registerBtn).toBeEnabled()

    // Klicken
    await registerBtn.click()

    // Button wechselt zu "Angemeldet — Abmelden?" oder Toast erscheint
    // Wir warten auf irgendeines von beiden — first() verhindert strict-mode-Fehler
    await expect(
      page.getByRole("button", { name: /angemeldet.*abmelden/i })
        .or(page.getByText(/erfolgreich angemeldet/i))
        .first()
    ).toBeVisible({ timeout: 5000 })
  })

  test("Nach Anmeldung: Abmelden-Button erscheint", async ({ page }) => {
    const noEvents = page.getByText(/keine kommenden events/i)
    const hasNoEvents = await noEvents.isVisible().catch(() => false)
    if (hasNoEvents) {
      test.skip()
      return
    }

    // Falls bereits angemeldet: erst abmelden
    const alreadyRegistered = page.getByRole("button", { name: /angemeldet.*abmelden/i }).first()
    if (await alreadyRegistered.isVisible().catch(() => false)) {
      await alreadyRegistered.click()
      await page.waitForLoadState("networkidle")
    }

    const registerBtn = page.getByRole("button", { name: /^anmelden$/i }).first()
    await expect(registerBtn).toBeVisible()
    await registerBtn.click()

    // Abmelden-Button muss erscheinen
    await expect(
      page.getByRole("button", { name: /angemeldet.*abmelden/i }).first()
    ).toBeVisible({ timeout: 8000 })
  })
})
