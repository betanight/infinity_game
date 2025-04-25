import sqlite3

def insert_wisdom_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

        # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE wisdom_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS wisdom_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            current_value INTEGER DEFAULT 0
        )
    """)

    skills = [
        ("Insight", "Discern motives or emotional states. Related to 'Empathic Weight' in Presence but based on observation rather than emotional projection."),
        ("Practical Judgment", "Make sound decisions in real-world or uncertain scenarios. Distinct from 'Logic' in Intelligence, which is theoretical."),
        ("Situational Awareness", "Remain conscious of surroundings and dynamic shifts. Related to 'Natural Awareness' in Instinct but more cognitive."),
        ("Pattern Recognition", "Identify behavioral or environmental trends. Complements 'Knowledge Synthesis' in Intelligence with an intuitive edge."),
        ("Patience Discipline", "Hold off impulsive action in favor of better timing. Related to 'Impulse Resistance' in Willpower with more observational intent."),
        ("Experience Recall", "Draw on life lessons for use in similar circumstances. Complements 'Memory Recall' in Intelligence but more contextual."),
        ("Moral Discernment", "Assess right and wrong in ethically gray situations. Tied to alignment and judgment, separate from intellectual analysis."),
        ("Crisis Perception", "Recognize long-term consequences during moments of tension. Complements 'Crisis Command' in Willpower from a non-leadership perspective."),
        ("Spiritual Intuition", "Sense truths beyond logic or perception. Related to 'Awakened Spirit' but grounded in personal wisdom."),
        ("Conflict De-escalation", "Calm volatile exchanges through wise mediation. Related to 'Diplomacy' in Charisma but done through grounded presence."),
        ("Lesson Retention", "Apply previously learned insights instinctively in similar scenarios. Complements 'Experience Recall' but more long-term."),
        ("Consequential Thinking", "Predict possible outcomes based on wisdom and prior knowledge. Differs from 'Strategic Foresight' in Intelligence by leaning on experience."),
        ("Interpersonal Balance", "Mediate relationships or team tension using calm authority. Similar to 'Harmonize' in Spirit, but socially directed."),
        ("Observation Logging", "Retain and mentally catalog significant visual or verbal cues."),
        ("Cultural Fluency", "Understand customs, etiquette, and values from lived or taught experiences. Differs from 'Linguistics' in Intelligence as it's behavior-based."),
        ("Introspective Growth", "Learn from personal failure or hardship to improve decision-making."),
        ("Guidance Instinct", "Naturally offer appropriate advice or reassurance based on perceived need."),
        ("Caution Awareness", "Recognize when a situation may require restraint or retreat. Complements 'Danger Sense' in Instinct but without reflexive reaction."),
        ("Memory Anchoring", "Solidify specific memories for later use without reliance on logic. Related to 'Memory Lock' in Willpower but not defensive."),
        ("Foresight Temperance", "Maintain calm by relying on past experience to interpret chaotic events."),
        ("Mentorship Awareness", "Identify opportunities to learn from others' actions or teachings. Complements 'Lesson Retention' with a social learning emphasis."),
        ("Absorptive Listening", "Gain understanding and insight by deeply processing others’ words. Distinct from 'Focus Control' in Willpower as it’s reflective, not restrictive."),
        ("Wisdom Reception", "Accept and apply guidance or knowledge shared by others without ego. Complements 'Guidance Instinct' but from the learner’s perspective.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO wisdom_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_wisdom_skills()
