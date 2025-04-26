const { db } = require("../firebase/firebase");

async function deleteCharacter(name) {
  try {
    await db.ref(`characters/${name.toLowerCase()}`).remove();
    console.log(`🗑️ Character '${name}' deleted successfully!`);
  } catch (err) {
    console.error(`❌ Failed to delete character '${name}':`, err.message);
  }
}

// Only run if used directly, not when imported
if (require.main === module) {
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("Enter the character name to delete: ", async (name) => {
    await deleteCharacter(name);
    rl.close();
  });
}

module.exports = { deleteCharacter };