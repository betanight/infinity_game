import sqlite3
from system_database.db_setup.character_functions import create_character

def list_all_characters():
    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, level FROM characters GROUP BY name")
    characters = cursor.fetchall()

    if not characters:
        print("No characters found.")
        conn.close()
        return

    for char_id, name, level in characters:
        print(f"\n{name} (Level {level})")

        cursor.execute("""
            SELECT primary_scores.name, character_primary_stats.current_value
            FROM character_primary_stats
            JOIN primary_scores ON character_primary_stats.score_id = primary_scores.id
            WHERE character_primary_stats.character_id = ?
        """, (char_id,))
        print("Primary Scores:")
        for stat, value in cursor.fetchall():
            print(f"  {stat}: {value}")

        cursor.execute("""
            SELECT secondary_scores.name, character_secondary_stats.current_value
            FROM character_secondary_stats
            JOIN secondary_scores ON character_secondary_stats.score_id = secondary_scores.id
            WHERE character_secondary_stats.character_id = ?
        """, (char_id,))
        print("Secondary Scores:")
        for stat, value in cursor.fetchall():
            print(f"  {stat}: {value}")

    conn.close()

def main():
    while True:
        print("\nMenu:")
        print("1. Create new character")
        print("2. View all characters")
        print("3. Exit")

        choice = input("Enter your choice: ")

        if choice == "1":
            name = input("Enter character name: ")
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM characters WHERE name = ?", (name,))
            if cursor.fetchone():
                print(f"Character '{name}' already exists.")
            else:
                create_character(name)
                print(f"Character '{name}' created.")
            conn.close()
        elif choice == "2":
            list_all_characters()
        elif choice == "3":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()