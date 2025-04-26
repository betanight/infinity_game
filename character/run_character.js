const { db } = require("../firebase/firebase");
const readline = require("readline");
const { createCharacter, allocateSkillPoint, getAvailableSkills } = require("./character_rank");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Start by asking for character name
rl.question("What is this adventurer's name?: ", async (name) => {
  try {
    await createCharacter(name);

    const primaryStats = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
    for (const stat of primaryStats) {
      const skills = await getAvailableSkills(stat);
      if (skills.length === 0) continue;

      console.log(`\n${stat} Skills:`);
      skills.forEach((skill, idx) => console.log(`${idx + 1}. ${skill}`));

      await new Promise(resolve => {
        rl.question(`Choose a skill for ${stat} (number): `, async (answer) => {
          const choice = parseInt(answer);
          if (!isNaN(choice) && choice >= 1 && choice <= skills.length) {
            const skillChosen = skills[choice - 1];
            await allocateSkillPoint(name, stat, skillChosen);
          } else {
            console.log("Invalid choice, skipping.");
          }
          resolve();
        });
      });
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    rl.close();
  }
});
