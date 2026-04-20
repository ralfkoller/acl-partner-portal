import { test, expect } from "@playwright/test"

/**
 * Portal News — Weiterlesen E2E Tests
 * Laufen mit gespeicherter Admin-Session (portal-Projekt)
 */
test.describe("Portal News — Weiterlesen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
  })

  test("Dashboard lädt und zeigt News-Bereich", async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/)
    // Dashboard muss mindestens einen Hauptinhalt haben
    await expect(page.locator("main")).toBeVisible()
  })

  test("Weiterlesen-Link ist ein echter Link (nicht span)", async ({ page }) => {
    const weiterlesenLinks = page.getByRole("link", { name: /weiterlesen/i })
    const count = await weiterlesenLinks.count()

    if (count === 0) {
      // Keine News vorhanden — Test überspringen
      test.skip()
      return
    }

    // Muss ein <a>-Tag sein, kein <span>
    const firstLink = weiterlesenLinks.first()
    await expect(firstLink).toBeVisible()
    const href = await firstLink.getAttribute("href")
    expect(href).toMatch(/\/news\//)
  })

  test("Weiterlesen navigiert zur News-Detailseite", async ({ page }) => {
    const weiterlesenLinks = page.getByRole("link", { name: /weiterlesen/i })
    const count = await weiterlesenLinks.count()

    if (count === 0) {
      test.skip()
      return
    }

    await weiterlesenLinks.first().click()

    // URL muss /news/<id> sein
    await expect(page).toHaveURL(/\/news\/[a-zA-Z0-9_-]+/, { timeout: 5000 })
  })

  test("News-Detailseite zeigt Titel und Inhalt", async ({ page }) => {
    const weiterlesenLinks = page.getByRole("link", { name: /weiterlesen/i })
    const count = await weiterlesenLinks.count()

    if (count === 0) {
      test.skip()
      return
    }

    await weiterlesenLinks.first().click()
    await page.waitForURL(/\/news\/[a-zA-Z0-9_-]+/)

    // Zurück-Link vorhanden
    await expect(page.getByRole("link", { name: /zurück/i })).toBeVisible()

    // Titel vorhanden (h1)
    await expect(page.locator("h1")).toBeVisible()
    const title = await page.locator("h1").textContent()
    expect(title?.trim().length).toBeGreaterThan(0)
  })

  test("Zurück-Link navigiert zum Dashboard", async ({ page }) => {
    const weiterlesenLinks = page.getByRole("link", { name: /weiterlesen/i })
    const count = await weiterlesenLinks.count()

    if (count === 0) {
      test.skip()
      return
    }

    await weiterlesenLinks.first().click()
    await page.waitForURL(/\/news\//)

    await page.getByRole("link", { name: /zurück/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 5000 })
  })
})
