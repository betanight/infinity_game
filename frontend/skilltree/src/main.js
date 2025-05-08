import { renderSkillTree } from "./dag.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./firebaseConfig.js";

const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function loadCharacter(name) {
  const snapshot = await get(ref(db, `characters/${name.toLowerCase()}`));
  if (snapshot.exists()) {
    const characterData = snapshot.val();
    console.log("✅ Loaded character:", characterData);
    renderSkillTree(characterData);
  } else {
    console.error("❌ Character not found");
  }
}

if (characterName) {
  loadCharacter(characterName);
}
