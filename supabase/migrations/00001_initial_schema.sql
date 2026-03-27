-- ============================================================
-- ACL Partner Portal — Supabase PostgreSQL Schema
-- ============================================================

-- Trigger-Funktion für updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------
-- 1. profiles
-- --------------------------------------------------------
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  company     TEXT,
  role        TEXT NOT NULL DEFAULT 'partner'
              CHECK (role IN ('admin', 'partner')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper for RLS (must come after profiles table)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- --------------------------------------------------------
-- 2. news
-- --------------------------------------------------------
CREATE TABLE news (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  content      JSONB NOT NULL,
  excerpt      TEXT,
  cover_image  TEXT,
  author_id    UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_news_published
  ON news(is_published, published_at DESC);

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------
-- 3. faq_categories
-- --------------------------------------------------------
CREATE TABLE faq_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------
-- 4. faq_items
-- --------------------------------------------------------
CREATE TABLE faq_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES faq_categories(id) ON DELETE CASCADE,
  question     TEXT NOT NULL,
  answer       JSONB NOT NULL,
  sort_order   INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_faq_items_category
  ON faq_items(category_id, sort_order);

CREATE TRIGGER faq_items_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------
-- 5. events
-- --------------------------------------------------------
CREATE TABLE events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  JSONB,
  location     TEXT,
  event_url    TEXT,
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ,
  max_seats    INT,
  created_by   UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_date
  ON events(is_published, start_date);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- --------------------------------------------------------
-- 6. event_registrations
-- --------------------------------------------------------
CREATE TABLE event_registrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_reg_event
  ON event_registrations(event_id);

CREATE INDEX idx_event_reg_user
  ON event_registrations(user_id);

-- --------------------------------------------------------
-- 7. file_categories
-- --------------------------------------------------------
CREATE TABLE file_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0
);

-- --------------------------------------------------------
-- 8. files
-- --------------------------------------------------------
CREATE TABLE files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  description   TEXT,
  category_id   UUID REFERENCES file_categories(id),
  storage_path  TEXT NOT NULL,
  file_size     BIGINT,
  mime_type     TEXT,
  uploaded_by   UUID REFERENCES profiles(id),
  is_published  BOOLEAN DEFAULT true,
  uploaded_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_files_category
  ON files(category_id);

CREATE INDEX idx_files_published
  ON files(is_published);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE news                ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE files               ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (is_admin());

-- news
CREATE POLICY "Anyone can read published news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage news" ON news FOR ALL USING (is_admin());

-- faq_categories
CREATE POLICY "Anyone can read faq categories" ON faq_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage faq categories" ON faq_categories FOR ALL USING (is_admin());

-- faq_items
CREATE POLICY "Anyone can read published faq items" ON faq_items FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage faq items" ON faq_items FOR ALL USING (is_admin());

-- events
CREATE POLICY "Anyone can read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (is_admin());

-- event_registrations
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own registration" ON event_registrations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage registrations" ON event_registrations FOR ALL USING (is_admin());

-- file_categories
CREATE POLICY "Anyone can read file categories" ON file_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage file categories" ON file_categories FOR ALL USING (is_admin());

-- files
CREATE POLICY "Anyone can read published files" ON files FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage files" ON files FOR ALL USING (is_admin());

-- ============================================================
-- Storage Buckets
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('portal-files', 'portal-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('portal-images', 'portal-images', true);

-- Storage Policies
CREATE POLICY "Authenticated users can download"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portal-files' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portal-files' AND is_admin());

CREATE POLICY "Admins can update storage"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portal-files' AND is_admin());

CREATE POLICY "Admins can delete storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portal-files' AND is_admin());

-- Image bucket: authenticated users can read, admins can write
CREATE POLICY "Authenticated users can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portal-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portal-images' AND is_admin());

CREATE POLICY "Admins can update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portal-images' AND is_admin());

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portal-images' AND is_admin());

-- ============================================================
-- Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, company, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'company',
    COALESCE(NEW.raw_user_meta_data->>'role', 'partner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
