-- Add title column to ephemerides table
ALTER TABLE ephemerides
ADD COLUMN title TEXT NOT NULL DEFAULT 'Untitled Ephemeris';

-- Update existing rows to have a default title if necessary
-- This might be needed if there are already rows in ephemerides table
-- UPDATE ephemerides SET title = 'Untitled Ephemeris' WHERE title IS NULL;

-- Make the default title an empty string or remove the default if not desired
ALTER TABLE ephemerides ALTER COLUMN title DROP DEFAULT;
