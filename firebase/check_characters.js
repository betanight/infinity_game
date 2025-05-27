const { db } = require("./firebase");

async function checkCharacters() {
  try {
    const charactersRef = db.ref("characters");
    const snapshot = await charactersRef.once("value");
    const characters = snapshot.val();

    console.log("\nCharacters in Database:");
    console.log("-------------------");
    
    if (!characters) {
      console.log("No characters found in database");
      return;
    }

    Object.entries(characters).forEach(([name, data]) => {
      console.log(`\nCharacter: ${name}`);
      console.log("Equipment:", data.Equipment ? "Present" : "None");
      if (data.Equipment) {
        Object.entries(data.Equipment).forEach(([type, items]) => {
          console.log(`  ${type}: ${Object.keys(items).length} items`);
        });
      }
    });

  } catch (error) {
    console.error("❌ Error checking characters:", error.message);
    process.exit(1);
  }
}

checkCharacters(); 