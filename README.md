# Infinity Game - Skill Tree System

A dynamic and interactive skill tree visualization system built with React, featuring mystical and primary skill progression paths.

## System Overview

### Character Creation & Management
![Character Creation and List](character_and_creation.png)
The character creation interface allows players to create new characters and view their existing roster. Each character can be individually managed and developed through the skill system.

### Character Stats & Progression
![Character Sheet Example](character_sheet.png)
Example character sheet showing Jason's stats and current rank. The rank system (F through SS+) determines which skill tiers are available to the character.

### Skill Trees
![Strength Skill Tree](strength_tiers.png)
Example of the Strength skill tree visualization. Each node represents a skill that can be unlocked and upgraded. Hover tooltips (coming soon) will display:
- Skill name and description
- Current level and effects
- Requirements and prerequisites
- Upgrade costs

### Combat Calculations
![Unarmed Strike Calculations](unarmedStrike.png)
Example of how combat stats like accuracy and damage are calculated using the visible_stat_functions.js system. Skills and attributes combine to determine combat effectiveness.

## Features

- **Dynamic Skill Tree Visualization**: Interactive graph-based visualization using ReactFlow
- **Multiple Skill Categories**: 
  - Primary Skills (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
  - Mystical Skills (Arcane, Willpower, Spirit, Presence)
- **Rank-Based Progression**: Skills unlock based on character rank (F through SS+)
- **Interactive UI**:
  - Zoom and pan controls
  - Mini-map for navigation
  - Skill node tooltips
  - Visual feedback for skill levels
  - Beautiful particle effects and animations

## Tech Stack

- React
- ReactFlow (for graph visualization)
- Chakra UI (for styling and components)
- Firebase (for backend and authentication)
- D3.js (for advanced visualizations)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd infinity_game
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication and Realtime Database
   - Copy your Firebase config to `src/firebaseConfig.js`

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── nodes/         # Custom node components for ReactFlow
│   └── ...
├── pages/
│   └── SkillTreePage.jsx  # Main skill tree visualization
├── frontend/
│   └── skilltree/    # Skill tree logic and data
└── ...
```

## Skill System

### Primary Skills
- Basic attributes that form the foundation of character development
- Organized in tiers (1-5 + Final)
- Each tier requires specific rank to unlock
- Skills provide both passive bonuses and active abilities

### Mystical Skills
- Advanced abilities organized by schools of power
- Tiered progression with category specializations
- Unlocked through character advancement
- Unique effects and combinations possible

### Rank System
- F (Starting) → E → D → C → B → A → S → SS+
- Each rank unlocks new skill tiers
- SS+ required for Final Tier skills
- Rank affects both skill availability and base stats

### Combat System
- Dynamic calculation of combat stats based on skills and attributes
- Accuracy and damage determined by multiple contributing factors
- Skills can modify and enhance combat capabilities
- Detailed tooltips show stat calculations and effects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ReactFlow for the amazing graph visualization library
- Chakra UI for the component system
- Firebase for backend services
- The gaming community for inspiration 