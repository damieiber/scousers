-- One-time update to set the status of all existing sources to 'active'.
-- This ensures that sources created before the 'status' column was added are not ignored.
UPDATE public.sources
SET status = 'active'
WHERE status IS NULL;
