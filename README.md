# Infinity Game Character System

The Infinity Game character system is a dynamic framework for building customizable RPG characters based on a deep skill tree structure. Each character starts with a unique SQLite database that tracks their stats, chosen skills, and growth across multiple core attributes.

## 🔧 System Overview

This project is powered by a hybrid **Python + JavaScript** backend. Python handles database creation and schema design, while JavaScript enables dynamic character interaction, skill point allocation, and database updates.

Each character is created using a prompt and automatically receives:

- A dedicated SQLite database (`{first_name}_infinity.db`)
- All **primary stats** set to 1: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma
- All **secondary stats** set to 0: Instinct, Presence, Spirit, Willpower
- Access to a large skill tree with stat-specific branches
- Ability to choose 1 skill per primary stat at level 0

## 👤 Example Character: Jason

Upon creating Jason, the user is guided through a prompt that lets them choose one skill for each of the six primary stats.

### Skill Choices

Below is a view of the skills Jason selected during creation:

![Jason's Chosen Skills](images/character_choices.png)

Each skill is tied to a primary stat and begins with a single point.

### Constitution Skill Tree Example

During the constitution selection, Jason chose "Vitality". Here’s a snapshot of other options he could have selected instead:

![Constitution Skill Options](images/constitution_skill_example.png)

This shows the depth of customization available at every stat node. Each skill has a description, an `effective_value`, and can later gain modifiers or dependencies.

### Jason's Current Profile

Once created and skills are selected, Jason's database stores his full stat distribution and skill progress:

![Jason's Stats](images/jason_value.png)

The system supports expanding or leveling up over time, allowing Jason to grow new skills based on class, race, and story triggers.

## ⚙️ Technical Features

- **Database-per-character** system architecture
- Modular skill trees with future dependency & modifier tracking
- Passive skill design inspired by tabletop and video game RPGs
- Auto-generated schema with static placeholder values for future progression
- All actions admin-controlled; characters cannot modify their data directly

---

This repository will continue to grow with UI elements, race/class integration, and campaign-linked world events that affect character progression.