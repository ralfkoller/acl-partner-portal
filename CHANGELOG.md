# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [Unreleased]

### Added
- **Testing-Infrastruktur:** Vitest 4 + Testing Library für Unit-Tests; Playwright für E2E-Tests.
  - `vitest.config.ts` + `vitest.setup.ts` — jsdom-Environment, `@testing-library/jest-dom` global
  - `playwright.config.ts` — webServer (Dev-Server), storageState-basierte Auth-Session, getrennte Projekte für Login- und Admin-Tests
  - Unit-Tests: `src/lib/schemas/auth.test.ts` (20 Tests), `src/lib/schemas/news.test.ts` (9 Tests), `src/components/admin/admin-users-list.test.tsx` (15 Tests) — 39/39 grün
  - E2E-Tests: `e2e/login.spec.ts` (5 Tests), `e2e/admin-users.spec.ts` (11 Tests) — 16/16 grün
  - `.env.test.local.example` als Vorlage für E2E-Credentials
  - Scripts: `pnpm test`, `pnpm test:watch`, `pnpm test:e2e`, `pnpm test:e2e:ui`
- **Benutzer erstellen in der Admin-Benutzerverwaltung:** Neuer Dialog unter `/admin/benutzer` mit zwei Tabs — "Erstellen" (sofortiges Anlegen mit Passwort via Supabase Admin API) und "Einladen" (Email-Einladung via Supabase). Neuer Supabase Admin-Client (`src/lib/supabase/admin.ts`) mit Service Role Key. Neue Server Actions `createUser()` und `inviteUser()` (`src/lib/actions/users.ts`).
- Umgebungsvariable `NEXT_PUBLIC_APP_URL` in `.env.local` ergänzt.

### Fixed
- **Login hängt im Rendering:** `redirect()` in der `login` Server Action wurde innerhalb von `useTransition` aufgerufen, was dazu führte, dass der `NEXT_REDIRECT`-Error von React abgefangen wurde und die Transition nie abschloss. Die Action gibt nun `{ redirect: "/dashboard" }` zurück; der Client führt den Redirect via `router.push()` aus.
- **Passwort-Reset-Link zeigt auf falsche URL:** `redirectTo` in `resetPasswordForEmail` verwendete `NEXT_PUBLIC_SUPABASE_URL` (Supabase-API-URL) statt der App-URL. Korrigiert auf `NEXT_PUBLIC_APP_URL` mit Fallback auf `http://localhost:3000`.

---

## [0.4.0] — 2026-03-27

### Added
- ACL-Logo in Login, Sidebars, Hero-Banner und Favicon integriert.

### Fixed
- Tiptap Editor: `immediatelyRender: false` gesetzt um SSR-Hydration-Mismatch zu beheben.
- `getUser()`: Error-Logging ergänzt; `is_admin()`-Funktion in Migration nach `profiles`-Tabelle verschoben.

## [0.3.0] — 2026-03-27

### Added
- Vollständige Partner-Portal-Implementierung (Phasen 1–4):
  - Auth (Login, Logout, Passwort-Reset)
  - Partner-Bereich: Dashboard, Dateien, Kalender, Wiki, Profil
  - Admin-Bereich: News, Dateien, Kalender, Wiki, Benutzerverwaltung
  - Supabase Schema mit RLS-Policies
  - ACL Design System (Tailwind v4, shadcn/ui, Roboto)

## [0.1.0] — 2026-03-27

### Added
- Initial Commit: Next.js 15 + Supabase + Tailwind v4 Projektsetup.
