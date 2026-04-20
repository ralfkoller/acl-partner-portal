import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core"

// ---------------------------------------------------------------------------
// users — ersetzt Supabase auth.users + profiles
// ---------------------------------------------------------------------------
export const users = sqliteTable("users", {
  id:           text("id").primaryKey(),               // nanoid
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName:     text("full_name").notNull(),
  company:      text("company"),
  role:         text("role", { enum: ["admin", "partner"] }).notNull().default("partner"),
  avatarUrl:    text("avatar_url"),
  // Passwort-Reset durch Admin: flag ob User beim nächsten Login neues Passwort setzen muss
  mustChangePassword: integer("must_change_password", { mode: "boolean" }).notNull().default(false),
  createdAt:    text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt:    text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// news
// ---------------------------------------------------------------------------
export const news = sqliteTable("news", {
  id:          text("id").primaryKey(),
  title:       text("title").notNull(),
  content:     text("content").notNull(),             // JSON (Tiptap)
  excerpt:     text("excerpt"),
  coverImage:  text("cover_image"),
  authorId:    text("author_id").references(() => users.id, { onDelete: "set null" }),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at"),
  createdAt:   text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt:   text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// faq_categories
// ---------------------------------------------------------------------------
export const faqCategories = sqliteTable("faq_categories", {
  id:          text("id").primaryKey(),
  name:        text("name").notNull(),
  description: text("description"),
  sortOrder:   integer("sort_order").notNull().default(0),
  createdAt:   text("created_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// faq_items
// ---------------------------------------------------------------------------
export const faqItems = sqliteTable("faq_items", {
  id:          text("id").primaryKey(),
  categoryId:  text("category_id").references(() => faqCategories.id, { onDelete: "cascade" }),
  question:    text("question").notNull(),
  answer:      text("answer").notNull(),              // JSON (Tiptap)
  sortOrder:   integer("sort_order").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  createdAt:   text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt:   text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// events
// ---------------------------------------------------------------------------
export const events = sqliteTable("events", {
  id:          text("id").primaryKey(),
  title:       text("title").notNull(),
  description: text("description"),                   // JSON (Tiptap)
  location:    text("location"),
  eventUrl:    text("event_url"),
  startDate:   text("start_date").notNull(),
  endDate:     text("end_date"),
  maxSeats:    integer("max_seats"),
  createdBy:   text("created_by").references(() => users.id, { onDelete: "set null" }),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  createdAt:   text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt:   text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// event_registrations
// ---------------------------------------------------------------------------
export const eventRegistrations = sqliteTable("event_registrations", {
  id:             text("id").primaryKey(),
  eventId:        text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId:         text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  registeredAt:   text("registered_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// file_categories
// ---------------------------------------------------------------------------
export const fileCategories = sqliteTable("file_categories", {
  id:          text("id").primaryKey(),
  name:        text("name").notNull(),
  description: text("description"),
  sortOrder:   integer("sort_order").notNull().default(0),
  createdAt:   text("created_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// files
// ---------------------------------------------------------------------------
export const files = sqliteTable("files", {
  id:           text("id").primaryKey(),
  name:         text("name").notNull(),
  description:  text("description"),
  categoryId:   text("category_id").references(() => fileCategories.id, { onDelete: "set null" }),
  storagePath:  text("storage_path").notNull(),       // relativ zu public/uploads/
  fileSize:     integer("file_size"),                 // bytes
  mimeType:     text("mime_type"),
  uploadedBy:   text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  isPublished:  integer("is_published", { mode: "boolean" }).notNull().default(false),
  createdAt:    text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt:    text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
})

// ---------------------------------------------------------------------------
// TypeScript-Typen (Drizzle-Inferenz)
// ---------------------------------------------------------------------------
export type User             = typeof users.$inferSelect
export type InsertUser       = typeof users.$inferInsert
export type News             = typeof news.$inferSelect
export type InsertNews       = typeof news.$inferInsert
export type FaqCategory      = typeof faqCategories.$inferSelect
export type FaqItem          = typeof faqItems.$inferSelect
export type InsertFaqItem    = typeof faqItems.$inferInsert
export type Event            = typeof events.$inferSelect
export type InsertEvent      = typeof events.$inferInsert
export type EventRegistration = typeof eventRegistrations.$inferSelect
export type FileCategory     = typeof fileCategories.$inferSelect
export type File             = typeof files.$inferSelect
export type InsertFile       = typeof files.$inferInsert
