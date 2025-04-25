import sqlite3

def insert_strength_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE strength_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS strength_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Power Lift", "Exert great force to lift or hold heavy objects with minimal strain."),
        ("Brute Force", "Use raw strength to break barriers, doors, or restraints."),
        ("Climb", "Ascend vertical surfaces using muscular coordination and grip."),
        ("Grappling", "Control or restrain others through superior physical might."),
        ("Weapon Mastery", "Wield large or heavy weapons with increased efficiency."),
        ("Charge", "Accelerate with forward momentum for shoving or displacement."),
        ("Iron Grip", "Maintain a firm hold on objects, weapons, or foes under duress. Distinct from Grip Strength, which focuses on raw squeezing power; Iron Grip reflects the ability to hold on despite external forces."),
        ("Heavy Endurance", "Function effectively under prolonged physical strain."),
        ("Shock Absorption", "Withstand knockback or collisions by bracing effectively."),
        ("Anchor Stance", "Root yourself to resist being moved or displaced. Unlike Postural Strength, this skill is about planted positioning against force rather than upright form maintenance."),
        ("Muscle Control", "Exert strength with precision to avoid overexertion or injury."),
        ("Weight Toss", "Hurl heavy objects with control and purpose."),
        ("Bodyweight Force", "Apply leverage and form to increase the impact of your strength."),
        ("Shoulder Strength", "Push through obstacles or support weight using upper body force."),
        ("Opposing Force Application", "Excel in scenarios requiring sustained force against resistance."),
        ("Load Bearing", "Carry burdens across long distances using disciplined pacing."),
        ("Balance Recovery", "Regain stance or stability after forceful impact."),
        ("Load Stabilization", "Compensate for shifting or awkward weight distribution."),
        ("Postural Strength", "Maintain upright form under increasing physical pressure. Distinct from Anchor Stance, which is about resisting movement rather than maintaining upright structural control."),
        ("Grip Strength", "Apply focused hand and forearm force when needed. Differs from Iron Grip, which reflects holding under pressure; this focuses on baseline grip power."),
        ("Stone Stance", "Stand immovably against physical or magical push forces. This expands on Anchor Stance by applying in magical or abnormal pressure contexts."),
        ("Fist Conditioning", "Build up the toughness of your fists and arms for impact-heavy tasks."),
        ("Impact Resistance", "Naturally reduce physical shock from blunt trauma."),
        ("Overhead Strength", "Excel at lifting or bracing weight directly above your body."),
        ("Lifting Form", "Apply biomechanical efficiency when performing lifting techniques."),
        ("Momentum Management", "Convert movement into power with smooth kinetic transitions.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO strength_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_strength_skills()