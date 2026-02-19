-- Drop the ephemerides table and its related index
DROP TABLE IF EXISTS public.ephemerides;

-- Remove the relationship between teams and sports
-- First, drop the index on the column
DROP INDEX IF EXISTS public.idx_teams_sport_id;
-- Now drop the column, which will also remove the foreign key constraint
ALTER TABLE public.teams DROP COLUMN IF EXISTS sport_id;

-- Finally, drop the sports table
DROP TABLE IF EXISTS public.sports;
