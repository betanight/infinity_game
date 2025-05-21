import { skillAbbreviations } from "../../scripts/abbreviations.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { firebaseConfig } from "../../skilltree/src/firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function createSkillCheckDrawer(characterData) {
  const existing = document.getElementById("skillcheck-toggle");
  if (existing) return;

  // Create drawer first
  const drawer = document.createElement("div");
  drawer.id = "skillcheck-drawer";
  drawer.style.position = "fixed";
  drawer.style.top = "0";
  drawer.style.left = "-260px";
  drawer.style.width = "240px";
  drawer.style.height = "100vh";
  drawer.style.background = "#1e1e1e";
  drawer.style.color = "white";
  drawer.style.zIndex = 9998;
  drawer.style.padding = "60px 16px 16px"; // ⬅ room for toggle
  drawer.style.transition = "left 0.3s ease-in-out";
  drawer.style.overflowY = "auto";
  drawer.style.boxShadow = "2px 0 10px rgba(0,0,0,0.7)";
  document.body.appendChild(drawer);

  // Create toggle OUTSIDE drawer but positioned beside it
  const toggle = document.createElement("button");
  toggle.id = "skillcheck-toggle";
  toggle.textContent = "Skill Checks";
  toggle.style.position = "fixed";
  toggle.style.top = "16px";
  toggle.style.left = "0px";
  toggle.style.zIndex = 9999;
  toggle.style.padding = "10px 16px";
  toggle.style.borderRadius = "0 8px 8px 0";
  toggle.style.border = "none";
  toggle.style.background = "#0af";
  toggle.style.color = "white";
  toggle.style.cursor = "pointer";
  document.body.appendChild(toggle);

  // Logic for drawer visibility
  let isOpen = false;
  toggle.onclick = () => {
    isOpen = !isOpen;
    drawer.style.left = isOpen ? "0px" : "-260px";
    drawer.style.padding = "180px 16px 16px";
    toggle.textContent = isOpen ? "Hide Checks" : "Skill Checks";
  };

  renderSkillChecks(drawer, characterData);

  document.body.appendChild(toggle);
  document.body.appendChild(drawer);
}

async function renderSkillChecks(drawer, characterData) {
  drawer.innerHTML = "<h2 style='margin-bottom:16px;'>Skills</h2>";

  const snapshot = await get(ref(db, "template/skills"));
  const templateSkills = snapshot.val();

  const scores = characterData.skills || {};
  const output = {};

  for (const stat in templateSkills) {
    const skills = templateSkills[stat];
    for (const skillName in skills) {
      const meta = skills[skillName];
      if (!meta || !Array.isArray(meta.boost)) continue;

      const boostsSkills = meta.boost.some((b) => b.startsWith("skill:"));
      if (!boostsSkills) continue;

      const level =
        characterData.skills?.[stat]?.[skillName] ||
        characterData.skills?.[stat]?.[skillName.replace(/\s+/g, "_")] ||
        0;

      if (!output[stat]) output[stat] = [];
      output[stat].push({
        name: skillName,
        level: level,
        desc: meta.description || "No description.",
      });
    }
  }

  for (const stat of Object.keys(output).sort()) {
    const section = document.createElement("div");
    section.style.marginBottom = "14px";
    section.innerHTML = `<h3 style="margin: 8px 0;">${stat}</h3>`;

    output[stat]
      .sort((a, b) => b.level - a.level)
      .forEach(({ name, level, desc }) => {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.style.marginBottom = "4px";
        div.style.position = "relative";

        const label = document.createElement("span");
        label.style.fontSize = "13px";
        label.textContent = `${name} (${level})`;

        const rollBtn = document.createElement("button");
        rollBtn.textContent = "🎲";
        rollBtn.style.marginLeft = "6px";
        rollBtn.style.padding = "2px 8px";
        rollBtn.style.borderRadius = "6px";
        rollBtn.style.border = "none";
        rollBtn.style.background = "#0af";
        rollBtn.style.color = "white";
        rollBtn.style.cursor = "pointer";

        const statScore =
          characterData.primary_scores?.[stat] ??
          characterData.secondary_scores?.[stat] ??
          0;

        const min = Math.floor(Math.sqrt(level)) + statScore;
        const max = level + statScore;

        rollBtn.onmouseover = (event) => {
          const existing = document.getElementById("skillcheck-tooltip");
          if (existing) existing.remove();

          const popup = document.createElement("div");
          popup.id = "skillcheck-tooltip";
          popup.style.position = "absolute";
          popup.style.left = `${event.pageX + 12}px`;
          popup.style.top = `${event.pageY + 12}px`;
          popup.style.background = "#222";
          popup.style.color = "#fff";
          popup.style.padding = "8px 12px";
          popup.style.borderRadius = "6px";
          popup.style.fontSize = "13px";
          popup.style.whiteSpace = "pre-wrap";
          popup.style.zIndex = 10000;
          popup.style.boxShadow = "0 0 8px rgba(0,0,0,0.8)";
          popup.textContent = `${desc}\nMin: ${min} / Max: ${max}`;
          document.body.appendChild(popup);
        };

        rollBtn.onmousemove = (event) => {
          const tooltip = document.getElementById("skillcheck-tooltip");
          if (tooltip) {
            tooltip.style.left = `${event.pageX + 12}px`;
            tooltip.style.top = `${event.pageY + 12}px`;
          }
        };

        rollBtn.onmouseout = () => {
          const tooltip = document.getElementById("skillcheck-tooltip");
          if (tooltip) tooltip.remove();
        };

        rollBtn.onclick = () => {
          const roll = Math.floor(Math.random() * (max - min + 1)) + min;

          let result = div.querySelector(".roll-result");
          if (!result) {
            result = document.createElement("div");
            result.className = "roll-result";
            result.style.fontSize = "12px";
            result.style.color = "#ccc";
            result.style.marginLeft = "8px";
            result.style.marginTop = "2px";
            div.appendChild(result);
          }

          result.innerHTML = `🎲 <strong>${roll}</strong> (range ${min}–${max})`;
        };

        div.appendChild(label);
        div.appendChild(rollBtn);
        section.appendChild(div);
      });

    drawer.appendChild(section);
  }
}
