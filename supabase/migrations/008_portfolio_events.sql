ALTER TABLE public.events
  ADD COLUMN is_portfolio boolean NOT NULL DEFAULT false,
  ADD COLUMN portfolio_title text,
  ADD COLUMN portfolio_description text;

UPDATE public.events
SET
  is_portfolio = true,
  portfolio_title = 'Maria i Michał — reportaż ślubny',
  portfolio_description = 'Pełen emocji dzień od pierwszych przygotowań po ostatni taniec.'
WHERE slug = 'maria-michal-demo';
