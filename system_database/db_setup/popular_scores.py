import sqlite3

def insert_primary_scores(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    primary_stats = [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma'
    ]

    cursor.executemany("INSERT OR IGNORE INTO primary_scores (name) VALUES (?)", [(stat,) for stat in primary_stats])
    conn.commit()
    conn.close()

def insert_secondary_scores(db_filename):
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    secondary_stats = [
        'Willpower',
        'Spirit',
        'Instinct',
        'Presence'
    ]

    cursor.executemany("INSERT OR IGNORE INTO secondary_scores (name) VALUES (?)", [(stat,) for stat in secondary_stats])
    conn.commit()
    conn.close()

if __name__ == "__main__":
    insert_primary_scores("infinity_game.db")
    insert_secondary_scores("infinity_game.db")
