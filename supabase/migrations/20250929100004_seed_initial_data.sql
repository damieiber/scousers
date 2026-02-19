-- Seed initial data for teams and sources
-- ==========================================

-- IMPORTANT:
-- You need to generate UUIDs for the 'id' of each team.
-- You can use an online tool (search for "online UUID generator").

-- 1. Insert Teams
-- =================
-- Replace the placeholder UUIDs with your generated ones and update the team keys.
-- Add more lines for more teams.

INSERT INTO public.teams (id, key) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'River Plate')  -- This is a valid example UUID.
ON CONFLICT (key) DO NOTHING; -- This prevents errors if you run the script multiple times


-- 2. Insert Sources
-- ==================
-- Use the same UUIDs you defined above to link sources to the correct team.
-- Replace the name, url, and team_id for each source.

INSERT INTO public.sources (name, url, team_id) VALUES
('Infobae - River Plate', 'https://www.infobae.com/deportes/futbol/river-plate/', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('TN - River Plate', 'https://tn.com.ar/tags/river-plate/', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('Clarín - River Plate', 'https://www.clarin.com/tema/river-plate.html', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('La Nación - River Plate', 'https://www.lanacion.com.ar/deportes/futbol/river-plate/', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('Mdzol - River Plate', 'https://www.mdzol.com/temas/river-plate-16.html', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('La Pagina Millonaria - River Plate', 'https://lapaginamillonaria.com/', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('Olé - River Plate', 'https://www.ole.com.ar/river-plate', 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
ON CONFLICT (url) DO NOTHING; -- This prevents errors if a source URL already exists