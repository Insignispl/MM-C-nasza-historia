-- Album ślubny — Maria i Michał Czujko
-- Inicjalizacja schematu bazy danych Supabase

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Settings table
CREATE TABLE IF NOT EXISTS public.wedding_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  groom_name text NOT NULL DEFAULT 'Michał',
  bride_name text NOT NULL DEFAULT 'Maria',
  bride_maiden_name text,
  couple_name text NOT NULL DEFAULT 'Maria i Michał Czujko',
  wedding_date date NOT NULL DEFAULT '2026-06-27',
  location text NOT NULL DEFAULT 'Polkowice',
  story_text text,
  cover_image text,
  primary_color text NOT NULL DEFAULT '#9f7aea',
  secondary_color text NOT NULL DEFAULT '#fbd38d',
  guest_password text NOT NULL DEFAULT 'czujko2026',
  allow_uploads boolean NOT NULL DEFAULT true,
  require_moderation boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  admin_password text NOT NULL DEFAULT 'admin2026'
);

-- Media table
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('image', 'video')),
  storage_path text NOT NULL,
  public_url text NOT NULL,
  thumbnail_url text,
  caption text,
  guest_name text,
  uploaded_by text,
  approved boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Guestbook entries table
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name text NOT NULL,
  message text NOT NULL,
  relation text,
  media_url text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helper functions for token validation (security definer avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_guest_password()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT guest_password FROM public.wedding_settings LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_password()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT admin_password FROM public.wedding_settings LIMIT 1;
$$;

-- Seed default settings (single row)
INSERT INTO public.wedding_settings (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM public.wedding_settings);

-- Enable RLS
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-running this migration safely
DROP POLICY IF EXISTS "Public read settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Admin full settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Public read approved media" ON public.media;
DROP POLICY IF EXISTS "Guest upload media with token" ON public.media;
DROP POLICY IF EXISTS "Admin full media" ON public.media;
DROP POLICY IF EXISTS "Public read approved entries" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Guest write entry with token" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Admin full guestbook" ON public.guestbook_entries;

-- Wedding settings policies
CREATE POLICY "Public read settings"
  ON public.wedding_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full settings"
  ON public.wedding_settings FOR ALL
  TO anon
  USING (
    COALESCE(current_setting('request.headers', true)::json ->> 'x-admin-token', '') = get_admin_password()
  );

-- Media policies
CREATE POLICY "Public read approved media"
  ON public.media FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Guest upload media with token"
  ON public.media FOR INSERT
  TO anon
  WITH CHECK (
    COALESCE(current_setting('request.headers', true)::json ->> 'x-guest-token', '') = get_guest_password()
  );

CREATE POLICY "Admin full media"
  ON public.media FOR ALL
  TO anon
  USING (
    COALESCE(current_setting('request.headers', true)::json ->> 'x-admin-token', '') = get_admin_password()
  );

-- Guestbook policies
CREATE POLICY "Public read approved entries"
  ON public.guestbook_entries FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Guest write entry with token"
  ON public.guestbook_entries FOR INSERT
  TO anon
  WITH CHECK (
    COALESCE(current_setting('request.headers', true)::json ->> 'x-guest-token', '') = get_guest_password()
  );

CREATE POLICY "Admin full guestbook"
  ON public.guestbook_entries FOR ALL
  TO anon
  USING (
    COALESCE(current_setting('request.headers', true)::json ->> 'x-admin-token', '') = get_admin_password()
  );
