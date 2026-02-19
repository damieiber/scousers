
-- Create a function to find similar themed articles based on embedding
CREATE OR REPLACE FUNCTION find_similar_themed_articles(
  query_embedding vector,
  p_team_id UUID,
  similarity_threshold float
)
RETURNS TABLE (
  id UUID,
  title text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ta.id,
    ta.title,
    (ta.embedding <#> query_embedding) * -1 AS similarity
  FROM
    themed_articles ta
  WHERE
    ta.team_id = p_team_id AND (ta.embedding <#> query_embedding) * -1 > similarity_threshold
  ORDER BY
    similarity DESC
  LIMIT 1;
END;
$$;
