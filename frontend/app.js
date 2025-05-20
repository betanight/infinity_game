import visibleStatEquations from "./scripts/visible_stat_equations.js";
import { firebaseConfig } from "./skilltree/src/firebaseConfig.js";
import {
  upgradeSkill,
  downgradeSkill,
  getCharacterData,
  calculateRank,
} from "./skilltree/levelUp/levelingFunctions.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let primaryStats = [];
let skillsData = {};

function loadTemplate() {
  const output = document.getElementById("template-output");
  output.innerHTML = "<p>Loading...</p>";

  db.ref("template")
    .once("value")
    .then((templateSnapshot) => {
      const template = templateSnapshot.val();
      if (!template || !template.primary_scores) {
        output.innerHTML = "<p>Template missing or malformed.</p>";
        return;
      }

      primaryStats = Object.keys(template.primary_scores);
      return db.ref("template/skills").once("value");
    })
    .then((snapshot) => {
      skillsData = snapshot.val();
      if (!skillsData) {
        output.innerHTML = "<p>No skill data found in template.</p>";
        return;
      }

      let html = "";

      function buildSection(stat) {
        if (skillsData[stat]) {
          html += `
            <details style="margin-bottom: 1rem;">
              <summary style="font-weight: bold; text-decoration: underline; font-size: 1.2rem; cursor: pointer;">${stat}</summary>
              <ul style="margin-left: 1rem; margin-top: 0.5rem;">`;

          const statSkills = skillsData[stat];
          for (const skill in statSkills) {
            const desc = statSkills[skill].description || "No description";
            html += `<li style="margin-bottom: 0.3rem;"><strong>${skill}</strong>: ${desc}</li>`;
          }

          html += `</ul></details>`;
        }
      }

      primaryStats.forEach((stat) => buildSection(stat));
      output.innerHTML = html;

      populateSkillDropdowns(skillsData);
      loadCharacters();
    })
    .catch((err) => {
      output.innerHTML = "<p>Error loading template or skills.</p>";
    });
}

function populateSkillDropdowns(skillsData) {
  primaryStats.forEach((stat) => {
    const select = document.getElementById(`skill-select-${stat}`);
    const skillList = skillsData[stat];

    if (!select || !skillList) return;

    select.innerHTML = `<option value="">-- Choose a ${stat} skill --</option>`;
    for (const skill in skillList) {
      const option = document.createElement("option");
      option.value = skill;
      option.textContent = skill;
      select.appendChild(option);
    }
  });
}

function attachCreateForm() {
  const form = document.getElementById("create-character-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("new-character-name").value.trim();
    if (!name) return alert("Please enter a character name.");

    const templateRef = db.ref("template");
    const templateSnapshot = await templateRef.once("value");
    const template = templateSnapshot.val();

    if (!template || !template.primary_scores) {
      return alert("No valid template found in Firebase.");
    }

    template.meta.character_id = name;
    template.skills = {};

    let allChosen = true;

    primaryStats.forEach((stat) => {
      const select = document.getElementById(`skill-select-${stat}`);
      const selectedSkill = select?.value?.trim();

      if (!selectedSkill) {
        allChosen = false;
      } else {
        template.skills[stat] = {
          [selectedSkill]: 1,
        };
      }
    });

    if (!allChosen)
      return alert("Please choose a skill for every primary stat.");

    await db.ref(`characters/${name.toLowerCase()}`).set(template);

    alert(`Character '${name}' created!`);
    form.reset();
    loadCharacters();
  });
}

function flattenSkills(skills) {
  const flat = {};
  Object.values(skills).forEach((skillGroup) => {
    Object.entries(skillGroup).forEach(([name, val]) => {
      flat[name] = val;
    });
  });
  return flat;
}

function loadCharacters() {
  const list = document.getElementById("character-list");
  list.innerHTML = "<li>Loading...</li>";

  db.ref("characters")
    .once("value")
    .then((snapshot) => {
      const characters = snapshot.val();
      list.innerHTML = "";

      if (!characters) {
        list.innerHTML = "<li>No characters found.</li>";
        return;
      }

      Object.entries(characters).forEach(([name, data]) => {
        const skills = data.skills || {};
        const totalUsedPoints = Object.values(skills).reduce((sum, group) => {
          return sum + Object.values(group).reduce((a, b) => a + b, 0);
        }, 0);

        let available = data.meta?.available_skill_points || 0;
        let totalAvailable = available + totalUsedPoints;

        const characterLi = document.createElement("li");
        characterLi.style.cursor = "pointer";

        // Header with name + editable total points
        const header = document.createElement("div");
        header.innerHTML = `<strong>${name}</strong> <span style="margin-left: 1rem;">Total Points:</span>`;

        const decrement = document.createElement("button");
        decrement.textContent = "−";
        decrement.style.margin = "0 0.3rem";

        const counter = document.createElement("span");
        counter.textContent = totalAvailable;
        counter.style.margin = "0 0.3rem";

        const increment = document.createElement("button");
        increment.textContent = "+";

        header.appendChild(decrement);
        header.appendChild(counter);
        header.appendChild(increment);

        // Ascension button
        const ascendBtn = document.createElement("button");
        ascendBtn.textContent = "Ascension";
        ascendBtn.style.marginLeft = "1rem";
        ascendBtn.onclick = async (e) => {
          e.stopPropagation();

          const choice = prompt(
            "Choose an ascension path:\n- Willpower\n- Presence\n- Spirit\n- Arcane"
          )?.trim();
          if (!["Willpower", "Presence", "Spirit", "Arcane"].includes(choice)) {
            alert("Invalid choice.");
            return;
          }

          const capitalized = choice.charAt(0).toUpperCase() + choice.slice(1);

          try {
            const tierSnap = await db
              .ref(`template/skills/${capitalized}/Tier 1`)
              .once("value");
            const tierData = tierSnap.val();

            if (!tierData) {
              alert(`No Tier 1 skills found for ${capitalized}`);
              return;
            }

            const categories = Object.keys(tierData);
            const randomCategory =
              categories[Math.floor(Math.random() * categories.length)];
            const skillList = Object.keys(tierData[randomCategory]);
            const randomSkill =
              skillList[Math.floor(Math.random() * skillList.length)];

            const charKey = name.toLowerCase(); // normalize usage
            const skillPath = `characters/${charKey}/skills/${capitalized}/Tier 1/${randomCategory}/${randomSkill}`;
            const scorePath = `characters/${charKey}/secondary_scores/${capitalized}`;
            const unlockPath = `characters/${charKey}/meta/unlocked_trees/${capitalized}`;
            await db.ref(unlockPath).set(true);
            await db.ref(scorePath).set(1);
            await db.ref(skillPath).set(1);

            console.log("✅ Ascension complete:", {
              unlockPath,
              scorePath,
              skillPath,
            });

            alert(
              `${capitalized} tree unlocked. 1 point added to "${randomSkill}" under ${randomCategory}.`
            );
          } catch (err) {
            console.error("Ascension error:", err);
            alert("Something went wrong during ascension.");
          }
        };
        header.appendChild(ascendBtn);

        // THEN append the full header
        characterLi.appendChild(header);

        const updateFirebase = (value) => {
          const newAvailable = value - totalUsedPoints;
          db.ref(`characters/${name}/meta/available_skill_points`).set(
            newAvailable
          );
        };

        decrement.onclick = (e) => {
          e.stopPropagation();
          if (totalAvailable > totalUsedPoints) {
            totalAvailable--;
            counter.textContent = totalAvailable;
            updateFirebase(totalAvailable);
          }
        };
        increment.onclick = (e) => {
          e.stopPropagation();
          totalAvailable++;
          counter.textContent = totalAvailable;
          updateFirebase(totalAvailable);
        };

        const detail = document.createElement("ul");
        detail.style.display = "none";
        detail.style.marginTop = "0.5rem";

        const skillsDetails = document.createElement("details");
        const skillsSummary = document.createElement("summary");
        skillsSummary.innerHTML = `<a href="/skilltree/index.html?char=${encodeURIComponent(
          name
        )}" style="color: inherit; text-decoration: underline;">Skills</a>`;
        skillsDetails.appendChild(skillsSummary);

        Object.entries(skills).forEach(([stat, skillMap]) => {
          if (!skillMap) return;
          const entries = Object.entries(skillMap).filter(([, val]) => val > 0);
          if (entries.length === 0) return;

          entries.forEach(([skill, val]) => {
            const skillLi = document.createElement("li");
            skillLi.innerHTML = `<em>${stat}</em>: ${skill} (level ${val})`;
            skillsDetails.appendChild(skillLi);
          });
        });

        detail.appendChild(skillsDetails);

        characterLi.onclick = () => {
          detail.style.display =
            detail.style.display === "none" ? "block" : "none";
        };

        list.appendChild(characterLi);
        list.appendChild(detail);
      });
    })
    .catch((err) => {
      list.innerHTML = `<li>Error loading characters: ${err.message}</li>`;
    });
}

window.onload = () => {
  loadTemplate();
  attachCreateForm();
};
