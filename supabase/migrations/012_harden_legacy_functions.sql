ALTER FUNCTION public.get_guest_password() SET search_path = public;
ALTER FUNCTION public.get_admin_password() SET search_path = public;

REVOKE ALL ON FUNCTION public.get_guest_password() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_admin_password() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.debug_headers() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_studio_with_event(text, text, text, text, date, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_studio_with_event(text, text, text, text, date, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_studio_member(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_studio_owner(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.event_is_managed(uuid) FROM anon;
