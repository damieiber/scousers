ALTER TABLE themed_articles
ADD CONSTRAINT unique_title_per_team UNIQUE (title, team_id);