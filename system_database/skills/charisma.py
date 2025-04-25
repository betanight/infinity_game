import sqlite3

def insert_charisma_skills(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    # Add column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE charisma_skills ADD COLUMN effective_value INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass  # Column already exists

    skills = [
        ("Persuasion", "Convince others through logic, charm, or presence."),
        ("Deception", "Mislead or bluff others with lies or half-truths."),
        ("Performance", "Entertain through music, drama, dance, or storytelling."),
        ("Intimidation", "Coerce others through threats, posture, or fear."),
        ("Charm", "Naturally influence others to be friendly or cooperative."),
        ("Public Speaking", "Deliver inspiring or commanding speeches to groups."),
        ("Diplomacy", "Navigate tense or political situations peacefully."),
        ("Leadership", "Command respect and direct others effectively."),
        ("Seduction", "Use allure or flirtation to manipulate or persuade."),
        ("Lie Detection", "Discern dishonesty through intuition and body language."),
        ("Storyweaving", "Tell engaging, multi-layered narratives to captivate listeners."),
        ("Haggle", "Negotiate for better prices or trade deals in markets and bartering."),
        ("Rally Troops", "Boost morale of allies in combat or tense situations."),
        ("Oratory", "Persuade crowds with impassioned public addresses."),
        ("Feign Innocence", "Appear harmless or misunderstood in hostile situations."),
        ("Smooth Talk", "Subtly deflect or redirect uncomfortable conversations."),
        ("Courtly Etiquette", "Navigate noble or upper-class interactions flawlessly."),
        ("Inspire Courage", "Empower allies to resist fear and doubt."),
        ("Gossip Management", "Control the flow and tone of rumors."),
        ("Audience Reading", "Adjust tone and message based on the people around you."),
        ("Stage Presence", "Dominate a room or performance space without speaking."),
        ("Mock Duel", "Entertain or challenge with wit-based verbal contests."),
        ("Flattery", "Earn favor with sincere or strategic compliments."),
        ("Debate", "Win logical or emotional arguments in structured forums."),
        ("Disguise Demeanor", "Pretend to be of a different status, class, or intention."),
        ("Magical Influence", "Weave magical charm into conversations or negotiations."),
        ("Read the Room", "Quickly assess social tension and power dynamics."),
        ("Boast", "Gain reputation by skillfully bragging about achievements."),
        ("Soul Resonance", "Empathically connect to someone’s deeper feelings."),
        ("Ambassadorial Presence", "Represent a cause, group, or kingdom diplomatically.")
    ]

    cursor.executemany("""
        INSERT OR IGNORE INTO charisma_skills (name, description)
        VALUES (?, ?)
    """, skills)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_charisma_skills()
