import sqlite3
import sys
import os

# Ensure skill modules are recognized as a package
skills_init_path = os.path.join(os.path.dirname(__file__), "skills", "__init__.py")
if not os.path.exists(skills_init_path):
    open(skills_init_path, 'a').close()

# Import character and score setup functions
from system_database.db_setup.setup_database import create_tables
from system_database.db_setup.popular_scores import insert_primary_scores, insert_secondary_scores
from system_database.db_setup.create_skill_tables import create_skill_tables
from system_database.db_setup.character_functions import create_character

# Import all skill inserts
from system_database.skills.charisma import insert_charisma_skills
from system_database.skills.constitution import insert_constitution_skills
from system_database.skills.dexterity import insert_dexterity_skills
from system_database.skills.intelligence import insert_intelligence_skills
from system_database.skills.instinct import insert_instinct_skills
from system_database.skills.presence import insert_presence_skills
from system_database.skills.spirit import insert_spirit_skills
from system_database.skills.strength import insert_strength_skills
from system_database.skills.willpower import insert_willpower_skills
from system_database.skills.wisdom import insert_wisdom_skills

def generate_character_db(character_name):
    first_name = character_name.split()[0].lower()
    db_filename = f"{first_name}_infinity.db"

    conn = sqlite3.connect(db_filename)
    cursor = conn.cursor()

    create_tables(db_filename)
    insert_primary_scores(db_filename)
    insert_secondary_scores(db_filename)
    create_skill_tables(db_filename)

    insert_charisma_skills(db_filename)
    insert_constitution_skills(db_filename)
    insert_dexterity_skills(db_filename)
    insert_intelligence_skills(db_filename)
    insert_instinct_skills(db_filename)
    insert_presence_skills(db_filename)
    insert_spirit_skills(db_filename)
    insert_strength_skills(db_filename)
    insert_willpower_skills(db_filename)
    insert_wisdom_skills(db_filename)

    cursor.execute("SELECT 1 FROM characters WHERE name = ?", (character_name,))
    if cursor.fetchone():
        print(f"Character '{character_name}' already exists. Skipping creation.")
    else:
        create_character(character_name, db_filename)
        print(f"You have created a new character at level 0! Welcome, {character_name}.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        character_name = sys.argv[1]
    else:
        character_name = input("You have created a new character at level 0! What is this adventurer's name?: ")

    generate_character_db(character_name)
