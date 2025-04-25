import sqlite3

conn = sqlite3.connect("infinity_game.db")
cursor = conn.cursor()

print("Primary Scores:")
for row in cursor.execute("SELECT * FROM primary_scores"):
    print(row)

print("\nSecondary Scores:")
for row in cursor.execute("SELECT * FROM secondary_scores"):
    print(row)

conn.close()
