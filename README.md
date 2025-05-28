# Infinity Game Dashboard

The Infinity Game Dashboard is a modular character manager and stat visualizer built for deep skill-based RPG campaigns. It supports character creation, stat progression, and a dynamic radial skill tree that visually reflects chosen abilities in real time.

---

## 🎲 Dungeon Master's Interface

The dashboard provides comprehensive tools for Dungeon Masters to manage their campaign and characters.

![Main Screen](images/mainScreen.png)
*The Dungeon Master's main interface connects directly to Firebase Realtime Database, allowing real-time updates to character data. The interface uses dynamic DOM manipulation to render equipment lists, character rosters, and management controls. Level increases trigger the character progression system, updating available skill points and unlocking new abilities.*

---

### Equipment Management
Creating and managing equipment is straightforward through the intuitive interface:

![Create Axe](images/createAxe.png)
*The equipment creation system uses a modular stat calculation engine. Each weapon property triggers real-time updates to the damage formula, with modifiers being dynamically calculated based on selected attributes and special properties. All equipment data is stored in Firebase with a structured schema for consistent retrieval and modification.*

---

## 🎭 Character Journey

### Character Creation
The journey begins with character creation:

![Character Creation](images/createJason.png)
*Character creation utilizes the Firebase Admin SDK to generate unique character IDs and initialize the base stat structure. The system creates nested objects for primary stats, skill trees, and metadata. Initial skill points are calculated and distributed according to the character's starting configuration.*

---

### Party Management
Characters don't exist in isolation - they're part of a living world:

![Jason and Party](images/jasonAndParty.png)
*The party view leverages Firebase's real-time listeners to maintain synchronized character states. Each character card is dynamically rendered using a component-based system, with live updates to stats and status. The interface uses event delegation for efficient handling of character interactions.*

---

## 📊 Character Development

### Skill Tree System
The heart of character progression is the dynamic skill tree:

![Jason's Skill Tree](images/jasonTree.png)
*The radial skill tree is rendered using a custom SVG generation system. Each node's position is mathematically calculated based on its tier and category. The visualization reads from the character's skill data structure, where skills are organized in a nested object: `skills[stat][tier][category][skill]`. Colors and connections update in real-time as skills are modified.*

---

### Combat Capabilities
Character skills directly influence their combat effectiveness:

![Unarmed Strike](images/unarmedStrike.png)
*Combat calculations use a comprehensive formula system that factors in base stats, skill levels, and equipment modifiers. The hit chance and damage calculations pull from multiple data points in the character object, including primary stats, skill proficiencies, and equipment bonuses. Results update in real-time as any contributing factors change.*

---

### Skill Proficiencies
Beyond combat, characters develop various skills and abilities:

![Jason's Skill Checks](images/jasonSkillChecks.png)
*Skill check modifiers are calculated using the `updateCoreStatTotals` function, which aggregates points from both primary and mystical skill trees. The system maintains separate totals for primary_scores and secondary_scores, with each skill's final modifier being derived from its relevant ability scores and proficiency investments.*

---

### Mystical Arts
Some characters develop supernatural abilities:

![Jason's Presence Mystical](images/jasonPresenceMystical.png)
*The mystical arts system uses a tiered progression structure in the character data model. Each mystical skill tree (like Presence) has its own nested object structure with tiers and categories. The `upgradeMysticalSkill` function handles point allocation, while `calculateRank` factors in the total number of skill trees to determine character power level. The visualization updates through Firebase's real-time listeners.*

---

## 📌 System Architecture

The application is structured as follows:

- **Frontend**: A modern web application built with vanilla JavaScript
- **Backend**: Node.js server with Firebase integration
- **Database**: Firebase Realtime Database for character and game data storage
- **Character System**: Modular system for managing character stats, skills, and equipment
- **Skill Trees**: Multiple specialized skill trees including base attributes and mystical arts

---

## 🗂 Project Structure

```
infinity_game/
├── frontend/           # Main web application
│   ├── equipment/      # Equipment management
│   ├── skilltree/     # Skill tree visualization
│   ├── mystical/      # Mystical arts system
│   └── scripts/       # Core game logic
├── firebase/          # Firebase configuration
├── system_database/   # Game system data
└── character/         # Character management
```

---

## 💡 Core Features

### 1. 🎭 Character Management
- Comprehensive character creation and progression
- Equipment and inventory system
- Stat tracking and calculations
- Multiple skill tree support

### 2. 🌟 Skill Trees
- Base attribute trees (Strength, Dexterity, Constitution, etc.)
- Mystical arts trees (Arcane, Presence, Spirit, Willpower)
- Visual progression tracking
- Multi-tier skill system

### 3. 🛡 Equipment System
- Detailed equipment management
- Stats and bonuses calculation
- Equipment effects on character abilities

### 4. 🎲 Game Systems
- Dynamic stat calculations
- Skill interaction systems
- Character progression tracking
- Admin controls for game management

---

## 🛠 Technologies

- **Frontend**: 
  - Vanilla JavaScript
  - HTML5/CSS3
  - Vite for development and building
- **Backend**:
  - Node.js
  - Firebase Admin SDK
- **Database**:
  - Firebase Realtime Database
- **Development**:
  - Git for version control
  - Modern ES6+ JavaScript

---

## 🎮 Features in Development

- Enhanced character progression systems
- Advanced equipment management
- Expanded mystical arts trees
- Improved UI/UX for skill tree navigation
- Additional admin tools and controls

---

## 🔮 Mystical Arts System

The mystical arts system features multiple specialized trees:

- **Arcane**: Advanced magical abilities and spells
- **Presence**: Character influence and control
- **Spirit**: Spiritual and ethereal powers
- **Willpower**: Mental fortitude and resistance

Each tree contains multiple tiers of progression, offering deep character customization and development paths.

---

## 📱 Interface Features

The dashboard includes various UI components for easy character management:

- Collapsible drawers for detailed information
- Real-time stat updates
- Visual skill tree navigation
- Equipment management interface
- Character status displays

---

For more information about specific features or contributing to the project, please check the documentation in the respective directories.