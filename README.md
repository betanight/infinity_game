# Infinity Game Dashboard

The Infinity Game Dashboard is a modular character manager and stat visualizer built for deep skill-based RPG campaigns. It supports character creation, stat progression, and a dynamic radial skill tree that visually reflects chosen abilities in real time.

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