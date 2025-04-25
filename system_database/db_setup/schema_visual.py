import sqlite3
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt


conn = sqlite3.connect(db_filename)

# Query to fetch character to primary stat relationships
df = pd.read_sql_query("""
SELECT c.name AS character, ps.name AS stat
FROM characters c
JOIN character_primary_stats cps ON c.id = cps.character_id
JOIN primary_scores ps ON cps.score_id = ps.id
""", conn)

conn.close()

# Create the graph
G = nx.Graph()
for _, row in df.iterrows():
    G.add_edge(row["character"], row["stat"])

# Plot the graph
plt.figure(figsize=(12, 8))
nx.draw(
    G,
    with_labels=True,
    node_color='lightblue',
    edge_color='gray',
    node_size=2200,
    font_size=10
)
plt.title("Character ↔ Primary Stat Relationships")
plt.tight_layout()
plt.show()