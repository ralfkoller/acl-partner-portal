import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // sequenziell wegen Auth-State
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Setup-Projekt: einmal einloggen, Session speichern
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    // Alle anderen Tests nutzen gespeicherte Session
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: /.*admin.*\.spec\.ts/,
    },
    // Login-Tests ohne Auth-State (testen den Login selbst)
    {
      name: "chromium-no-auth",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*login.*\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true, // nutzt laufenden Dev-Server
    timeout: 120_000,
  },
})
