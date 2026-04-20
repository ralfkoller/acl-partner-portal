# ACL UI Style Guide

**Version:** 1.0 — März 2026  
**Projekt:** ACL Partner Portal  
**Stack:** Next.js 16 App Router · Tailwind v4 · shadcn/Base UI · Supabase · TypeScript

Dieser Guide dokumentiert alle UI- und Code-Patterns des ACL Partner Portals. Er dient als Referenz beim Aufbau neuer Module innerhalb desselben Design-Systems.

---

## Inhaltsverzeichnis

1. [Grundprinzipien](#1-grundprinzipien)
2. [Design Tokens](#2-design-tokens)
3. [Typographie](#3-typographie)
4. [Layout & Seitenstruktur](#4-layout--seitenstruktur)
5. [Komponenten-Patterns](#5-komponenten-patterns)
6. [Feedback & Notifications](#6-feedback--notifications)
7. [Daten & State Patterns](#7-daten--state-patterns)
8. [Naming & File Conventions](#8-naming--file-conventions)
9. [Dos and Don'ts](#9-dos-and-donts)
10. [Vollständige Templates](#10-vollständige-templates)

---

## 1. Grundprinzipien

### Design-Philosophie

Das ACL Partner Portal folgt drei Kernprinzipien:

- **Brand-first:** ACL Orange (`#F0A844`) ist der einzige Akzent. Kein zweites Primärfarbe. Alle interaktiven Elemente, aktive Zustände und CTAs verwenden diesen Ton.
- **Konsistenz über Flexibilität:** Gleiche Patterns überall. `rounded-xl` für alles. Ein Card-Pattern. Ein Form-Pattern. Kein Freestyle pro Feature.
- **Hierarchie durch Zurückhaltung:** Der dunkle Sidebar (`#444444`) rahmt helle Inhalte ein. Badges, Status-Chips und Highlights setzen Akzente sparsam und gezielt.

### Technologie-Stack

| Layer | Technologie | Hinweis |
|---|---|---|
| Framework | Next.js 16 App Router | Turbopack Dev, Server Components als Default |
| Styling | Tailwind v4 (CSS-first) | Kein `tailwind.config.js` — Tokens in `globals.css` |
| UI-Primitives | shadcn/ui + Base UI | Selektiv genutzt — eigene Patterns bevorzugt |
| Backend | Supabase (PostgreSQL + Auth) | Drei Client-Typen: server, browser, admin |
| Sprache | TypeScript strict | Zod v4 für Schema-Validierung |
| Linting | ESLint (eslint-config-next) | |

---

## 2. Design Tokens

### ACL Brand-Farben

Definiert in `src/app/globals.css` unter `@theme inline`. Kein `tailwind.config.js`.

| Token | CSS Variable | Hex | Verwendung |
|---|---|---|---|
| `acl-orange` | `--color-acl-orange` | `#F0A844` | Primär-Akzent, CTAs, aktive Nav, Borders |
| `acl-orange-hover` | `--color-acl-orange-hover` | `#d99538` | Hover-State für orangefarbene Elemente |
| `acl-orange-light` | `--color-acl-orange-light` | `#F0C282` | Avatar-Hintergründe, sanfte Highlights |
| `acl-dark` | `--color-acl-dark` | `#444444` | Sidebar-BG, primärer Text, Headings |
| `acl-dark-deeper` | `--color-acl-dark-deeper` | `#363636` | Tiefere Dark-Variante |
| `acl-dark-surface` | `--color-acl-dark-surface` | `#3a3a3a` | Hero-Banner Gradient-Mitte |
| `acl-gray` | `--color-acl-gray` | `#A5A5A5` | Sekundärer Text, Labels, Platzhalter |
| `acl-light` | `--color-acl-light` | `#F7F7F8` | Seiten-BG, Input-BG, Tabellen-Header |

### Semantische Inline-Farben

Zusätzlich zu den ACL-Tokens werden Tailwind-Standardfarben für semantische Zustände direkt verwendet:

| Farbe | Verwendung |
|---|---|
| `blue-500 / blue-600` | Events-Akzent, Partner-Rolle |
| `emerald-500 / emerald-600` | Veröffentlicht, Erfolg |
| `red-500 / red-600` | Destructive Actions, Fehler |
| `violet-500 / violet-600` | Angemeldet (Event-Status) |

### shadcn Semantic Tokens (OKLCH)

Diese Tokens steuern shadcn-Primitives und sollten nicht überschrieben werden:

```css
--primary:     oklch(0.205 0 0)          /* near-black */
--muted:       oklch(0.97 0 0)           /* near-white gray */
--destructive: oklch(0.577 0.245 27.325) /* red */
--radius:      0.625rem                  /* base border-radius für shadcn */
```

### Scrollbar

```css
/* globals.css */
::-webkit-scrollbar-thumb { background: #F0A844; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #d99538; }
scrollbar-color: #F0A844 transparent; /* Firefox */
```

---

## 3. Typographie

### Font: Roboto

Geladen via `next/font/google` in `src/app/layout.tsx`:

```tsx
import { Roboto } from "next/font/google"

const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={roboto.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

### Type Scale

| Klasse | Px (approx.) | Verwendung |
|---|---|---|
| `text-[10px]` | 10px | Nav-Section-Labels (`"NAVIGATION"`, `"ADMIN"`) |
| `text-xs` | 12px | Tabellen-Header, Badges, Metadaten, Form-Helpertext |
| `text-sm` | 14px | Body-Text, Nav-Links, Tabellen-Zellen, Form-Labels, Buttons |
| `text-base` | 16px | shadcn CardTitle |
| `text-lg` | 18px | News-Card-Titel |
| `text-xl` | 20px | Section-Header (h2), Error-Subtitel |
| `text-2xl` | 24px | Seiten-Headings (h1 Dashboard, Admin) |
| `text-4xl` | 36px | Login-Branding-Panel (h1) |
| `text-5xl` | 48px | Hero-Banner-Wasserzeichen |
| `text-6xl` | 60px | 404-Seitenzahl |

### Font-Gewichte

| Klasse | Gewicht | Verwendung |
|---|---|---|
| `font-light` | 300 | Selten — dekorativer Subtext |
| `font-normal` | 400 | Body-Text, Beschreibungen |
| `font-medium` | 500 | Labels, Button-Text, Nav-Links, Sub-Headings |
| `font-semibold` | 600 | Card-Titel, Dateinamen |
| `font-bold` | 700 | Seiten-H1, Section-Header, Logo, Stat-Zahlen |

### Farb-Konventionen

- **Headings:** `text-acl-dark` (`#444444`)
- **Body:** `text-acl-dark` oder Tailwind `text-gray-700`
- **Sekundär/Muted:** `text-acl-gray` (`#A5A5A5`)
- **Auf dunklem Hintergrund (Sidebar):** `text-white`, `text-white/70`
- **Links/Akzente:** `text-acl-orange`

---

## 4. Layout & Seitenstruktur

### Route Group Übersicht

```
src/app/
  (auth)/           → Login-Seite — kein persistentes Layout
    layout.tsx      → pass-through (<>{children}</>)
    login/
  (portal)/         → Authentifizierter Partner-Bereich
    layout.tsx      → Auth-Guard + <Sidebar> + <main>
    dashboard/
    dateien/
    kalender/
    wiki/
    profil/
  (admin)/          → Auth-Guard + role="admin" Pflicht
    layout.tsx      → Auth-Guard + Rollen-Check + <AdminSidebar> + <main>
    admin/
      benutzer/
      news/
      dateien/
      kalender/
      wiki/
  layout.tsx        → Root: Roboto-Font, <Toaster />, <TooltipProvider />
  page.tsx          → Redirect → /login oder /dashboard
```

### Standard App-Layout Template

Wird in `(portal)/layout.tsx` und `(admin)/layout.tsx` verwendet:

```tsx
// src/app/(portal)/layout.tsx
import { Sidebar } from "@/components/portal/sidebar"
import { getUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen bg-acl-light">
      <Sidebar user={user} />
      <main className="flex-1 lg:ml-[260px]">
        <div className="animate-fade-in p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### Seiten-Heading Template

Jede Seite beginnt mit einem konsistenten Heading-Block:

```tsx
<div className="mb-8">
  <h1 className="text-2xl font-bold text-acl-dark">Seitentitel</h1>
  <p className="text-acl-gray mt-1">Kurze Beschreibung was diese Seite zeigt</p>
</div>
```

### Login Split-Screen Template

```tsx
<div className="flex min-h-screen">
  {/* Links: Branding-Panel */}
  <div className="hidden lg:flex lg:w-1/2 bg-acl-dark flex-col items-center justify-center relative overflow-hidden">
    {/* SVG-Hintergrundmuster, Logo, Tagline */}
  </div>

  {/* Rechts: Formular */}
  <div className="flex-1 flex items-center justify-center p-8 bg-white">
    <div className="w-full max-w-md">
      {/* Form-Inhalt */}
    </div>
  </div>
</div>
```

### Sidebar-Anatomie

Gilt für beide Sidebars (`Sidebar` und `AdminSidebar`) — identische Struktur:

```
aside.fixed.inset-y-0.left-0.z-50.w-[260px].bg-acl-dark
  ├── div.absolute.left-0.top-0.bottom-0.w-[3px].bg-acl-orange   ← orangener Akzent-Streifen
  ├── Logo-Sektion  (px-5 py-6)
  ├── nav.flex-1.overflow-y-auto.px-3.py-4
  │   ├── Section-Label  text-[10px] font-medium uppercase tracking-wider text-acl-gray/60
  │   └── NavLink       rounded-xl px-3 py-2.5  [aktiv: gradient-orange | inaktiv: text-white/70]
  └── Profil-Footer  (border-t border-white/10, px-3 py-4)
      ├── Avatar  w-9 h-9 rounded-full bg-acl-orange-light
      ├── Name + Unternehmen
      └── Logout-Button  (form action={logout})
```

**Aktiver Nav-Link:**

```tsx
const linkClass = isActive
  ? "bg-gradient-to-r from-acl-orange to-acl-orange-hover text-white shadow-[0_2px_8px_rgba(240,168,68,0.3)]"
  : "text-white/70 hover:bg-white/[0.08] hover:text-white"

<Link
  href={href}
  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${linkClass}`}
>
  <Icon className="w-4 h-4 flex-shrink-0" />
  {label}
</Link>
```

---

## 5. Komponenten-Patterns

### 5.1 Buttons

Das Projekt bevorzugt **raw `<button>` Elemente mit Tailwind-Klassen** gegenüber dem shadcn `Button`-Primitive — außer in Error-Boundaries und statischen Seiten.

#### Primary CTA (orange, full-width)

```tsx
<button
  type="submit"
  disabled={isPending}
  className="w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isPending ? "Wird geladen..." : "Aktion ausführen"}
</button>
```

#### Primary CTA (inline, mit Icon)

```tsx
<button
  onClick={handleAction}
  className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
>
  <PlusCircle className="w-4 h-4" /> Neuen Eintrag erstellen
</button>
```

#### Secondary (weiß/Outline)

```tsx
<button
  onClick={handleAction}
  className="flex items-center gap-2 py-2.5 px-5 bg-white hover:bg-acl-light border border-gray-200 text-acl-dark text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
>
  <Upload className="w-4 h-4" /> Exportieren
</button>
```

#### Ghost / Text-Link

```tsx
{/* Orange */}
<button className="text-sm text-acl-orange hover:text-acl-orange-hover transition-colors">
  Passwort vergessen?
</button>

{/* Grau */}
<button className="text-sm text-acl-gray hover:text-acl-dark transition-colors">
  Abbrechen
</button>
```

#### Icon-Action (Tabellen-Zeilen)

```tsx
{/* Neutral → Orange on hover */}
<button className="p-1.5 rounded-lg text-acl-gray hover:text-acl-orange hover:bg-acl-orange/10 transition-colors">
  <Pencil className="w-4 h-4" />
</button>

{/* Neutral → Rot on hover (Löschen) */}
<button className="p-1.5 rounded-lg text-acl-gray hover:text-red-500 hover:bg-red-500/10 transition-colors">
  <Trash2 className="w-4 h-4" />
</button>
```

#### Wann shadcn `Button` verwenden?

Nur in: `error.tsx`, `not-found.tsx` — d.h. Seiten ohne eigenes Layout und ohne interaktive Forms.

```tsx
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

<Button className="bg-acl-orange hover:bg-acl-orange/90 text-white rounded-xl gap-2" onClick={reset}>
  <RefreshCw className="w-4 h-4" /> Erneut versuchen
</Button>

<Button className={cn(buttonVariants({ variant: "outline" }), "rounded-xl gap-2")} asChild>
  <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /> Zurück</Link>
</Button>
```

---

### 5.2 Cards

Das Projekt verwendet **keine shadcn `Card`-Komponente** für Content-Cards. Stattdessen ein direktes `<div>`-Pattern.

#### Base Card

```tsx
<div className="bg-white rounded-xl p-6 border border-gray-100/80 card-hover">
  {/* Inhalt */}
</div>
```

#### Card mit Accent-Border (links)

Für Cards die einen farblichen Typ-Indikator benötigen (News, Events, Stats):

```tsx
<div
  className="bg-white rounded-xl p-6 border border-gray-100/80 card-hover"
  style={{ borderLeft: "4px solid #F0A844" }}  // oder beliebige semantische Farbe
>
  {/* Inhalt */}
</div>
```

#### Table-Container Card

```tsx
<div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden">
  <table className="w-full">
    {/* ... */}
  </table>
</div>
```

#### `.card-hover` CSS-Utility

Definiert in `src/app/globals.css`:

```css
.card-hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}
```

Immer zusammen mit `border border-gray-100/80` verwenden — ohne Border wirkt der Hover-Effekt zu abrupt.

---

### 5.3 Inputs & Forms

#### INPUT_CLASS Konstante

Diese Konstante wird in jeder Form-Komponente oben definiert:

```tsx
const INPUT_CLASS =
  "rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
```

Varianten:

```tsx
// Mit Icon links (z.B. Suchfeld)
"pl-10 rounded-xl bg-white border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"

// Mit Button rechts (z.B. Passwort-Toggle)
`pr-11 ${INPUT_CLASS}`

// Read-only / deaktiviert
"rounded-xl bg-acl-light/30 border-gray-200 text-acl-gray cursor-not-allowed"
```

#### Form-Feld Anatomie

Ein Formularfeld besteht immer aus `space-y-2` + `Label` + `Input`:

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label className="text-sm font-medium text-acl-dark">
    Feldname <span className="text-acl-gray font-normal">(optional)</span>
  </Label>
  <Input
    name="field_name"
    placeholder="Platzhalter"
    required
    className={INPUT_CLASS}
  />
</div>
```

#### Formular-Stack

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label className="text-sm font-medium text-acl-dark">Name</Label>
    <Input name="full_name" required className={INPUT_CLASS} />
  </div>

  <div className="space-y-2">
    <Label className="text-sm font-medium text-acl-dark">E-Mail</Label>
    <Input name="email" type="email" required className={INPUT_CLASS} />
  </div>

  <button type="submit" disabled={isPending} className={SUBMIT_CLASS}>
    {isPending ? "Wird gespeichert..." : "Speichern"}
  </button>
</form>
```

#### Passwort-Feld mit Toggle

```tsx
const [showPassword, setShowPassword] = useState(false)

<div className="space-y-2">
  <Label className="text-sm font-medium text-acl-dark">Passwort</Label>
  <div className="relative">
    <Input
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="Mindestens 8 Zeichen"
      minLength={8}
      required
      className={`pr-11 ${INPUT_CLASS}`}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-acl-gray hover:text-acl-dark transition-colors"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>
```

#### Inline-Fehler und Erfolg

Für kritische Formulare (Login, Passwort-Reset) — kein Toast, sondern Inline-Feedback:

```tsx
{error && (
  <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">
    {error}
  </div>
)}

{successMessage && (
  <div className="bg-emerald-50 text-emerald-600 text-sm rounded-xl p-3 border border-emerald-200">
    {successMessage}
  </div>
)}
```

#### Select-Feld

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<div className="space-y-2">
  <Label className="text-sm font-medium text-acl-dark">Rolle</Label>
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger className="rounded-xl">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="partner">Partner</SelectItem>
      <SelectItem value="admin">Admin</SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

### 5.4 Badges / Status Chips

Keine shadcn `Badge`-Komponente — eigenes Inline-Pattern:

```tsx
{/* Orange — Admin-Rolle, Entwurf */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-acl-orange/10 text-acl-orange">
  <Shield className="w-3 h-3" /> Admin
</span>

{/* Blau — Partner-Rolle */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600">
  <User className="w-3 h-3" /> Partner
</span>

{/* Grün — Veröffentlicht, Erfolg */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600">
  <CheckCircle className="w-3 h-3" /> Veröffentlicht
</span>

{/* Grau — Entwurf, inaktiv */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-acl-gray">
  Entwurf
</span>

{/* Rot — Fehler, gesperrt */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-600">
  Gesperrt
</span>
```

---

### 5.5 Section Header

Das `SectionHeader`-Komponenten-Pattern mit orangenem Akzentstreifen:

```tsx
// src/components/portal/section-header.tsx
interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="w-[3px] h-6 rounded-full bg-acl-orange mr-3" />
        <h2 className="text-xl font-bold text-acl-dark">{title}</h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
```

Verwendung:

```tsx
<SectionHeader
  title="Aktuelle News"
  action={
    <button onClick={...} className="text-sm text-acl-orange hover:text-acl-orange-hover">
      Alle anzeigen
    </button>
  }
/>
```

---

### 5.6 Tabellen

Das Projekt verwendet **kein shadcn `Table`** — raw `<table>` mit konsistenten Klassen:

```tsx
<div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="border-b border-gray-100 bg-acl-light/30">
        <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">
          Spaltenname
        </th>
        {/* weitere Spalten */}
        <th className="text-right text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">
          Aktionen
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {items.map((item) => (
        <tr key={item.id} className="hover:bg-acl-light/30 transition-colors">
          <td className="px-6 py-4 text-sm text-acl-dark">{item.name}</td>
          {/* weitere Zellen */}
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-1">
              <button className="p-1.5 rounded-lg text-acl-gray hover:text-acl-orange hover:bg-acl-orange/10 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-acl-gray hover:text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
      {items.length === 0 && (
        <tr>
          <td colSpan={99} className="px-6 py-8 text-center text-sm text-acl-gray">
            Keine Einträge gefunden.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
```

---

### 5.7 Dialoge

Dialoge nutzen das shadcn `Dialog`-Primitive (basiert auf Base UI):

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); resetForm() } }}>
  <DialogContent className="rounded-xl sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-acl-dark">Dialog-Titel</DialogTitle>
    </DialogHeader>

    {/* Inhalt */}
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Felder */}
      <button type="submit" disabled={isPending} className={SUBMIT_CLASS}>
        {isPending ? "Wird gespeichert..." : "Speichern"}
      </button>
    </form>
  </DialogContent>
</Dialog>
```

#### Dialog mit Tab-Navigation

Für Dialoge mit mehreren Aktionen (z.B. Erstellen / Einladen):

```tsx
{/* Custom Tab-Bar — kein shadcn Tabs */}
<div className="flex rounded-xl bg-acl-light p-1 mb-2">
  {["create", "invite"].map((tab) => (
    <button
      key={tab}
      type="button"
      onClick={() => setActiveTab(tab as typeof activeTab)}
      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
        activeTab === tab
          ? "bg-white text-acl-dark shadow-sm"
          : "text-acl-gray hover:text-acl-dark"
      }`}
    >
      {tab === "create" ? "Erstellen" : "Einladen"}
    </button>
  ))}
</div>
```

#### Confirm Dialog

Für destruktive Aktionen (Löschen, Rollen-Änderung):

```tsx
// src/components/admin/confirm-dialog.tsx
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  isPending?: boolean
  variant?: "danger" | "warning"
}
```

---

### 5.8 Suchfeld mit Icon

```tsx
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
  <Input
    placeholder="Suchen..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-10 w-64 rounded-xl bg-white border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
  />
</div>
```

---

## 6. Feedback & Notifications

### Toasts (Mutations-Feedback)

`sonner` wird für alle CRUD-Operationen verwendet. Konfiguration in `src/app/layout.tsx`:

```tsx
import { Toaster } from "@/components/ui/sonner"

// In Root Layout:
<Toaster position="top-right" richColors closeButton />
```

Verwendung in Client-Komponenten:

```tsx
import { toast } from "sonner"

// Erfolg
toast.success("Eintrag wurde gespeichert.")

// Fehler
toast.error("Fehler beim Speichern: Bitte erneut versuchen.")

// Info (selten)
toast.info("Einladung wurde gesendet.")
```

**Regel:** Toasts für Mutation-Feedback. Inline-Errors für Formular-Validierungsfehler (Login, Passwort-Reset).

---

### Loading States (Skeleton)

Jede Route hat eine `loading.tsx` mit Skeletons die die genaue Seiten-Struktur spiegeln:

```tsx
// src/app/(portal)/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="animate-fade-in">
      {/* Heading Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-xl mt-2" />
      </div>

      {/* Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl border-l-4 border-l-acl-orange" />
        ))}
      </div>
    </div>
  )
}
```

**Regel:** Skeletons spiegeln die exakte Layout-Struktur der echten Seite (gleiche Grid-Spalten, gleiche Card-Höhen). `border-l-4 border-l-acl-orange` bei Card-Skeletons.

---

### Error Boundaries

```tsx
// src/app/(portal)/error.tsx
"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error("[Portal Error]", error) }, [error])

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-acl-dark mb-2">Etwas ist schiefgelaufen</h2>
      <p className="text-acl-gray mb-6 max-w-sm">
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-acl-gray/60 mb-6">Fehler-ID: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <Button
          className="bg-acl-orange hover:bg-acl-orange/90 text-white rounded-xl gap-2"
          onClick={reset}
        >
          <RefreshCw className="w-4 h-4" /> Erneut versuchen
        </Button>
        <Button variant="outline" className="rounded-xl gap-2" asChild>
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4" /> Zurück</Link>
        </Button>
      </div>
    </div>
  )
}
```

---

## 7. Daten & State Patterns

### Server Component Data Fetching

Alle `page.tsx`-Dateien sind `async` Server Components. Daten werden direkt via Supabase geladen:

```tsx
// src/app/(portal)/dashboard/page.tsx
import { createClient, getUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const supabase = await createClient()

  // Paralleles Laden für bessere Performance
  const [filesResult, eventsResult, newsResult] = await Promise.all([
    supabase.from("files").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5),
  ])

  return <DashboardClient user={user} news={newsResult.data ?? []} />
}
```

**Regel:** Datenabruf immer parallel mit `Promise.all()`. Niemals sequenziell `await` wenn die Queries unabhängig sind.

---

### Server Action Architektur

Alle Server Actions liegen in `src/lib/actions/` — ein File pro Domain.

```ts
// src/lib/actions/news.ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { newsSchema } from "@/lib/schemas/news"
import { z } from "zod/v4"  // ← WICHTIG: zod/v4, nicht zod

export async function createNews(formData: FormData) {
  // 1. Daten aus FormData extrahieren
  const raw = {
    title: formData.get("title") as string,
    content: JSON.parse(formData.get("content") as string),
    excerpt: formData.get("excerpt") as string || undefined,
    is_published: formData.get("is_published") === "true",
  }

  // 2. Zod-Validierung (Best Practice — immer ausführen)
  const parsed = newsSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 3. Supabase-Mutation
  const supabase = await createClient()
  const { error } = await supabase.from("news").insert(parsed.data)
  if (error) return { error: error.message }

  // 4. Cache invalidieren
  revalidatePath("/admin/news")
  revalidatePath("/dashboard")

  return { success: true }
}
```

#### Return Contract

Jede Server Action gibt einen dieser Typen zurück — **niemals throw**:

```ts
// Fehler
return { error: "Fehlermeldung als String" }

// Erfolg (Mutation)
return { success: true }

// Erfolg mit Daten
return { data: { id: "..." } }

// Redirect (nur bei Auth-Actions)
return { redirect: "/dashboard" }
return { success: "Bestätigungstext der dem User angezeigt wird" }
```

---

### Client Mutation Pattern

Alle Client-seitigen Form-Submissions verwenden `useTransition`:

```tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createNews } from "@/lib/actions/news"

export function NewsForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createNews(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Artikel wurde gespeichert.")
        router.refresh()  // Server Component neu rendern
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Felder */}
      <button type="submit" disabled={isPending} className={SUBMIT_CLASS}>
        {isPending ? "Wird gespeichert..." : "Speichern"}
      </button>
    </form>
  )
}
```

**Regeln:**
- `useTransition` statt `useState` für `loading` — verhindert den `NEXT_REDIRECT`-Bug
- `router.refresh()` nach Client-Mutations (kein `router.push()` außer bei Redirects)
- `revalidatePath()` in Server Actions für Server-Component-Cache

---

### Zod-Validierung in Server Actions (Best Practice)

**Schemas immer zur Laufzeit in Server Actions ausführen** — nicht nur für TypeScript-Typen:

```ts
// ✅ RICHTIG: safeParse in der Action
const parsed = mySchema.safeParse(Object.fromEntries(formData))
if (!parsed.success) {
  return { error: parsed.error.issues[0].message }
}
// parsed.data ist jetzt vollständig typisiert

// ❌ FALSCH: nur formData.get() ohne Validierung
const title = formData.get("title") as string  // kein type-safety zur Laufzeit
```

```ts
// Zod v4 Import-Pfad (WICHTIG — nicht "zod", sondern "zod/v4")
import { z } from "zod/v4"
```

---

### Supabase Client-Auswahl

| Client | Import | Wann |
|---|---|---|
| Server | `import { createClient } from "@/lib/supabase/server"` | Server Components, Server Actions, proxy.ts |
| Browser | `import { createClient } from "@/lib/supabase/client"` | Client Components mit direkten DB-Mutations (kein Server Action) |
| Admin | `import { createAdminClient } from "@/lib/supabase/admin"` | Nur Server Actions die Service Role brauchen (User-Anlage, Invite) |

```ts
// Server (async — wegen cookies())
const supabase = await createClient()

// Browser (sync)
const supabase = createClient()

// Admin (sync — kein Session-Handling)
const adminClient = createAdminClient()
```

**Achtung:** Den Admin-Client niemals im Browser verwenden. `SUPABASE_SERVICE_ROLE_KEY` darf nie im Client-Bundle landen.

---

### Error Logging in Server Actions

```ts
// Strukturiertes Format mit Funktionsname als Prefix
console.error("[createNews] Supabase error:", error.message)
console.error("[getUser] Profile query error:", profileError.message, profileError.code)
```

---

## 8. Naming & File Conventions

### Datei-Naming

| Typ | Konvention | Beispiel |
|---|---|---|
| Komponenten | `kebab-case.tsx` | `admin-users-list.tsx`, `news-card.tsx` |
| Actions | `kebab-case.ts` (1 File pro Domain) | `auth.ts`, `news.ts`, `users.ts` |
| Schemas | `kebab-case.ts` (1 File pro Domain) | `auth.ts`, `news.ts` |
| Next.js Specials | lowercase (required) | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` |
| Tests | `<name>.test.ts(x)` | `auth.test.ts`, `admin-users-list.test.tsx` |
| E2E | `<name>.spec.ts` | `login.spec.ts`, `admin-users.spec.ts` |

**Keine PascalCase-Dateinamen.** Nur Next.js-eigene Dateien sind in camelCase (`globals.css`).

---

### Komponenten-Exports

```tsx
// ✅ RICHTIG: Named export
export function AdminUsersList({ users }: { users: UserProfile[] }) { ... }
export function NewsCard({ news }: NewsCardProps) { ... }

// ✅ RICHTIG: Default export nur für Next.js Special Files
export default function DashboardPage() { ... }
export default function RootLayout({ children }) { ... }

// ❌ FALSCH: Default export für normale Komponenten
export default function AdminUsersList(...) { ... }
```

---

### TypeScript Interfaces vs. Types

```ts
// interface für Komponenten-Props
interface AdminUsersListProps {
  users: UserProfile[]
}

// type für Zod-Inference
export type NewsFormData = z.infer<typeof newsSchema>

// type für Union-Typen
type ActionResult = { error: string } | { success: true }
```

---

### Action File Struktur

```ts
// src/lib/actions/[domain].ts
"use server"                              // ← immer erste Zeile

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { domainSchema } from "@/lib/schemas/[domain]"

// Named exports, alphabetisch nach CRUD-Reihenfolge:
export async function create[Entity](formData: FormData) { ... }
export async function get[Entities]() { ... }
export async function update[Entity](...) { ... }
export async function delete[Entity](id: string) { ... }
```

---

### Schema File Struktur

```ts
// src/lib/schemas/[domain].ts
import { z } from "zod/v4"           // ← zod/v4, nicht "zod"

export const entitySchema = z.object({
  field: z.string().min(1, "Fehlermeldung auf Deutsch"),
  // ...
})

// Fehlermeldungen immer auf Deutsch
export type EntityFormData = z.infer<typeof entitySchema>
```

---

## 9. Dos and Don'ts

### ✅ Tun

- `rounded-xl` als Standard-Radius für alles (Buttons, Cards, Inputs, Dialoge)
- `card-hover` + `border border-gray-100/80` immer zusammen verwenden
- `acl-orange` als einzigen Primär-Akzent einsetzen
- `useTransition` für alle async Form-Submissions
- Server Actions immer mit `{ error }` | `{ success }` return contract
- Zod `safeParse()` in Server Actions ausführen — nicht nur für TypeScript-Typen
- `Promise.all()` für parallele Supabase-Queries in Server Components
- `revalidatePath()` in Server Actions, `router.refresh()` in Client-Mutations
- `toast.error()` für Mutation-Fehler, Inline-Error für Login/kritische Formulare
- Named exports für alle Komponenten
- Kebab-case für alle Dateinamen
- Zod immer via `"zod/v4"` importieren

### ❌ Nicht tun

- **shadcn `Card`** für Content-Cards verwenden — eigenes `bg-white rounded-xl border border-gray-100/80` verwenden
- **shadcn `Badge`** verwenden — eigenes Inline-Badge-Pattern verwenden
- **shadcn `Table`** verwenden — raw `<table>` mit konsistenten Klassen
- **shadcn `Button`** in Forms/interaktiven Komponenten — nur in Error Boundaries
- **shadcn `Tabs`** für Tab-Navigation in Dialogen — eigenes `bg-acl-light rounded-xl` Pill-Pattern
- `react-hook-form` — nicht im Projekt, `useTransition` + `FormData` ist der Standard
- `redirect()` innerhalb von `useTransition` — wirft NEXT_REDIRECT der von React abgefangen wird; stattdessen `{ redirect: "/pfad" }` zurückgeben und client-seitig `router.push()` aufrufen
- Default-Exports für Komponenten
- PascalCase-Dateinamen
- `await supabase.auth.getSession()` — immer `getUser()` verwenden (sicherer)
- Admin-Client im Browser verwenden
- `import { z } from "zod"` — der korrekte Pfad für Zod v4 ist `"zod/v4"`

---

## 10. Vollständige Templates

### Template A: Neue Admin-Listenseite

```tsx
// src/app/(admin)/admin/[entity]/page.tsx
import { createClient, getUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EntityList } from "@/components/admin/entity-list"

export default async function EntityPage() {
  const user = await getUser()
  if (!user) redirect("/login")

  const supabase = await createClient()
  const { data: items, error } = await supabase
    .from("entities")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-acl-dark">Entitäten</h1>
        <p className="text-acl-gray mt-1">Alle Einträge verwalten</p>
      </div>
      <EntityList items={items ?? []} />
    </div>
  )
}
```

---

### Template B: Client-Komponente mit CRUD-Formular (Dialog)

```tsx
// src/components/admin/entity-list.tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createEntity, deleteEntity } from "@/lib/actions/entities"

const INPUT_CLASS =
  "rounded-xl bg-acl-light/50 border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
const SUBMIT_CLASS =
  "w-full py-3 px-6 bg-acl-orange hover:bg-acl-orange-hover text-white font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"

interface Entity {
  id: string
  name: string
  created_at: string
}

export function EntityList({ items }: { items: Entity[] }) {
  const [search, setSearch] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createEntity(formData)
      if (result.error) toast.error(result.error)
      else {
        toast.success("Eintrag wurde erstellt.")
        setShowDialog(false)
        router.refresh()
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteEntity(id)
      if (result.error) toast.error(result.error)
      else {
        toast.success("Eintrag wurde gelöscht.")
        setDeleteId(null)
        router.refresh()
      }
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-acl-gray" />
          <Input
            placeholder="Suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-64 rounded-xl bg-white border-gray-200 focus:border-acl-orange focus:ring-2 focus:ring-acl-orange/20"
          />
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 py-2.5 px-5 bg-acl-orange hover:bg-acl-orange-hover text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Neu erstellen
        </button>
      </div>

      {/* Tabelle */}
      <div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-acl-light/30">
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">
                Name
              </th>
              <th className="text-left text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">
                Erstellt
              </th>
              <th className="text-right text-xs font-medium text-acl-gray uppercase tracking-wider px-6 py-3">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-acl-light/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-acl-dark">{item.name}</td>
                <td className="px-6 py-4 text-sm text-acl-gray">
                  {new Date(item.created_at).toLocaleDateString("de-AT")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg text-acl-gray hover:text-acl-orange hover:bg-acl-orange/10 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-acl-gray hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-acl-gray">
                  Keine Einträge gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}
      <Dialog open={showDialog} onOpenChange={(o) => !o && setShowDialog(false)}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-acl-dark">Neuen Eintrag erstellen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-acl-dark">Name</Label>
              <Input name="name" placeholder="Bezeichnung" required className={INPUT_CLASS} />
            </div>
            <button type="submit" disabled={isPending} className={SUBMIT_CLASS}>
              {isPending ? "Wird erstellt..." : "Erstellen"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

### Template C: Server Action mit Zod-Validierung

```ts
// src/lib/actions/entities.ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod/v4"

const entitySchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(200),
})

export async function createEntity(formData: FormData) {
  const parsed = entitySchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("entities").insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath("/admin/entities")
  return { success: true }
}

export async function deleteEntity(id: string) {
  if (!id) return { error: "Ungültige ID" }

  const supabase = await createClient()
  const { error } = await supabase.from("entities").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/entities")
  return { success: true }
}
```

---

### Template D: Loading Skeleton

```tsx
// src/app/(admin)/admin/[entity]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-xl mt-2" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100/80 overflow-hidden">
        <div className="border-b border-gray-100 bg-acl-light/30 px-6 py-3">
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center px-6 py-4 border-b border-gray-100 last:border-0">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-24 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
```
