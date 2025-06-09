import { db } from "../firebase/firebase.js";
const readline = require("readline");
const {
  createCharacter,
  allocateSkillPoint,
  getAvailableSkills,
} = require("./character_rank");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is this adventurer's name?: ", async (name) => {
  try {
    await createCharacter(name);

    const primaryStats = [
      "Strength",
      "Dexterity",
      "Constitution",
      "Intelligence",
      "Wisdom",
      "Charisma",
    ];
    for (const stat of primaryStats) {
      const skills = await getAvailableSkills(stat);
      if (skills.length === 0) continue;

      console.log(`\n${stat} Skills:`);
      skills.forEach((skill, idx) => console.log(`${idx + 1}. ${skill}`));

      await new Promise((resolve) => {
        function askSkill() {
          rl.question(
            `Choose a skill for ${stat} (number or type 'skip'): `,
            async (answer) => {
              if (answer.trim().toLowerCase() === "skip") {
                console.log(`⏩ Skipping ${stat} skill allocation for now.`);
                resolve();
                return;
              }

              const choice = parseInt(answer);
              if (!isNaN(choice) && choice >= 1 && choice <= skills.length) {
                const skillChosen = skills[choice - 1];
                await allocateSkillPoint(name, stat, skillChosen);
                console.log(`✅ Skill '${skillChosen}' allocated for ${stat}!`);
                resolve();
              } else {
                console.log(
                  "❌ Invalid choice. Please select a valid number or type 'skip'."
                );
                askSkill(); // Ask again if invalid
              }
            }
          );
        }
        askSkill();
      });
    }

    console.log(
      `\n🎉 All skills processed for ${name}! Character setup complete.`
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    rl.close();
  }
});
