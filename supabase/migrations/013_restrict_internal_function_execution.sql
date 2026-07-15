DROP FUNCTION IF EXISTS public.debug_headers();

REVOKE ALL ON FUNCTION public.is_studio_member(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_studio_owner(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.event_is_managed(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_studio_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_studio_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.event_is_managed(uuid) TO authenticated;
