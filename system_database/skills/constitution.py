import sqlite3

def insert_constitution_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE constitution_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS constitution_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Endurance", "Sustain physical activity over extended periods without fatigue."),
        ("Pain Tolerance", "Resist pain from injury or strenuous exertion."),
        ("Disease Resistance", "Natural resilience against infections and illnesses."),
        ("Toxin Resistance", "Ability to withstand poisons and harmful substances."),
        ("Stamina Recovery", "Recover quickly from exhaustion or fatigue."),
        ("Hunger Tolerance", "Function effectively with minimal food intake."),
        ("Cold Resistance", "Withstand freezing temperatures and harsh climates."),
        ("Heat Resistance", "Endure extreme heat and dehydration."),
        ("Natural Healing", "Regenerate from wounds and recover health over time."),
        ("Sleep Efficiency", "Require less sleep while maintaining full performance."),
        ("Shock Resistance", "Survive trauma from blunt force or energy-based attacks."),
        ("Breath Control", "Hold breath for long durations or function in low-oxygen environments."),
        ("Blood Circulation", "Maintain consistent body performance under stress."),
        ("Toughness", "Reduce the severity of injuries taken."),
        ("Longevity", "Extend life expectancy and reduce aging effects."),
        ("Stress Resistance", "Perform well under high-pressure situations."),
        ("Fat Storage", "Efficiently manage bodily energy reserves."),
        ("Recovery Boost", "Accelerate physical healing from injuries."),
        ("Core Strength", "Improve internal body strength and stability."),
        ("Vitality", "Enhance overall physical robustness and health."),
        ("Fire Resistance", "Reduce or negate damage from fire-based attacks."),
        ("Frost Resistance", "Minimize harm from freezing or icy conditions."),
        ("Lightning Resistance", "Deflect or ground electrical damage sources."),
        ("Acid Resistance", "Reduce the effects of corrosive substances."),
        ("Thunder Resistance", "Endure damage from forceful sound or vibrations."),
        ("Force Resistance", "Resist magical or concussive force effects."),
        ("Poison Resistance", "Mitigate damage and effects from toxins."),
        ("Bludgeoning Resistance", "Reduce damage from blunt weapons or impacts."),
        ("Piercing Resistance", "Withstand stabs and punctures from sharp objects."),
        ("Slashing Resistance", "Deflect or reduce injury from cutting attacks."),
        ("Adaptability", "Adjust to harsh environments and unexpected challenges more easily."),
        ("Physical Perseverance", "Push through intense physical strain to complete difficult tasks.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO constitution_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_constitution_skills()
