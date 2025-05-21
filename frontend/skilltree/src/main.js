import { renderSkillTree } from "./dag.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./firebaseConfig.js";
import { createSkillCheckDrawer } from "./skill_checks.js";
import { createCoreCheckDrawer } from "./core_checks.js";
import { updateCoreStatTotals } from "../levelUp/levelingFunctions.js";

const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function loadCharacter(name) {
  const snapshot = await get(ref(db, `characters/${name.toLowerCase()}`));
  if (snapshot.exists()) {
    const characterData = snapshot.val();
    await updateCoreStatTotals(characterData.meta.character_id);
    console.log("✅ Loaded character:", characterData);
    renderSkillTree(characterData);
    createSkillCheckDrawer(characterData);
    createCoreCheckDrawer(characterData);
  } else {
    console.error("❌ Character not found");
  }
}

if (characterName) {
  loadCharacter(characterName);
}
