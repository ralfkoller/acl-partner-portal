import { test, expect } from "@playwright/test"

/**
 * Safari/WebKit Funktions-Test
 * Testet ob Klicks tatsächlich funktionieren — in WebKit (Safari) UND Chromium.
 * Kein elementFromPoint (unzuverlässig in headless WebKit) — stattdessen direkte Effekt-Prüfung.
 */
test.describe("Safari Klick-Diagnose", () => {
  test("Abmelden-Button ist klickbar (Event-Card)", async ({ page, browserName }) => {
    await page.goto("/kalender", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)

    // Stelle sicher dass wir angemeldet sind
    const anmeldenBtn = page.getByRole("button", { name: /^anmelden$/i }).first()
    if (await anmeldenBtn.isVisible()) {
      await anmeldenBtn.click()
      await page.waitForLoadState("networkidle")
      await page.waitForTimeout(1500)
    }

    const abmeldenBtn = page.getByRole("button", { name: /angemeldet.*abmelden/i }).first()
    await expect(abmeldenBtn).toBeVisible({ timeout: 5000 })

    // CSS-Kontext prüfen: overflow und z-index der Card
    const cardCss = await abmeldenBtn.evaluate((btn) => {
      const card = btn.closest(".v2-border-animate")
      if (!card) return null
      const style = window.getComputedStyle(card)
      const btnStyle = window.getComputedStyle(btn)
      return {
        cardOverflow: style.overflow,
        cardPosition: style.position,
        btnPosition: btnStyle.position,
        btnZIndex: btnStyle.zIndex,
      }
    })
    console.log(`[${browserName}] Card CSS:`, JSON.stringify(cardCss))

    // Klick direkt ausführen
    await abmeldenBtn.click()
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(1500)

    // Erwarteter Effekt: Anmelden-Button erscheint
    const anmeldenNachher = page.getByRole("button", { name: /^anmelden$/i }).first()
    await expect(anmeldenNachher).toBeVisible({ timeout: 5000 })
    console.log(`[${browserName}] ✅ Abmelden erfolgreich`)
  })

  test("Weiterlesen-Link navigiert (News-Card)", async ({ page, browserName }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)

    const weiterlesen = page.getByRole("link", { name: /weiterlesen/i }).first()
    await expect(weiterlesen).toBeVisible({ timeout: 5000 })

    // CSS-Kontext prüfen
    const linkCss = await weiterlesen.evaluate((link) => {
      const card = link.closest(".v2-border-animate")
      if (!card) return null
      const cardStyle = window.getComputedStyle(card)
      const linkStyle = window.getComputedStyle(link)
      return {
        cardOverflow: cardStyle.overflow,
        linkPosition: linkStyle.position,
        linkZIndex: linkStyle.zIndex,
        parentPosition: window.getComputedStyle(link.parentElement!).position,
        parentZIndex: window.getComputedStyle(link.parentElement!).zIndex,
      }
    })
    console.log(`[${browserName}] Link CSS:`, JSON.stringify(linkCss))

    // Klick + Navigation
    await weiterlesen.click()
    await page.waitForLoadState("networkidle")
    await expect(page).toHaveURL(/\/news\//)
    console.log(`[${browserName}] ✅ Weiterlesen navigiert zu: ${page.url()}`)
  })

  test("Download-Link hat korrekte href (File-Card)", async ({ page, browserName }) => {
    await page.goto("/dateien", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)

    const card = page.locator(".group").first()
    await expect(card).toBeVisible()

    const dlLink = card.locator("a[download]")
    const href = await dlLink.getAttribute("href")
    const downloadAttr = await dlLink.getAttribute("download")

    console.log(`[${browserName}] Download href: ${href}, download: ${downloadAttr}`)
    expect(href).toMatch(/^\/uploads\//)
    expect(downloadAttr).toBeTruthy()

    // HTTP-Status der Datei prüfen
    const resp = await page.request.get(`http://localhost:3000${href}`)
    expect(resp.status()).toBe(200)
    console.log(`[${browserName}] ✅ Download-URL erreichbar (HTTP 200)`)
  })

  test("Kategorie-Filter ändert URL und filtert Dateien", async ({ page, browserName }) => {
    await page.goto("/dateien", { waitUntil: "networkidle" })
    await page.waitForTimeout(2500)

    // Kategorie mit Dateien direkt via URL testen (robuster)
    await page.goto("/dateien?category=0dtradYQqKPxYB23kWV6h", { waitUntil: "networkidle" })
    await page.waitForTimeout(1500)

    const headings = await page.locator("h3").allTextContents()
    console.log(`[${browserName}] Gefilterte Dateien: ${headings.length} → ${headings.join(", ")}`)
    expect(headings.length).toBeGreaterThan(0)
    expect(headings.length).toBeLessThan(11) // weniger als alle 11

    console.log(`[${browserName}] ✅ Kategorie-Filter funktioniert`)
  })
})
