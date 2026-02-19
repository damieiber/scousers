-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add the embedding column to the themed_articles table
ALTER TABLE public.themed_articles
ADD COLUMN embedding vector(768);

-- Add an index for efficient similarity search
-- This is crucial for performance as the table grows.
-- The index type (e.g., ivfflat, hnsw) and parameters can be tuned later.
CREATE INDEX ON public.themed_articles USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Add a comment to the new column for clarity
COMMENT ON COLUMN public.themed_articles.embedding IS 'Vector embedding representing the semantic meaning of the article theme, used for similarity searches.';
