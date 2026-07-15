CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.studios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  logo_url text,
  primary_color text NOT NULL DEFAULT '#9f7aea',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.studio_members (
  studio_id uuid NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'photographer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (studio_id, user_id)
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id uuid NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  couple_name text NOT NULL,
  wedding_date date,
  location text,
  story_text text,
  cover_image_url text,
  primary_color text NOT NULL DEFAULT '#9f7aea',
  secondary_color text NOT NULL DEFAULT '#fbd38d',
  public_access_enabled boolean NOT NULL DEFAULT true,
  allow_uploads boolean NOT NULL DEFAULT true,
  require_moderation boolean NOT NULL DEFAULT true,
  kiosk_enabled boolean NOT NULL DEFAULT false,
  live_wall_enabled boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.event_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  storage_path text NOT NULL,
  public_url text NOT NULL,
  thumbnail_url text,
  caption text,
  guest_name text,
  approved boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.event_guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  relation text,
  message text NOT NULL,
  media_url text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX event_media_event_created_idx ON public.event_media(event_id, created_at DESC);
CREATE INDEX event_guestbook_event_created_idx ON public.event_guestbook_entries(event_id, created_at DESC);
CREATE INDEX events_studio_created_idx ON public.events(studio_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.is_studio_member(target_studio_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.studio_members
    WHERE studio_id = target_studio_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_studio_owner(target_studio_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.studio_members
    WHERE studio_id = target_studio_id AND user_id = auth.uid() AND role = 'owner'
  );
$$;

CREATE OR REPLACE FUNCTION public.event_is_managed(target_event_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events event
    JOIN public.studio_members member ON member.studio_id = event.studio_id
    WHERE event.id = target_event_id AND member.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.create_studio_with_event(
  studio_name text,
  studio_slug text,
  event_name text,
  event_slug text,
  event_date date DEFAULT NULL,
  event_location text DEFAULT NULL
)
RETURNS public.events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_studio public.studios;
  new_event public.events;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.studios (name, slug)
  VALUES (studio_name, studio_slug)
  RETURNING * INTO new_studio;

  INSERT INTO public.studio_members (studio_id, user_id, role)
  VALUES (new_studio.id, auth.uid(), 'owner');

  INSERT INTO public.events (studio_id, slug, couple_name, wedding_date, location)
  VALUES (new_studio.id, event_slug, event_name, event_date, event_location)
  RETURNING * INTO new_event;

  RETURN new_event;
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Members view studios" ON public.studios FOR SELECT TO authenticated USING (public.is_studio_member(id));
CREATE POLICY "Authenticated users create studios" ON public.studios FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Studio owners update studios" ON public.studios FOR UPDATE TO authenticated USING (public.is_studio_owner(id));

CREATE POLICY "Members view studio members" ON public.studio_members FOR SELECT TO authenticated USING (public.is_studio_member(studio_id));
CREATE POLICY "Owners manage studio members" ON public.studio_members FOR ALL TO authenticated USING (public.is_studio_owner(studio_id)) WITH CHECK (public.is_studio_owner(studio_id));

CREATE POLICY "Members manage events" ON public.events FOR ALL TO authenticated USING (public.is_studio_member(studio_id)) WITH CHECK (public.is_studio_member(studio_id));
CREATE POLICY "Guests view live events" ON public.events FOR SELECT TO anon USING (public_access_enabled AND status = 'live');

CREATE POLICY "Members manage event media" ON public.event_media FOR ALL TO authenticated USING (public.event_is_managed(event_id)) WITH CHECK (public.event_is_managed(event_id));
CREATE POLICY "Guests view approved event media" ON public.event_media FOR SELECT TO anon USING (
  approved AND EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND public_access_enabled AND status = 'live')
);

CREATE POLICY "Members manage event guestbook" ON public.event_guestbook_entries FOR ALL TO authenticated USING (public.event_is_managed(event_id)) WITH CHECK (public.event_is_managed(event_id));
CREATE POLICY "Guests view approved event guestbook" ON public.event_guestbook_entries FOR SELECT TO anon USING (
  approved AND EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND public_access_enabled AND status = 'live')
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT EXECUTE ON FUNCTION public.create_studio_with_event(text, text, text, text, date, text) TO authenticated;
