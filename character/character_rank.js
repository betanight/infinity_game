const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const primaryStats = {
  Strength: "strength_skills",
  Dexterity: "dexterity_skills",
  Constitution: "constitution_skills",
  Intelligence: "intelligence_skills",
  Wisdom: "wisdom_skills",
  Charisma: "charisma_skills"
};

const secondaryStats = {
  Instinct: "instinct_skills",
  Presence: "presence_skills",
  Spirit: "spirit_skills",
  Willpower: "willpower_skills"
};

function getLatestDbFile() {
  const files = fs.readdirSync(".");
  const dbFiles = files.filter(file => file.endsWith("_infinity.db"));
  if (dbFiles.length === 0) throw new Error("No character database found in the current directory.");
  return dbFiles.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}

function createCharacter(name) {
  try {
    const command = `echo '${name}' | python3.11 -m system_database.generate_character`;
    execSync(command, { stdio: "inherit", shell: "/bin/bash" });
  } catch (err) {
    console.error("Failed to create character via Python:", err.message);
  }
}

function allocateInitialSkillPoints(skillChoices) {
  const dbFile = getLatestDbFile();
  const db = new sqlite3.Database(dbFile);

  const allStats = { ...primaryStats, ...secondaryStats };

  db.serialize(() => {
    for (const stat in allStats) {
      const skillTable = allStats[stat];
      const selectedSkill = skillChoices[stat];

      if (!selectedSkill) {
        console.warn(`No skill selected for ${stat}. Skipping.`);
        continue;
      }

      const query = `
        UPDATE ${skillTable}
        SET effective_value = effective_value + 1
        WHERE name = ?
      `;

      db.run(query, [selectedSkill], function (err) {
        if (err) {
          console.error(`Error updating ${selectedSkill} in ${skillTable}:`, err.message);
        } else if (this.changes === 0) {
          console.warn(`Skill '${selectedSkill}' not found in ${skillTable}.`);
        } else {
          console.log(`Allocated 1 point to '${selectedSkill}' in ${stat}.`);
        }
      });
    }
  });

  db.close();
}

module.exports = {
  createCharacter,
  allocateInitialSkillPoints,
  getLatestDbFile,
  primaryStats,
  secondaryStats
};
