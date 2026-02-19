-- Add Boca Juniors team and sources for Modo Rival
-- ==================================================
-- Simplified version - doesn't depend on sports table

DO $$
DECLARE
  boca_id UUID;
  river_id UUID;
BEGIN
  -- Get River's ID for the rivalry
  SELECT id INTO river_id FROM public.teams WHERE key = 'river-plate';

  -- Get or create Boca Juniors team
  SELECT id INTO boca_id FROM public.teams WHERE key = 'boca-juniors';
  
  IF boca_id IS NULL THEN
    INSERT INTO public.teams (id, key, is_available) 
    VALUES (gen_random_uuid(), 'boca-juniors', false)
    RETURNING id INTO boca_id;
    RAISE NOTICE 'Created Boca Juniors team with ID: %', boca_id;
  ELSE
    RAISE NOTICE 'Boca Juniors team already exists with ID: %', boca_id;
  END IF;

  -- Add Boca sources
  INSERT INTO public.sources (name, url, team_id, status, consecutive_failures, quarantine_threshold)
  VALUES 
    ('Infobae Boca', 'https://www.infobae.com/deportes/futbol/boca-juniors/', boca_id, 'active', 0, 5),
    ('La Nación Boca', 'https://www.lanacion.com.ar/deportes/futbol/boca-juniors/', boca_id, 'active', 0, 5),
    ('Clarín Boca', 'https://www.clarin.com/tema/boca-juniors.html', boca_id, 'active', 0, 5),
    ('TN Boca', 'https://tn.com.ar/tags/boca-juniors/', boca_id, 'active', 0, 5),
    ('Olé Boca', 'https://www.ole.com.ar/boca-juniors', boca_id, 'active', 0, 5)
  ON CONFLICT (url) DO NOTHING;

  RAISE NOTICE 'Added 5 Boca Juniors sources';

  -- Ensure rivalry exists (River -> Boca)
  IF river_id IS NOT NULL THEN
    INSERT INTO public.rivalries (team_id, rival_team_id, rank)
    VALUES (river_id, boca_id, 1)
    ON CONFLICT DO NOTHING;
    
    -- Also add reverse rivalry (Boca -> River) for when Boca fans use the app
    INSERT INTO public.rivalries (team_id, rival_team_id, rank)
    VALUES (boca_id, river_id, 1)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Rivalries established between River and Boca';
  END IF;

END $$;
