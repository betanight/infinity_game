import sqlite3

def create_tables(db_filename):
    conn = sqlite3.connect(db_filename)
    with open("system_database/db_setup/init_stat_tree.sql", "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_tables("infinity_game.db")
