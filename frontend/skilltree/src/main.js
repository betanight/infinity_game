import "./dag.js";
import { getDatabase, ref, child, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../scripts/firebaseConfig.js";

const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function loadCharacter(name) {
  const snapshot = await get(ref(db, `characters/${name.toLowerCase()}`));
  if (snapshot.exists()) {
    const characterData = snapshot.val();
    console.log("Loaded character:", characterData);
    // ⚡️ Now pass it to your skill tree rendering logic
  } else {
    console.error("Character not found");
  }
}

if (characterName) {
  loadCharacter(characterName);
}
