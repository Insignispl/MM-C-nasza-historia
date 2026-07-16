WITH demo_images(storage_path, public_url, caption) AS (
  VALUES
    ('demo/preparations.jpg', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90', 'Przygotowania Pary Młodej — materiał demonstracyjny.'),
    ('demo/journey.jpg', 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1800&q=90', 'Droga na ceremonię — materiał demonstracyjny.'),
    ('demo/guests_arrive.jpg', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=90', 'Goście przed ceremonią — materiał demonstracyjny.'),
    ('demo/ceremony.jpg', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=90', 'Ceremonia — materiał demonstracyjny.'),
    ('demo/celebration.jpg', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=90', 'Gratulacje — materiał demonstracyjny.'),
    ('demo/reception.jpg', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=90', 'Powitanie na sali — materiał demonstracyjny.'),
    ('demo/first_dance.jpg', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=90', 'Pierwszy taniec — materiał demonstracyjny.'),
    ('demo/party.jpg', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=90', 'Zabawa weselna — materiał demonstracyjny.'),
    ('demo/thanks.jpg', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=90', 'Podziękowania dla rodziców — materiał demonstracyjny.'),
    ('demo/finale.jpg', 'https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1800&q=90', 'Ostatni taniec — materiał demonstracyjny.')
)
UPDATE public.event_media media
SET public_url = demo_images.public_url,
    caption = demo_images.caption
FROM demo_images
WHERE media.storage_path = demo_images.storage_path;
