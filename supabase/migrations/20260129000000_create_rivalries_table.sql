-- Create rivalries table for team rivalry relationships
-- ======================================================

-- 1. Create rivalries table
-- ==========================
CREATE TABLE public.rivalries (
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  rival_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  rank INT NOT NULL DEFAULT 1, -- Priority of rivalry (1 = maximum rival)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, rival_team_id),
  CONSTRAINT different_teams CHECK (team_id != rival_team_id)
);

-- 2. Create index for efficient queries
-- ======================================
CREATE INDEX idx_rivalries_team_id ON public.rivalries(team_id);

-- 3. Enable RLS
-- ==============
ALTER TABLE public.rivalries ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Rivalries are viewable by everyone"
  ON public.rivalries FOR SELECT
  USING (true);

-- 4. Seed initial rivalries for River Plate
-- ==========================================
-- First, we need to get or create the rival teams
-- For now, we insert placeholder UUIDs that will be matched with actual teams

DO $$
DECLARE
  river_id UUID;
  boca_id UUID;
  racing_id UUID;
  independiente_id UUID;
BEGIN
  -- Get River Plate ID
  SELECT id INTO river_id FROM public.teams WHERE key = 'river-plate';
  
  IF river_id IS NULL THEN
    RAISE NOTICE 'River Plate team not found, skipping rivalry seed';
    RETURN;
  END IF;

  -- Get or create Boca Juniors
  SELECT id INTO boca_id FROM public.teams WHERE key = 'boca-juniors';
  IF boca_id IS NULL THEN
    INSERT INTO public.teams (id, key, is_available) 
    VALUES (gen_random_uuid(), 'boca-juniors', false)
    RETURNING id INTO boca_id;
  END IF;

  -- Get or create Racing Club
  SELECT id INTO racing_id FROM public.teams WHERE key = 'racing-club';
  IF racing_id IS NULL THEN
    INSERT INTO public.teams (id, key, is_available) 
    VALUES (gen_random_uuid(), 'racing-club', false)
    RETURNING id INTO racing_id;
  END IF;

  -- Get or create Independiente
  SELECT id INTO independiente_id FROM public.teams WHERE key = 'independiente';
  IF independiente_id IS NULL THEN
    INSERT INTO public.teams (id, key, is_available) 
    VALUES (gen_random_uuid(), 'independiente', false)
    RETURNING id INTO independiente_id;
  END IF;

  -- Insert rivalries
  INSERT INTO public.rivalries (team_id, rival_team_id, rank)
  VALUES 
    (river_id, boca_id, 1),           -- Boca is #1 rival
    (river_id, racing_id, 2),         -- Racing is #2 rival
    (river_id, independiente_id, 3)   -- Independiente is #3 rival
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Rivalries seeded successfully for River Plate';
END $$;

-- Add helpful comments
COMMENT ON TABLE public.rivalries IS 'Defines rivalry relationships between teams for Modo Rival feature';
COMMENT ON COLUMN public.rivalries.rank IS 'Priority of the rivalry, lower is more important (1 = maximum rival)';
