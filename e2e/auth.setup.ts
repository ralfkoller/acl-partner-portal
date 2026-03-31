import { test as setup } from "@playwright/test"
import path from "path"

const authFile = path.join(__dirname, ".auth/user.json")

/**
 * Einmalig einloggen und Session als storageState speichern.
 * Credentials via Umgebungsvariablen:
 *   E2E_ADMIN_EMAIL    — Admin-Benutzer E-Mail
 *   E2E_ADMIN_PASSWORD — Admin-Benutzer Passwort
 *
 * Für lokale Entwicklung: .env.test.local anlegen (wird von Playwright
 * automatisch geladen wenn dotenv installiert ist).
 */
setup("als Admin einloggen", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL
  const password = process.env.E2E_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      "E2E_ADMIN_EMAIL und E2E_ADMIN_PASSWORD müssen als Umgebungsvariablen gesetzt sein.\n" +
        "Tipp: .env.test.local im Projektstamm anlegen."
    )
  }

  await page.goto("/login")
  await page.getByLabel(/e-mail/i).fill(email)
  await page.getByLabel(/passwort/i).fill(password)
  await page.getByRole("button", { name: /anmelden/i }).click()

  // Warten bis Redirect auf Dashboard abgeschlossen
  await page.waitForURL("**/dashboard", { timeout: 10_000 })

  // Session speichern
  await page.context().storageState({ path: authFile })
})
