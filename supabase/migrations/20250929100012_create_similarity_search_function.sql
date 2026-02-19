-- Create a function to search for similar themes using vector similarity
CREATE OR REPLACE FUNCTION find_similar_theme(
  query_embedding vector(768),
  p_team_id uuid,
  similarity_threshold float
)
RETURNS TABLE (
  id uuid,
  title text,
  similarity double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    themed_articles.id,
    themed_articles.title,
    1 - (themed_articles.embedding <=> query_embedding) AS similarity
  FROM
    themed_articles
  WHERE
    themed_articles.team_id = p_team_id
    AND 1 - (themed_articles.embedding <=> query_embedding) > similarity_threshold
  ORDER BY
    similarity DESC
  LIMIT 1;
END;
$$;
