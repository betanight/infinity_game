import sqlite3

def insert_presence_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE presence_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS presence_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Aura Projection", "Project a commanding or calming presence that influences others."),
        ("Unshakable Presence", "Maintain composure and influence even under stress."),
        ("Silent Authority", "Command respect without speaking a word."),
        ("Charismatic Aura", "Radiate charm that naturally draws attention and favor."),
        ("Disruptive Glare", "Momentarily unnerve or break focus through intense eye contact."),
        ("Presence Detection", "Sense powerful or notable beings entering your vicinity."),
        ("Battlefield Presence", "Shift the mood of allies or enemies by sheer force of being."),
        ("Commanding Step", "Cause others to pause or move aside by your approach."),
        ("Focused Aura", "Center your presence to intimidate, inspire, or steady others."),
        ("Spiritual Magnetism", "Draw in attention or entities through unexplainable pull."),
        ("Astral Flare", "Radiate metaphysical energy visible only to the magically attuned."),
        ("Dimensional Mark", "Leave a trace of your being across planes or timelines."),
        ("Temporal Echo", "Create a brief phantom imprint of your presence in the recent past."),
        ("Gravity Shift", "Manipulate space around you with the weight of your aura."),
        ("Existential Pressure", "Cause unease or confusion through your overwhelming essence."),
        ("Ethereal Presence", "Remain faintly perceptible to entities in other planes."),
        ("Crown of Will", "Manifest an intangible symbol of authority only seen by the worthy."),
        ("Void Touch", "Influence others with the emptiness beyond existence."),
        ("Reality Pulse", "Disrupt minor illusions or glamours passively with your presence."),
        ("Soul Glare", "Expose flaws or intentions with a gaze that pierces the spirit."),
        ("Rage Conduit", "Channel raw anger to temporarily intensify your aura or influence."),
        ("Aura of Sorrow", "Weaken enemies or evoke empathy through emotional heaviness."),
        ("Resonance of Joy", "Lift allies' spirits and morale through radiant emotional projection."),
        ("Purity Field", "Radiate an incorruptible presence that wards off deceit and corruption."),
        ("presence of impurity", "Drown out life and love around you, bringing chaos and hatred towards your presence"),
        ("Empathic Weight", "Subtly transfer the burden of your emotions to others."),
        ("Emotional Anchor", "Stabilize the emotional state of nearby allies or self during crisis.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO presence_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_presence_skills()
