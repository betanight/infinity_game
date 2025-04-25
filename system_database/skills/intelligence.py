import sqlite3

def insert_intelligence_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE intelligence_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS intelligence_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Investigation", "Uncover hidden details, clues, or discrepancies."),
        ("Arcana", "Understand magical lore, runes, and mystical forces."),
        ("History", "Recall historical events, lineages, and ancient facts."),
        ("Logic", "Apply rational thinking to puzzles, strategies, or arguments."),
        ("Linguistics", "Learn, decode, or translate spoken and written languages."),
        ("Tactical Planning", "Formulate detailed strategies for battles or operations."),
        ("Engineering", "Design, build, or repair mechanisms, structures, or tools."),
        ("Mathematics", "Use complex math for measurements, predictions, or calculations."),
        ("Memory Recall", "Access precise or obscure knowledge when needed."),
        ("Codebreaking", "Crack ciphers, encryption, or hidden messages."),
        ("Religious Studies", "Understand doctrines, rituals, and divine histories."),
        ("Mind Resistance", "Withstand mental influence or charm effects."),
        ("Psychic Defense", "Shield the mind from telepathic intrusion or control."),
        ("Mental Fortitude", "Sustain clarity and focus under mental pressure."),
        ("Illusion Analysis", "Identify and methodically dispel illusionary effects."),
        ("Strategic Foresight", "Predict outcomes of plans or actions several steps ahead."),
        ("Magical Theory", "Form and test hypotheses regarding magic systems."),
        ("Knowledge Synthesis", "Combine separate bits of information into useful insights."),
        ("Cognitive Adaptability", "Adjust quickly to new intellectual challenges or ideas."),
        ("Occult Knowledge", "Understand forbidden or esoteric magical teachings.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO intelligence_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_intelligence_skills()
