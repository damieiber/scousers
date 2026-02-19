-- Add rival_sentiment column to themed_articles
-- ==============================================

-- 1. Add the rival_sentiment column
-- ==================================
ALTER TABLE public.themed_articles 
ADD COLUMN IF NOT EXISTS rival_sentiment TEXT;

-- 2. Add check constraint for valid values
-- ==========================================
ALTER TABLE public.themed_articles
ADD CONSTRAINT valid_rival_sentiment 
CHECK (rival_sentiment IS NULL OR rival_sentiment IN ('NEGATIVE', 'NEUTRAL', 'POSITIVE'));

-- 3. Create index for efficient queries on rival mode
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_themed_articles_rival_sentiment 
ON public.themed_articles(rival_sentiment) 
WHERE rival_sentiment IS NOT NULL;

-- Add helpful comment
COMMENT ON COLUMN public.themed_articles.rival_sentiment IS 'Sentiment classification for Modo Rival: NEGATIVE (bad news for rival), NEUTRAL, POSITIVE (good news for rival)';
