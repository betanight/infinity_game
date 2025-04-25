import sqlite3

def insert_instinct_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE instinct_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS instinct_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Danger Sense", "React to threats before they are fully perceived."),
        ("Combat Intuition", "Predict enemy movements and intentions."),
        ("Animal Empathy", "Understand and influence animal behavior."),
        ("Natural Awareness", "Stay alert to environmental changes and danger signs."),
        ("Intuitive Dodge", "Evade attacks through sheer instinct."),
        ("Hunting Instinct", "Track and corner prey without logical deduction."),
        ("Gut Feeling", "Act on subconscious understanding in complex situations."),
        ("Ambush Sense", "Detect hidden or unexpected threats nearby."),
        ("Impulse Action", "Take sudden decisive actions without hesitation."),
        ("Tactical Reflex", "React to battlefield shifts on instinct alone."),
        ("Sight Awareness", "Passively detect movement or visual anomalies in surroundings."),
        ("Hearing Sensitivity", "Pick up on faint or distant sounds instinctively."),
        ("Scent Recognition", "Sense and recognize subtle changes in smells nearby."),
        ("Tactile Perception", "Feel changes in vibrations, surfaces, or pressure."),
        ("Taste Sensitivity", "Discern taste differences that signal danger or health."),
        ("Sixth Sense", "Perceive metaphysical presences such as ghosts or spiritual auras.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO instinct_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_instinct_skills()