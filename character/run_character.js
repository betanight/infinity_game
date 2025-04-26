const fs = require("fs");
const { createCharacter, allocateInitialSkillPoints, primaryStats, getLatestDbFile } = require("./character_rank");
const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function promptUserForSkills(stats, doneCallback) {
  if (!stats || typeof stats !== "object") {
    console.error("❌ primaryStats is undefined or invalid.");
    return;
  }

  const selected = {};
  const statKeys = Object.keys(stats);
  let index = 0;

  function nextStat() {
    if (index >= statKeys.length) {
      doneCallback(selected); // 🔁 Use callback instead of inline
      return;
    }

    const stat = statKeys[index];
    const table = stats[stat];
    getSkillOptionsFromDb(table, (skills) => {
      if (skills.length === 0) {
        console.warn(`No skills available in ${table}`);
        index++;
        nextStat();
        return;
      }

      console.log(`\n${stat} Skills:`);
      skills.forEach((skill, i) => {
        console.log(`${i + 1}. ${skill}`);
      });

      rl.question(`Choose a skill for ${stat} (number or name): `, (answer) => {
        const choiceIndex = parseInt(answer);
        if (!isNaN(choiceIndex) && choiceIndex > 0 && choiceIndex <= skills.length) {
          selected[stat] = skills[choiceIndex - 1];
        } else if (skills.includes(answer)) {
          selected[stat] = answer;
        } else {
          console.log("Invalid choice. Skipping.");
        }
        index++;
        nextStat();
      });
    });
  }

  nextStat();
}


function getSkillOptionsFromDb(tableName, callback) {
  const dbFile = getLatestDbFile();
  const db = new sqlite3.Database(dbFile);

  db.all(`SELECT name FROM ${tableName}`, (err, rows) => {
    db.close();
    if (err) {
      console.error(`Error reading from ${tableName}:`, err.message);
      callback([]);
    } else {
      const skills = rows.map(row => row.name);
      callback(skills);
    }
  });
}

rl.question("What is this adventurer's name?: ", (name) => {
  createCharacter(name);
  const dbName = `${name.split(" ")[0].toLowerCase()}_infinity.db`;

  const waitForDb = setInterval(() => {
    if (fs.existsSync(dbName)) {
      clearInterval(waitForDb);

      // 🔽 Move readline inside so it's accessible in promptUserForSkills
      promptUserForSkills(primaryStats, (selected) => {
        allocateInitialSkillPoints(selected);
        rl.close(); // ✅ Close only after everything is done
      });
    }
  }, 100);
});

