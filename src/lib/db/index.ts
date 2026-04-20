import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import path from "path"
import * as schema from "./schema"

const DB_PATH = process.env.DATABASE_URL
  ? path.resolve(process.env.DATABASE_URL)
  : path.resolve(process.cwd(), "data", "portal.db")

// Singleton-Pattern — verhindert mehrere Verbindungen in Next.js Dev (HMR)
const globalForDb = globalThis as unknown as { _db?: ReturnType<typeof drizzle> }

export const db = globalForDb._db ?? drizzle(new Database(DB_PATH), { schema })

if (process.env.NODE_ENV !== "production") {
  globalForDb._db = db
}

export { schema }
