# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [Unreleased]

### Fixed
- **Login hängt im Rendering:** `redirect()` in der `login` Server Action wurde innerhalb von `useTransition` aufgerufen, was dazu führte, dass der `NEXT_REDIRECT`-Error von React abgefangen wurde und die Transition nie abschloss. Die Action gibt nun `{ redirect: "/dashboard" }` zurück; der Client führt den Redirect via `router.push()` aus.
- **Passwort-Reset-Link zeigt auf falsche URL:** `redirectTo` in `resetPasswordForEmail` verwendete `NEXT_PUBLIC_SUPABASE_URL` (Supabase-API-URL) statt der App-URL. Korrigiert auf `NEXT_PUBLIC_APP_URL` mit Fallback auf `http://localhost:3000`.

### Added
- Umgebungsvariable `NEXT_PUBLIC_APP_URL` in `.env.local` ergänzt.

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
