-- Add a short_summary column to themed_articles to store a shorter, preview version of the summary for feed views.
ALTER TABLE public.themed_articles
ADD COLUMN short_summary TEXT;
