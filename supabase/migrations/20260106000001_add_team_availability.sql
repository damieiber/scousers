-- Add team availability functionality
-- =====================================

-- 1. Add is_available column to teams table
-- ==========================================
ALTER TABLE public.teams
  ADD COLUMN is_available BOOLEAN DEFAULT true NOT NULL;

-- 2. Create index for efficient querying
-- =======================================
CREATE INDEX idx_teams_is_available ON public.teams(is_available);

-- 3. Set River Plate as available
-- ================================
UPDATE public.teams
SET is_available = true
WHERE key = 'River Plate';

-- 4. Insert placeholder teams for "Coming Soon"
-- ==============================================
INSERT INTO public.teams (id, key, is_available) VALUES
  (gen_random_uuid(), 'Boca Juniors', false),
  (gen_random_uuid(), 'Racing Club', false),
  (gen_random_uuid(), 'Independiente', false),
  (gen_random_uuid(), 'San Lorenzo', false)
ON CONFLICT (key) DO UPDATE SET is_available = EXCLUDED.is_available;

-- Add helpful comment
COMMENT ON COLUMN public.teams.is_available IS 'Indicates whether the team is currently available for selection. False means "Coming Soon"';
