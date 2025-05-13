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

      const secondaryOrder = ["Instinct", "Presence", "Spirit", "Willpower"];
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
      secondaryOrder.forEach((stat) => buildSection(stat));

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
        const primary = data.primary_scores || {};
        const secondary = data.secondary_scores || {};

        let totalPoints = 0;
        Object.values(skills).forEach((skillGroup) => {
          Object.values(skillGroup).forEach((val) => {
            totalPoints += val;
          });
        });
        const characterLi = document.createElement("li");
        characterLi.textContent = `${name} (Character Power: ${totalPoints})`;
        characterLi.style.cursor = "pointer";

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

        const controls = document.createElement("div");
        controls.style.marginTop = "0.5rem";

        ["Skill point +1", "Any +1", "Skill point -1", "Ascend?"].forEach(
          (label) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.style.marginRight = "0.5rem";

            btn.onclick = async () => {
              try {
                if (label === "Skill point +1") {
                  const stat = await new Promise((resolve) => {
                    const allowed = [
                      "Strength",
                      "Dexterity",
                      "Constitution",
                      "Intelligence",
                      "Wisdom",
                      "Charisma",
                    ];
                    const modal = document.createElement("div");
                    modal.style.position = "fixed";
                    modal.style.top = "0";
                    modal.style.left = "0";
                    modal.style.width = "100%";
                    modal.style.height = "100%";
                    modal.style.background = "rgba(0, 0, 0, 0.8)";
                    modal.style.display = "flex";
                    modal.style.alignItems = "center";
                    modal.style.justifyContent = "center";
                    modal.style.zIndex = "9999";

                    const box = document.createElement("div");
                    box.style.background = "#222";
                    box.style.padding = "20px";
                    box.style.borderRadius = "10px";
                    box.style.textAlign = "center";
                    box.style.color = "white";

                    const label = document.createElement("p");
                    label.textContent = "Choose a stat tree to level:";
                    box.appendChild(label);

                    allowed.forEach((stat) => {
                      const btn = document.createElement("button");
                      btn.textContent = stat;
                      btn.style.margin = "6px";
                      btn.style.padding = "8px 16px";
                      btn.onclick = () => {
                        modal.remove();
                        resolve(stat);
                      };
                      box.appendChild(btn);
                    });

                    modal.appendChild(box);
                    document.body.appendChild(modal);
                  });

                  sessionStorage.setItem(
                    "levelMode",
                    JSON.stringify({ mode: "upgrade", character: name, stat })
                  );
                  window.location.href = `/skilltree/index.html?char=${encodeURIComponent(
                    name
                  )}`;
                } else if (label === "Skill point -1") {
                  sessionStorage.setItem(
                    "levelMode",
                    JSON.stringify({ mode: "downgrade", character: name })
                  );
                  window.location.href = `/skilltree/index.html?char=${encodeURIComponent(
                    name
                  )}`;
                } else if (label === "Any +1") {
                  sessionStorage.setItem(
                    "levelMode",
                    JSON.stringify({ mode: "universal", character: name })
                  );
                  window.location.href = `/skilltree/index.html?char=${encodeURIComponent(
                    name
                  )}`;
                } else if (label === "Ascend?") {
                  const stat = await new Promise((resolve) => {
                    const allowed = [
                      "Arcane",
                      "Willpower",
                      "Spirit",
                      "Presence",
                    ];
                    const modal = document.createElement("div");
                    modal.style.position = "fixed";
                    modal.style.top = "0";
                    modal.style.left = "0";
                    modal.style.width = "100%";
                    modal.style.height = "100%";
                    modal.style.background = "rgba(0, 0, 0, 0.8)";
                    modal.style.display = "flex";
                    modal.style.alignItems = "center";
                    modal.style.justifyContent = "center";
                    modal.style.zIndex = "9999";

                    const box = document.createElement("div");
                    box.style.background = "#222";
                    box.style.padding = "20px";
                    box.style.borderRadius = "10px";
                    box.style.textAlign = "center";
                    box.style.color = "white";

                    const label = document.createElement("p");
                    label.textContent = "Choose a mystical tree to unlock:";
                    box.appendChild(label);

                    allowed.forEach((stat) => {
                      const btn = document.createElement("button");
                      btn.textContent = stat;
                      btn.style.margin = "6px";
                      btn.style.padding = "8px 16px";
                      btn.onclick = () => {
                        modal.remove();
                        resolve(stat);
                      };
                      box.appendChild(btn);
                    });

                    modal.appendChild(box);
                    document.body.appendChild(modal);
                  });

                  await unlockTree(name, stat);
                  alert("Mystic tree unlocked!");
                }
              } catch (err) {
                alert("Error: " + err.message);
              }
            };

            controls.appendChild(btn);
          }
        );

        detail.appendChild(controls);

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
