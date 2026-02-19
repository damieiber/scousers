-- Create a new ENUM type for the source status
CREATE TYPE source_status AS ENUM ('active', 'quarantined');

-- Add health-related columns to the sources table
ALTER TABLE public.sources
ADD COLUMN status source_status NOT NULL DEFAULT 'active',
ADD COLUMN consecutive_failures INTEGER NOT NULL DEFAULT 0,
ADD COLUMN quarantine_threshold INTEGER NOT NULL DEFAULT 5; -- A reasonable default threshold

-- Add comments to the new columns for better understanding
COMMENT ON COLUMN public.sources.status IS 'The current operational status of the news source (e.g., active, quarantined).';
COMMENT ON COLUMN public.sources.consecutive_failures IS 'Counter for consecutive processing failures for this source.';
COMMENT ON COLUMN public.sources.quarantine_threshold IS 'The number of consecutive failures before a source is quarantined.';
