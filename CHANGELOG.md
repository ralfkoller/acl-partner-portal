# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [Unreleased]

### Changed — Phase 10: Supabase-Rückstände bereinigen
- **`.env.local.example`** komplett neu geschrieben — nur noch `JWT_SECRET` + `DATABASE_URL`
- **`src/lib/types/database.ts`** gelöscht — 340-Zeilen Supabase-generierte Typ-Datei entfernt
- **`src/lib/auth/session.ts`** + **`src/lib/db/schema.ts`** — Supabase-Kommentare entfernt
- **`docs/STYLEGUIDE.md`** komplett von Supabase-Referenzen bereinigt:
  - Stack-Beschreibung, Backend-Tabelle, Import-Referenzen aktualisiert
  - "Server Component Data Fetching" + "Server Action Architektur" auf Drizzle umgeschrieben
  - "Datenbank & Auth" Abschnitt ersetzt den alten "Supabase Client-Auswahl" Abschnitt
  - Error Logging Beispiel: `Supabase error` → `DB error`
  - Dos: `parallele Supabase-Queries` → `Drizzle-Queries`
  - Don'ts: `supabase.auth.getSession()` + Admin-Client entfernt, durch generische Auth-Regel ersetzt
  - Action File Struktur: Supabase-Import → Drizzle-Imports
  - Template A (Admin-Listenseite): komplett auf Drizzle ORM umgeschrieben
  - Template C (Server Action): komplett auf Drizzle ORM umgeschrieben

### Changed — Phase 9b: TypeScript-Bereinigung (Supabase → Drizzle)
- **Vollständige camelCase-Migration:** Alle Komponenten, Actions und Pages verwenden nun durchgängig Drizzle-Typen (camelCase) statt Supabase snake_case-Interfaces.
  - `admin-sidebar.tsx`, `portal/sidebar.tsx` — `Tables<"profiles">` → `User` aus `@/lib/db/schema`; `full_name` → `fullName`
  - `admin-events-list.tsx` — Interface komplett auf camelCase (`startDate`, `endDate`, `maxSeats`, `isPublished`, `eventUrl`); `Attendee.full_name` → `fullName`
  - `admin-news-list.tsx` — `is_published` → `isPublished`, `created_at` → `createdAt`, `profiles.full_name` durch flaches `authorName`-Feld ersetzt
  - `news-editor.tsx` — `is_published` → `isPublished`
  - `admin-wiki-manager.tsx` — `sort_order` → `sortOrder`, `category_id` → `categoryId`, `is_published` → `isPublished`
  - `calendar-grid.tsx` — `start_date` → `startDate`
- **Actions auf camelCase umgestellt:**
  - `lib/actions/events.ts` — Parameter-Typen: `event_url` → `eventUrl`, `start_date` → `startDate`, `end_date` → `endDate`, `max_seats` → `maxSeats`, `is_published` → `isPublished`
  - `lib/actions/news.ts` — `is_published` → `isPublished`
  - `lib/actions/wiki.ts` — `category_id` → `categoryId`, `sort_order` → `sortOrder`, `is_published` → `isPublished`
- **Login-Page:** Self-Service Passwort-Reset entfernt (kein Email-Flow); ersetzte durch statischen Hinweistext "Administrator kontaktieren". Import `resetPassword` und `ArrowLeft` entfernt.
- **dashboard/page.tsx:** Doppeltes `.where()` auf Drizzle-`events`-Query durch `and()` ersetzt.
- **admin/kalender/page.tsx:** `regsByEvent`-Mapping auf `fullName` umgestellt.
- **api/upload/route.ts:** Duplizierter Code-Block entfernt.
- **admin-users-list.test.tsx:** Testdaten auf camelCase (`fullName`, `createdAt`) aktualisiert; `inviteUser`-Mock entfernt.
- `pnpm tsc --noEmit` läuft fehlerfrei.

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
