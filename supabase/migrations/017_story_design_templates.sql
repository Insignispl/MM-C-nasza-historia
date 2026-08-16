ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS story_template text NOT NULL DEFAULT 'romantic' CHECK (story_template IN ('romantic', 'editorial', 'midnight')),
  ADD COLUMN IF NOT EXISTS story_background_color text NOT NULL DEFAULT '#fcf9fc',
  ADD COLUMN IF NOT EXISTS story_gradient_from text NOT NULL DEFAULT '#efd4e5',
  ADD COLUMN IF NOT EXISTS story_gradient_to text NOT NULL DEFAULT '#ded1ed',
  ADD COLUMN IF NOT EXISTS story_text_color text NOT NULL DEFAULT '#302036';

UPDATE public.events
SET
  story_template = CASE WHEN slug = 'maria-michal-demo' THEN 'romantic' ELSE story_template END,
  story_background_color = CASE WHEN slug = 'maria-michal-demo' THEN '#fff9fc' ELSE story_background_color END,
  story_gradient_from = CASE WHEN slug = 'maria-michal-demo' THEN '#f4d7e5' ELSE story_gradient_from END,
  story_gradient_to = CASE WHEN slug = 'maria-michal-demo' THEN '#ddd2f0' ELSE story_gradient_to END,
  story_text_color = CASE WHEN slug = 'maria-michal-demo' THEN '#38263d' ELSE story_text_color END;
