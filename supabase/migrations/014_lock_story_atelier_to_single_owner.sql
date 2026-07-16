UPDATE public.studios
SET name = 'Story Atelier',
    slug = 'story-atelier'
WHERE id = '54a23e27-19b0-494d-98de-3df0ab3f90f2';

DROP POLICY IF EXISTS "Authenticated users create studios" ON public.studios;
REVOKE EXECUTE ON FUNCTION public.create_studio_with_event(text, text, text, text, date, text) FROM authenticated;
