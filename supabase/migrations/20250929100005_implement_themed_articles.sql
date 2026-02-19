-- Step 1: Drop the old articles table
DROP TABLE IF EXISTS public.articles;

-- Step 2: Create the new table for themed articles
CREATE TABLE themed_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_themed_articles_team_id ON themed_articles(team_id);

-- Step 3: Create the new table for the original source article links
CREATE TABLE original_article_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    themed_article_id UUID REFERENCES themed_articles(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    source_name TEXT,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_original_article_links_themed_article_id ON original_article_links(themed_article_id);
ALTER TABLE original_article_links ADD CONSTRAINT unique_url_per_themed_article UNIQUE (themed_article_id, url);
