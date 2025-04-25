-- Characters Table
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER DEFAULT 0
);

-- Primary Scores Table (Classic Six)
CREATE TABLE IF NOT EXISTS primary_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Secondary Scores Table (Expanded 4)
CREATE TABLE IF NOT EXISTS secondary_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Character Primary Stats
CREATE TABLE IF NOT EXISTS character_primary_stats (
    character_id INTEGER NOT NULL,
    score_id INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    FOREIGN KEY (score_id) REFERENCES primary_scores(id),
    PRIMARY KEY (character_id, score_id)
);

-- Character Secondary Stats
CREATE TABLE IF NOT EXISTS character_secondary_stats (
    character_id INTEGER NOT NULL,
    score_id INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id),
    FOREIGN KEY (score_id) REFERENCES secondary_scores(id),
    PRIMARY KEY (character_id, score_id)
);
