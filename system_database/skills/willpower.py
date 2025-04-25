import sqlite3

def insert_willpower_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE willpower_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS willpower_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Mental Endurance", "Resist fatigue from long mental or emotional strain. Related to 'Spiritual Fortitude' from Spirit but more mental in nature."),
        ("Focus Control", "Sustain attention and ignore distractions in high-pressure scenarios. Similar to 'Meditative Focus' in Spirit but more concentration-based."),
        ("Emotional Regulation", "Maintain composure through self-discipline during emotional spikes. Complements 'Emotional Anchor' in Presence but focuses internally."),
        ("Pain Denial", "Diminish the mental impact of physical discomfort or pain. Overlaps slightly with 'Resilience Rituals' in Spirit but is reflexive."),
        ("Fear Resistance", "Reduce susceptibility to fear-based effects or panic. Related to 'Fear Resistance' in Constitution, focused more on emotional will."),
        ("Discipline Training", "Uphold consistent habits and routines regardless of setbacks."),
        ("Impulse Resistance", "Avoid compulsive or hasty actions when under pressure. Complements 'Impulse Action' in Instinct by acting in opposition."),
        ("Willful Stamina", "Push beyond your limits through sheer mental determination. Expands upon 'Will of the Ancients' in Spirit by being self-driven."),
        ("Conviction", "Strengthen belief-driven action, increasing resolve under adversity. Related to 'Crown of Will' in Presence with an internal drive."),
        ("Stress Adaptation", "Adjust to new or overwhelming environments through practiced mental control. Overlaps with 'Stress Resistance' in Constitution."),
        ("Memory Lock", "Secure specific memories from mental intrusion or stress-related loss. Complements 'Memory Recall' in Intelligence with defensive utility."),
        ("Resist Influence", "Withstand charm, persuasion, or suggestion through strong inner resolve. Related to 'Resonance of Joy' and 'Aura of Sadness' in Presence."),
        ("Ritual Focus", "Stay present and steady during complex or time-consuming rituals. Mirrors 'Ritual Empowerment' in Spirit with a discipline slant."),
        ("Will Chain", "Link your internal willpower to an objective, making it harder to sway your course. Related to 'Conviction' but more binding in nature."),
        ("Resolve Restoration", "Recover from will-breaking trauma with practiced resilience. Complements 'Resolve Recovery' from Wisdom (if created)."),
        ("Stoic Presence", "Exude unshakable calm even in terrifying or chaotic circumstances. Overlaps with 'Stoic Presence' in Presence with internal emphasis."),
        ("Unyielding Mind", "Block repeated mental pressures through hardened discipline. Complements 'Unshakable Presence' but focuses on inner resistance."),
        ("Burnthrough Will", "Briefly overwhelm pain or fear through intentional force of thought. Related to 'Burnthrough' abilities in Constitution or Spirit."),
        ("Inner Defiance", "Stand firm against dominating or oppressive influences. Related to 'Inner Flame' in Spirit with more confrontational application."),
        ("Crisis Command", "Maintain leadership and initiative during high-stakes or morale-breaking events. Similar to 'Battlefield Presence' in Presence with leadership focus."),
        ("Last Stand", "Stay conscious and functional through sheer willpower even when the body is too fatigued or injured to continue. Overlaps with 'Willful Stamina' but focused on moments of collapse.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO willpower_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_willpower_skills()
