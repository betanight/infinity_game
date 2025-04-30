# Infinity Game Dashboard

The Infinity Game Dashboard is a custom character manager designed for tabletop RPG campaigns with deep skill-based progression. This interface allows a Game Master to create characters, assign them starting skills, and track their growth over time — all connected to a central Firebase backend.

---

## 📌 Current System Design

Originally, each character was intended to have their own individual Firebase database. However, through iteration we realized this approach introduced unnecessary complexity and overhead. We have now transitioned to a **single shared database**, where:

- All characters are stored under one path (`characters/{name}`)
- Each character has their own skill allocations and stat values
- The dashboard pulls everything from this centralized structure

This makes the system easier to scale, faster to query, and much more efficient to maintain.

---

## 💡 Dashboard Features

### 🔧 Create Characters

Characters can be created by choosing one skill from each of the six primary ability scores: Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. Each selected skill is initialized at level 0.

![Create Character](images/create_character.png)

---

### 📖 Skill Descriptions

The skill template is automatically pulled from Firebase and shown in a scrollable, collapsible format. Each stat displays its available skills and their descriptions.

![Skill Descriptions](images/skill_descriptions.png)

---

### 🧙 Character Overview

Each character displays:
- Their name
- The total number of skill points they've allocated (in parentheses)
- A collapsible list of the skills they've selected and their current levels

This streamlined format allows for quick GM reference without clutter.

![Character Sheet](images/jason_improved.png)

---

## 🛠 Technologies Used

- **Firebase Realtime Database** for centralized data
- **Vanilla JavaScript** for frontend logic
- **HTML/CSS** for structure and layout
- Lightweight design for fast load and portability

---

## 🚧 Future Plans

- Add skill upgrading functionality per stat point
- Visualize skill trees by core stat
- Add support for race/class-specific skills
- Printable/exportable character sheets

---

## 📁 Folder Structure

backend/
  └── Contains abbreviation mappings and visible stat functions
      used in calculating accuracy, damage, and other formulas.

character/
  └── Backup scripts for creating, deleting, and displaying characters.
      Kept for reference but no longer used in main workflow.

firebase/
  └── push_template.js / pull_template.js — tools to modify or log the static skill template.
      firebaseKey.json — authentication credentials for Firebase access.

frontend/
  └── index.html / app.js — main dashboard UI and logic for skill selection and character display.

images/
  └── Screenshots used for README documentation and visual references.

system_database/skills/
  └── Original Python-based skill tables for each stat.
      These will eventually be ported to JavaScript to unify the system.
