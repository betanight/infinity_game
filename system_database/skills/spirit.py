import sqlite3

def insert_spirit_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE spirit_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS spirit_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Inner Flame", "Tap into your core will to resist suppression and despair."),
        ("Spiritual Fortitude", "Maintain spiritual integrity against corruption or fear."),
        ("Warding Light", "Project a calm, steady presence in spiritually volatile areas."),
        ("Meditative Focus", "Find clarity and calm amidst chaos to center your spirit."),
        ("Spiritual Channeling", "Direct inner spirit energy to amplify existing skill performance."),
        ("Astral Link", "Develop a mental discipline for sensing ethereal patterns and moods."),
        ("Spirit Echo", "Retain spiritual impressions from environments or people."),
        ("Resilience Rituals", "Practice methods to mentally cleanse one's spirit over time."),
        ("Ancestral Connection", "Maintain a passive connection to spiritual lineage and memory."),
        ("Will of the Ancients", "Steadfastly adhere to ancient principles or spiritual tenets."),
        ("Ritual Empowerment", "Enhance long-form spiritual practices through preparation and focus."),
        ("Spiritual Perception", "Subtly detect the presence of spiritual phenomena through sensitivity."),
        ("Spiritual Boundaries", "Skillfully create mental distance from negative spiritual influences."),
        ("Spirit Communication", "Interpret or express ideas from spiritual entities clearly and calmly."),
        ("Protective Instincts", "Position yourself to avoid spiritual or emotional harm instinctively."),
        ("Essence Imprint", "Leave a trace of your mindset or mood in places you've spent time."),
        ("Harmonize", "Stay emotionally and spiritually in tune with group dynamics."),
        ("Calm the Spirit", "Soothe personal emotional turbulence through internal practice."),
        ("Awakened Spirit", "Cultivate heightened awareness of spiritual influence and presence."),
        ("Stillness Training", "Learn to quiet your spiritual presence to avoid attention."),
        ("Spirit Bond", "Develop a lasting connection with another being's spirit."),
        ("Pact Negotiation", "Skillfully establish spiritual agreements with otherworldly entities."),
        ("Resonant Union", "Momentarily merge a portion of your spirit with another's for shared clarity."),
        ("Bound Oath", "Commit part of your spirit to a solemn vow, enhancing dedication."),
        ("Ethereal Pactkeeping", "Maintain long-term spiritual agreements without corruption or deviation.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO spirit_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_spirit_skills()
