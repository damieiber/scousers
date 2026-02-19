CREATE TABLE IF NOT EXISTS efemerides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date TEXT NOT NULL, -- Format: 'MM-DD'
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('match', 'birth', 'title', 'generic')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookup by date
CREATE INDEX IF NOT EXISTS idx_efemerides_date ON efemerides(date);
