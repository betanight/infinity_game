# Infinity Game Dashboard

The Infinity Game Dashboard is a modular character manager and stat visualizer built for deep skill-based RPG campaigns. It supports character creation, stat progression, and a dynamic radial skill tree that visually reflects chosen abilities in real time.

---

## 📌 Current System Design

Characters are stored in a centralized Firebase Realtime Database:

- All characters are saved under `characters/{name}`
- Each character tracks their primary/secondary stat values and individual skill levels
- A shared skill template is used to determine what skills exist and how they affect calculations

This centralized setup ensures fast querying, simple scaling, and a unified system for both character management and visualization.

---

## 💡 Feature Overview

### 1. 🎭 Character Creation

Characters are created by selecting one skill from each of the six primary stats: Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. These choices immediately affect their derived stats such as damage, armor, movement speed, and accuracy — calculated using formula functions in the backend.

![Character Creation](images/mainTemplate.png)

---

### 2. 📚 Skill Template

The complete list of available skills is pulled from the static skill template stored in Firebase. Each stat section is collapsible and includes rich descriptions of what each skill does — including combat effects, passive bonuses, or defensive utility.

![Skill Descriptions](images/skillDescriptions.png)

---

### 3. 🧙 Jason's Tree View

This is Jason's personal skill tree. You can see he selected **Ambidexterity**, a Dexterity skill that improves melee accuracy and provides an armor bonus. Only skills that the character has invested in are shown in full color — all others remain gray until selected.

![Jason Tree](images/zoomedTree.png)

---

### 4. 🌐 Full Skill Tree View

This is the complete, zoomed-out view of the skill tree. Each stat occupies a radial slice of the circle, and every available skill is pre-rendered in place. Stats are color-coded, but only selected skills receive their stat’s color — all others remain dimmed for clarity.

![Full Skill Tree](images/fullJasonTree.png)

---

## 🛠 Technologies Used

- **Firebase Realtime Database** – Central data store for all characters and templates
- **D3.js** – SVG-based visualization for the radial skill tree
- **Vanilla JS + HTML/CSS** – No framework overhead
- **Vite** – Fast frontend bundler with native ESM and live reload

---

## 🚧 Future Plans

- Add interactive skill leveling in the tree view (per stat point)
- Filter or highlight skills by tag or effect (e.g. damage, armor, accuracy)
- Race/class-specific skillsets
- Exportable character sheets
- Admin-only edit mode for skill assignment

---

## Vision for the Future

Here we can see the same skill tree as before just zoomed out. This is how I envision every tree looking, like a galaxy of options. I plan to have at least 10 total.

![Vision](images/futureVision.png)

---

## 📁 Folder Structure

- `frontend/`
  - `index.html` – Character creation and overview
  - `app.js` – Core logic for character management
  - `scripts/` – Skill equations and Firebase config
  - `skilltree/` – Visual tree display powered by D3
    - `index.html`, `main.js`, `dag.js`, `style.css`
- `firebase/` – Tools for pushing/pulling the skill template
- `images/` – README screenshots
- `system_database/` – Legacy Python skill table generators (to be converted)

---

## 🔧 Local Development

### Prerequisites
- Node.js (v14+)
- npm

### Setup

```bash
cd frontend
npm install
npm run dev
