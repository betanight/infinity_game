import { renderSkillTree } from "./dag.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js";
import { createSkillCheckDrawer } from "./skill_checks.js";
import { createCoreCheckDrawer } from "./core_checks.js";
import { updateCoreStatTotals } from "../levelUp/levelingFunctions.js";

const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

async function loadCharacter(name) {
  try {
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
  } catch (error) {
    console.error("Error loading character:", error);
  }
}

// Wait for auth state before loading character
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("👤 skilltree auth user:", user.uid);
    if (characterName) {
      loadCharacter(characterName);
    }
  } else {
    console.log("Not signed in");
    // Optionally show a message or redirect to login
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h2>Please sign in to view character details</h2>
        <p>You need to be signed in to view this page.</p>
        <a href="/" style="color: #0af;">Return to Dashboard</a>
      </div>
    `;
  }
});
