-- =============================================================
-- ACL Partner Portal — Seed Data
-- Apply AFTER 00001_initial_schema.sql
-- NOTE: Auth users must be created via Supabase Auth first.
--       The profile trigger auto-creates profiles entries.
--       This seed assumes two auth users already exist:
--         admin@acl.at  (UUID placeholder: 00000000-0000-0000-0000-000000000001)
--         partner@acl.at (UUID placeholder: 00000000-0000-0000-0000-000000000002)
--       Replace UUIDs with actual auth.users IDs after creation.
-- =============================================================

-- ─── Profiles (upsert to set role + details) ─────────────────
INSERT INTO profiles (id, full_name, company, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Anna Müller', 'ACL advanced commerce labs GmbH', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Max Partner', 'Digitalagentur Wien GmbH', 'partner')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company = EXCLUDED.company,
  role = EXCLUDED.role;

-- ─── File Categories ─────────────────────────────────────────
INSERT INTO file_categories (id, name, description, sort_order) VALUES
  ('fc000000-0000-0000-0000-000000000001', 'Produktdokumentation', 'Technische Dokumentation und API-Referenzen', 1),
  ('fc000000-0000-0000-0000-000000000002', 'Marketing-Material', 'Logos, Bilder, Präsentationen', 2),
  ('fc000000-0000-0000-0000-000000000003', 'Verträge & Rechtliches', 'NDAs, Partnerverträge, AGBs', 3),
  ('fc000000-0000-0000-0000-000000000004', 'Schulungen', 'Onboarding-Material und Tutorials', 4);

-- ─── Files (storage_path is placeholder — upload real files via UI) ──
INSERT INTO files (id, name, description, category_id, storage_path, file_size, mime_type, uploaded_by, is_published) VALUES
  ('fi000000-0000-0000-0000-000000000001', 'ACL Platform API v2.4.pdf', 'Aktuelle API-Dokumentation mit allen Endpunkten', 'fc000000-0000-0000-0000-000000000001', 'portal-files/api-docs-v2.4.pdf', 2450000, 'application/pdf', '00000000-0000-0000-0000-000000000001', true),
  ('fi000000-0000-0000-0000-000000000002', 'Partner-Onboarding-Guide.pdf', 'Schritt-für-Schritt Anleitung für neue Partner', 'fc000000-0000-0000-0000-000000000004', 'portal-files/onboarding-guide.pdf', 1800000, 'application/pdf', '00000000-0000-0000-0000-000000000001', true),
  ('fi000000-0000-0000-0000-000000000003', 'ACL Logo Pack.zip', 'Logos in verschiedenen Formaten (SVG, PNG, EPS)', 'fc000000-0000-0000-0000-000000000002', 'portal-files/acl-logo-pack.zip', 5200000, 'application/zip', '00000000-0000-0000-0000-000000000001', true),
  ('fi000000-0000-0000-0000-000000000004', 'Partnervertrag-Vorlage.docx', 'Standard-Partnervertrag (aktualisiert Q1 2026)', 'fc000000-0000-0000-0000-000000000003', 'portal-files/partnervertrag-vorlage.docx', 340000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '00000000-0000-0000-0000-000000000001', true),
  ('fi000000-0000-0000-0000-000000000005', 'Integration-Checkliste.xlsx', 'Checkliste für technische Integrationen', 'fc000000-0000-0000-0000-000000000001', 'portal-files/integration-checkliste.xlsx', 85000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '00000000-0000-0000-0000-000000000001', true),
  ('fi000000-0000-0000-0000-000000000006', 'Produkt-Roadmap Q2-2026.pptx', 'Roadmap-Präsentation für Partner-Meeting', 'fc000000-0000-0000-0000-000000000002', 'portal-files/roadmap-q2-2026.pptx', 4100000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '00000000-0000-0000-0000-000000000001', false);

-- ─── News ────────────────────────────────────────────────────
INSERT INTO news (id, title, content, excerpt, author_id, is_published, published_at) VALUES
  ('nw000000-0000-0000-0000-000000000001',
   'ACL Platform v2.4 Release',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wir freuen uns, die Version 2.4 unserer Commerce-Plattform anzukündigen. Zu den wichtigsten Neuerungen gehören:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Verbessertes Checkout-Erlebnis mit One-Click-Purchase"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Neue Headless-API-Endpunkte für PIM-Integration"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Performance-Optimierungen (30% schnellere Seitenladezeiten)"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Die vollständige Dokumentation finden Sie im Bereich Dateien."}]}]}',
   'Version 2.4 bringt One-Click-Purchase, neue PIM-APIs und 30% schnellere Ladezeiten.',
   '00000000-0000-0000-0000-000000000001',
   true,
   NOW() - INTERVAL '2 days'),

  ('nw000000-0000-0000-0000-000000000002',
   'Partner-Programm: Neue Zertifizierungsstufen',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Ab Q2 2026 führen wir drei neue Zertifizierungsstufen ein: Bronze, Silver und Gold. Jede Stufe bietet exklusive Vorteile:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Bronze"},{"type":"text","text":" — Zugang zu Basis-API, Community-Support"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Silver"},{"type":"text","text":" — Erweiterte APIs, Priority-Support, Co-Marketing"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Gold"},{"type":"text","text":" — Dedicated Account Manager, Early Access, Revenue Share"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Sprechen Sie Ihren Account Manager an, um Ihre aktuelle Einstufung zu erfahren."}]}]}',
   'Neue Bronze/Silver/Gold-Zertifizierungen mit exklusiven Partner-Vorteilen ab Q2 2026.',
   '00000000-0000-0000-0000-000000000001',
   true,
   NOW() - INTERVAL '5 days'),

  ('nw000000-0000-0000-0000-000000000003',
   'Wartungsfenster: 12. April 2026',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Am 12. April 2026 zwischen 02:00 und 06:00 Uhr (CET) wird eine planmäßige Wartung durchgeführt. Während dieser Zeit kann es zu kurzzeitigen Unterbrechungen kommen."}]},{"type":"paragraph","content":[{"type":"text","text":"Bitte planen Sie entsprechend und informieren Sie Ihre Kunden."}]}]}',
   'Planmäßige Wartung am 12. April 2026, 02:00–06:00 Uhr (CET).',
   '00000000-0000-0000-0000-000000000001',
   true,
   NOW() - INTERVAL '1 day'),

  ('nw000000-0000-0000-0000-000000000004',
   'Neuer Partner: Digitalagentur Wien GmbH',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Wir begrüßen die Digitalagentur Wien GmbH als neuen Silver-Partner im ACL-Ökosystem. Das Team bringt über 10 Jahre Erfahrung im E-Commerce-Bereich mit."}]}]}',
   'Willkommen Digitalagentur Wien GmbH als neuer Silver-Partner.',
   '00000000-0000-0000-0000-000000000001',
   false,
   NULL);

-- ─── Events ──────────────────────────────────────────────────
INSERT INTO events (id, title, description, location, event_url, start_date, end_date, max_seats, created_by, is_published) VALUES
  ('ev000000-0000-0000-0000-000000000001',
   'Partner Kickoff Q2 2026',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Quartalsweiser Kickoff mit allen Partnern. Agenda: Roadmap-Update, neue Features, offene Diskussion."}]}]}',
   'ACL Office Wien, Mariahilfer Straße 45',
   NULL,
   '2026-04-15 10:00:00+02',
   '2026-04-15 16:00:00+02',
   30,
   '00000000-0000-0000-0000-000000000001',
   true),

  ('ev000000-0000-0000-0000-000000000002',
   'API Workshop: Headless Commerce',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hands-on Workshop zur Nutzung der neuen Headless-API. Bitte bringen Sie Ihren Laptop mit."}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Session 1: API-Grundlagen und Authentifizierung"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Session 2: Produktkatalog und Warenkorb"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Session 3: Checkout und Webhooks"}]}]}]}]}',
   'Online (Zoom)',
   'https://zoom.us/j/example',
   '2026-04-22 14:00:00+02',
   '2026-04-22 17:00:00+02',
   50,
   '00000000-0000-0000-0000-000000000001',
   true),

  ('ev000000-0000-0000-0000-000000000003',
   'ACL Partner Summit 2026',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Jährliches Partner-Event mit Keynotes, Breakout-Sessions und Networking. Dieses Jahr im Palais Coburg, Wien."}]}]}',
   'Palais Coburg, Wien',
   NULL,
   '2026-06-18 09:00:00+02',
   '2026-06-19 17:00:00+02',
   100,
   '00000000-0000-0000-0000-000000000001',
   true),

  ('ev000000-0000-0000-0000-000000000004',
   'Webinar: Performance-Optimierung',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Best Practices für die Performance-Optimierung von ACL-basierten Shops."}]}]}',
   'Online (Teams)',
   NULL,
   '2026-05-08 11:00:00+02',
   '2026-05-08 12:00:00+02',
   NULL,
   '00000000-0000-0000-0000-000000000001',
   false);

-- ─── Event Registrations ─────────────────────────────────────
INSERT INTO event_registrations (event_id, user_id) VALUES
  ('ev000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('ev000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002');

-- ─── FAQ Categories ──────────────────────────────────────────
INSERT INTO faq_categories (id, name, description, sort_order) VALUES
  ('fq000000-0000-0000-0000-000000000001', 'Allgemein', 'Allgemeine Fragen zum Partner-Portal und Programm', 1),
  ('fq000000-0000-0000-0000-000000000002', 'Technische Integration', 'Fragen zur API-Anbindung und technischen Umsetzung', 2),
  ('fq000000-0000-0000-0000-000000000003', 'Abrechnung & Lizenzen', 'Fragen zu Preismodellen, Lizenzen und Abrechnung', 3);

-- ─── FAQ Items ───────────────────────────────────────────────
INSERT INTO faq_items (id, category_id, question, answer, sort_order, is_published) VALUES
  ('fqi00000-0000-0000-0000-000000000001',
   'fq000000-0000-0000-0000-000000000001',
   'Wie erhalte ich Zugang zum Partner-Portal?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Der Zugang wird von Ihrem ACL Account Manager eingerichtet. Sie erhalten eine E-Mail mit Ihren Zugangsdaten. Bei Problemen wenden Sie sich an partner@acl.at."}]}]}',
   1, true),

  ('fqi00000-0000-0000-0000-000000000002',
   'fq000000-0000-0000-0000-000000000001',
   'Wie kann ich mein Passwort zurücksetzen?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Klicken Sie auf der Login-Seite auf \"Passwort vergessen?\". Sie erhalten eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts."}]}]}',
   2, true),

  ('fqi00000-0000-0000-0000-000000000003',
   'fq000000-0000-0000-0000-000000000001',
   'Wer ist mein Ansprechpartner bei ACL?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Ihr dedizierter Account Manager ist Ihr primärer Ansprechpartner. Die Kontaktdaten finden Sie in Ihrem Profil oder kontaktieren Sie uns unter partner@acl.at."}]}]}',
   3, true),

  ('fqi00000-0000-0000-0000-000000000004',
   'fq000000-0000-0000-0000-000000000002',
   'Wo finde ich die API-Dokumentation?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Die vollständige API-Dokumentation ist im Bereich \"Dateien\" unter der Kategorie \"Produktdokumentation\" verfügbar. Die aktuelle Version ist v2.4."}]},{"type":"paragraph","content":[{"type":"text","text":"Zusätzlich steht eine interaktive Swagger-UI unter api.acl.at/docs bereit."}]}]}',
   1, true),

  ('fqi00000-0000-0000-0000-000000000005',
   'fq000000-0000-0000-0000-000000000002',
   'Welche Authentifizierung nutzt die API?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Die ACL API nutzt OAuth 2.0 mit Client Credentials Flow. Sie erhalten Ihre Client-ID und Secret über das Partner-Portal. Tokens haben eine Gültigkeit von 1 Stunde."}]}]}',
   2, true),

  ('fqi00000-0000-0000-0000-000000000006',
   'fq000000-0000-0000-0000-000000000002',
   'Gibt es eine Sandbox-Umgebung zum Testen?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Ja, jeder Partner erhält Zugang zu einer dedizierten Sandbox-Umgebung. Die Zugangsdaten werden bei der Partner-Onboarding bereitgestellt. Die Sandbox wird täglich um 03:00 Uhr zurückgesetzt."}]}]}',
   3, true),

  ('fqi00000-0000-0000-0000-000000000007',
   'fq000000-0000-0000-0000-000000000003',
   'Wie funktioniert das Lizenzmodell?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"ACL bietet drei Lizenzmodelle:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Starter"},{"type":"text","text":" — Bis 10.000 Bestellungen/Monat"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Professional"},{"type":"text","text":" — Bis 100.000 Bestellungen/Monat"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Enterprise"},{"type":"text","text":" — Unbegrenzt, dedizierte Infrastruktur"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Details finden Sie in Ihrem Partnervertrag oder kontaktieren Sie Ihren Account Manager."}]}]}',
   1, true),

  ('fqi00000-0000-0000-0000-000000000008',
   'fq000000-0000-0000-0000-000000000003',
   'Wie erfolgt die Abrechnung?',
   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Die Abrechnung erfolgt monatlich auf Basis der tatsächlichen Nutzung. Rechnungen werden am 1. des Folgemonats erstellt und per E-Mail zugestellt. Zahlungsziel: 14 Tage netto."}]}]}',
   2, true);
