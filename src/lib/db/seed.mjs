#!/usr/bin/env node
/**
 * Seed-Script: Legt die Datenbank an, wendet Migrationen an und
 * erstellt einen initialen Admin-User.
 *
 * Ausführen: node src/lib/db/seed.mjs
 *
 * Env-Variablen (optional):
 *   DATABASE_URL   — Pfad zur SQLite-Datei (default: ./data/portal.db)
 *   ADMIN_EMAIL    — E-Mail des initialen Admins (default: admin@acl.at)
 *   ADMIN_PASSWORD — Passwort des initialen Admins (default: Admin1234!)
 *   ADMIN_NAME     — Name des initialen Admins (default: ACL Admin)
 */

import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "../../..")

const DB_PATH  = process.env.DATABASE_URL
  ? path.resolve(process.env.DATABASE_URL)
  : path.join(ROOT, "data", "portal.db")

const MIGRATIONS_DIR = path.join(__dirname, "migrations")

// Sicherstellen dass data/ existiert
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

console.log(`📁 Datenbank: ${DB_PATH}`)
console.log(`📂 Migrationen: ${MIGRATIONS_DIR}`)

const sqlite = new Database(DB_PATH)
const db     = drizzle(sqlite)

// Migrationen anwenden
console.log("⚡ Migrationen anwenden...")
migrate(db, { migrationsFolder: MIGRATIONS_DIR })
console.log("✅ Migrationen OK")

// Admin-User anlegen (idempotent — überspringen wenn schon vorhanden)
const email    = process.env.ADMIN_EMAIL    ?? "admin@acl.at"
const password = process.env.ADMIN_PASSWORD ?? "Admin1234!"
const name     = process.env.ADMIN_NAME     ?? "ACL Admin"

const existing = sqlite.prepare("SELECT id FROM users WHERE email = ?").get(email)
if (existing) {
  console.log(`ℹ️  Admin-User "${email}" existiert bereits — übersprungen.`)
} else {
  const passwordHash = bcrypt.hashSync(password, 12)
  const id = nanoid()
  const now = new Date().toISOString()

  sqlite.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'admin', ?, ?)
  `).run(id, email, passwordHash, name, now, now)

  console.log(`✅ Admin-User angelegt:`)
  console.log(`   E-Mail:   ${email}`)
  console.log(`   Passwort: ${password}`)
  console.log(`   ⚠️  Passwort nach erstem Login ändern!`)
}

sqlite.close()
console.log("🎉 Seed abgeschlossen.")
