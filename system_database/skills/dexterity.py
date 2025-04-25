import sqlite3

def insert_dexterity_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE dexterity_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dexterity_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Acrobatics", "Perform flips, rolls, and agile maneuvers with grace."),
        ("Sleight of Hand", "Quick, precise hand movements for tricks or theft."),
        ("Stealth", "Move silently and remain unseen when hiding or sneaking."),
        ("Balance", "Maintain stability across difficult terrain or situations."),
        ("Evasion", "Dodge area effects or hazards more effectively."),
        ("Reflex Training", "React quickly to sudden changes in your environment."),
        ("Ambidexterity", "Use both hands equally well, especially in combat."),
        ("Precision Throwing", "Throw small objects or weapons with incredible accuracy."),
        ("Lockpicking", "Bypass mechanical locks or traps with dexterous tools."),
        ("Escape Artist", "Slip out of bonds, grapples, or tight spaces."),
        ("Vital Point Targeting", "Strike vulnerable spots for critical damage."),
        ("Weapon Finesse", "Use agility over strength to land precise melee blows."),
        ("Arrow Redirection", "Deflect or adjust projectile trajectory mid-shot."),
        ("Quick Draw", "Draw and strike with ranged or light weapons swiftly."),
        ("Trigger Discipline", "Fire ranged weapons with improved timing and steadiness."),
        ("Blade Precision", "Deliver surgical slashes or stabs to bypass armor."),
        ("Aimed Shot", "Carefully line up and execute a pinpoint ranged attack."),
        ("Dual Precision", "Strike with multiple weapons while maintaining accuracy."),
        ("Whip Control", "Manipulate flexible weapons with exact positioning."),
        ("Throwing Combo", "Follow up thrown attacks with secondary motions for precision."),
        ("Critical Chance", "Increase the likelihood of scoring a critical hit."),
        ("Critical Damage", "Boost the damage dealt when landing a critical hit.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO dexterity_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_dexterity_skills()
