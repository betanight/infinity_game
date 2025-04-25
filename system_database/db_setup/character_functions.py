import sqlite3

class Character:
    def __init__(self, name):
        self.name = name

        self.strength = 1
        self.dexterity = 1
        self.constitution = 1
        self.intelligence = 1
        self.wisdom = 1
        self.charisma = 1

        self.willpower = 0
        self.spirit = 0
        self.instinct = 0
        self.presence = 0

    def increase_stat(self, stat_name, amount):
        if hasattr(self, stat_name):
            setattr(self, stat_name, getattr(self, stat_name) + amount)

    def decrease_stat(self, stat_name, amount):
        if hasattr(self, stat_name):
            setattr(self, stat_name, getattr(self, stat_name) - amount)

    def set_stat(self, stat_name, new_value):
        if hasattr(self, stat_name):
            setattr(self, stat_name, new_value)

    def get_stat(self, stat_name):
        if hasattr(self, stat_name):
            return getattr(self, stat_name)
        return None

def create_character(name, db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO characters (name, level) VALUES (?, ?)", (name, 0))
    character_id = cursor.lastrowid

    cursor.execute("SELECT id FROM primary_scores")
    primary_ids = [row[0] for row in cursor.fetchall()]
    for score_id in primary_ids:
        cursor.execute(
            "INSERT INTO character_primary_stats (character_id, score_id, current_value) VALUES (?, ?, ?)",
            (character_id, score_id, 1)
        )

    cursor.execute("SELECT id FROM secondary_scores")
    secondary_ids = [row[0] for row in cursor.fetchall()]
    for score_id in secondary_ids:
        cursor.execute(
            "INSERT INTO character_secondary_stats (character_id, score_id, current_value) VALUES (?, ?, ?)",
            (character_id, score_id, 0)
        )

    conn.commit()
    conn.close()

def view_character(name, db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM characters WHERE name = ?", (name,))
    result = cursor.fetchone()
    if not result:
        print(f"Character '{name}' not found.")
        conn.close()
        return

    character_id = result[0]
    print(f"\n{name}'s Stats")

    cursor.execute("""
        SELECT primary_scores.name, character_primary_stats.current_value
        FROM character_primary_stats
        JOIN primary_scores ON character_primary_stats.score_id = primary_scores.id
        WHERE character_primary_stats.character_id = ?
    """, (character_id,))
    print("\nPrimary Scores:")
    for stat, value in cursor.fetchall():
        print(f"{stat}: {value}")

    cursor.execute("""
        SELECT secondary_scores.name, character_secondary_stats.current_value
        FROM character_secondary_stats
        JOIN secondary_scores ON character_secondary_stats.score_id = secondary_scores.id
        WHERE character_secondary_stats.character_id = ?
    """, (character_id,))
    print("\nSecondary Scores:")
    for stat, value in cursor.fetchall():
        print(f"{stat}: {value}")

    conn.close()