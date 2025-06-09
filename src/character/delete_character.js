import { db } from "../firebase/firebase.js";
import { ref, remove } from "firebase/database";
import { createInterface } from "readline";

async function deleteCharacter(name) {
  try {
    const characterRef = ref(db, `characters/${name.toLowerCase()}`);
    await remove(characterRef);
    console.log(`🗑️ Character '${name}' deleted successfully!`);
  } catch (err) {
    console.error(`❌ Failed to delete character '${name}':`, err.message);
  }
}

// Only run if used directly, not when imported
if (import.meta.url === new URL(import.meta.url).href) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the character name to delete: ", async (name) => {
    await deleteCharacter(name);
    rl.close();
  });
}

export { deleteCharacter };
