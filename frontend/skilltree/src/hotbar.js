import VisibleStatEquations from "../../scripts/visible_stat_equations.js";
import {
  skillAbbreviations,
  coreAbbreviations,
} from "../../scripts/abbreviations.js";

export function createHotbar(characterData) {
  const existing = document.getElementById("hotbar-toggle");
  if (existing) return;

  const toggle = document.createElement("button");
  toggle.id = "hotbar-toggle";
  toggle.textContent = "Show Abilities";
  toggle.style.position = "fixed";
  toggle.style.bottom = "12px";
  toggle.style.right = "12px";
  toggle.style.zIndex = 9999;
  toggle.style.padding = "10px 16px";
  toggle.style.borderRadius = "8px";
  toggle.style.border = "none";
  toggle.style.background = "#0af";
  toggle.style.color = "white";
  toggle.style.cursor = "pointer";

  const drawer = document.createElement("div");
  drawer.id = "hotbar-drawer";
  drawer.style.position = "fixed";
  drawer.style.bottom = "-100%";
  drawer.style.left = "0";
  drawer.style.width = "100%";
  drawer.style.background = "#222";
  drawer.style.color = "white";
  drawer.style.zIndex = 9998;
  drawer.style.padding = "24px";
  drawer.style.transition = "bottom 0.3s ease-in-out";
  drawer.style.maxHeight = "60vh";
  drawer.style.overflowY = "auto";
  drawer.style.boxShadow = "0 -2px 10px rgba(0,0,0,0.7)";

  toggle.onclick = () => {
    const isOpen = drawer.style.bottom === "0px";
    drawer.style.bottom = isOpen ? "-100%" : "0px";
    toggle.textContent = isOpen ? "Show Abilities" : "Hide Abilities";
    if (!isOpen) renderHotbarContent(drawer, characterData);
  };

  document.body.appendChild(toggle);
  document.body.appendChild(drawer);
}

function renderHotbarContent(drawer, characterData) {
  drawer.innerHTML = "<h2 style='margin-bottom:16px;'>Abilities</h2>";

  const scores = {
    ...(characterData.primary_scores || {}),
    ...(characterData.secondary_scores || {}),
  };

  const skills = {};
  const abbrevMap = {};
  for (const [abbr, full] of Object.entries(skillAbbreviations)) {
    abbrevMap[full] = abbr;
  }

  for (const stat in characterData.skills || {}) {
    const statBlock = characterData.skills[stat];
    if (typeof statBlock !== "object") continue;

    for (const key in statBlock) {
      const val = statBlock[key];

      if (typeof val === "number") {
        const short = abbrevMap[key] || key;
        skills[short] = val;
      } else if (typeof val === "object") {
        for (const subcat in val) {
          for (const skill in val[subcat]) {
            const short = abbrevMap[skill] || skill;
            skills[short] = val[subcat][skill];
          }
        }
      }
    }
  }

  const baseStat = "Strength";
  const baseDamage = VisibleStatEquations.rawPhysicalDamage(
    scores,
    skills,
    "Unarmed"
  );

  scores, skills, baseStat;
  const baseMin = Math.floor(Math.sqrt(baseDamage));
  const baseMax = Math.floor(baseDamage);

  console.log(`🧠 Unarmed Strike Breakdown:`);
  console.log(
    `  ${baseStat} (${scores[baseStat] || 0}) * 3 = ${
      (scores[baseStat] || 0) * 3
    }`
  );
  console.log(
    `  + ${Object.entries(skills)
      .map(([k, v]) => `${k}(${v})`)
      .join(", ")}`
  );
  console.log(
    `  Total Damage = ${baseDamage} → Range: ${baseMin} – ${baseMax}`
  );

  addAbilityCard(drawer, {
    name: "Unarmed Strike",
    description: "A basic physical attack using fists or body.",
    roll: VisibleStatEquations.rawMeleeAccuracy(scores, skills),
    damage: baseDamage,
    characterData,
    scores,
    skills,
  });

  const mysticalStats = ["Arcane", "Willpower", "Presence", "Spirit"];

  for (const stat of mysticalStats) {
    const statBlock = characterData.skills?.[stat]?.["Tier 1"];
    if (!statBlock) continue;

    for (const category in statBlock) {
      const group = statBlock[category];
      for (const skill in group) {
        const level = group[skill];
        if (level > 0) {
          const damage = VisibleStatEquations.rawPhysicalDamage(
            scores,
            skills,
            stat
          );
          const minDmg = Math.floor(Math.sqrt(damage));
          const maxDmg = Math.floor(damage);

          console.log(`🌀 ${skill} [${stat}]`);
          console.log(
            `  ${stat} Score (${scores[stat] || 0}) * 1.5 = ${(
              (scores[stat] || 0) * 1.5
            ).toFixed(1)}`
          );
          console.log(
            `  Total Damage = ${damage} → Range: ${minDmg} – ${maxDmg}`
          );
        }
      }
    }
  }
}

function addAbilityCard(
  drawer,
  { name, description, roll, damage, characterData, scores, skills }
) {
  const minRoll = Math.floor(Math.sqrt(roll.totalAccuracy || roll));
  const maxRoll = Math.floor(roll.totalAccuracy || roll);
  const minDmg = Math.floor(Math.sqrt(damage));
  const maxDmg = Math.floor(damage);

  const estimatedMax = VisibleStatEquations.characterHealth(
    0,
    scores,
    skills
  ).maxHealth;
  const currentHP = characterData.meta?.currentHealth ?? estimatedMax;

  const healthData = VisibleStatEquations.characterHealth(
    currentHP,
    scores,
    skills
  );
  const maxHP = healthData.maxHealth;
  const armor = VisibleStatEquations.characterArmor(
    scores,
    skills,
    "Unarmored"
  );

  const card = document.createElement("div");
  card.style.display = "flex";
  card.style.justifyContent = "space-between";
  card.style.alignItems = "flex-start";
  card.style.marginBottom = "16px";
  card.style.padding = "16px";
  card.style.border = "1px solid #444";
  card.style.borderRadius = "8px";
  card.style.background = "#2a2a2a";

  const leftSide = document.createElement("div");
  leftSide.style.flex = "1";

  const title = document.createElement("h3");
  title.textContent = name;

  const desc = document.createElement("p");
  desc.textContent = description;

  const rollText = document.createElement("p");
  rollText.innerHTML = `<strong>Roll Range:</strong> ${minRoll} – ${maxRoll}`;

  const dmgText = document.createElement("p");
  dmgText.innerHTML = `<strong>Damage Range:</strong> ${minDmg} – ${maxDmg}`;

  const output = document.createElement("div");
  output.style.marginTop = "12px";

  const rollBtn = document.createElement("button");
  rollBtn.textContent = "Roll";
  rollBtn.style.padding = "6px 12px";
  rollBtn.style.marginTop = "8px";
  rollBtn.style.background = "#0af";
  rollBtn.style.color = "white";
  rollBtn.style.border = "none";
  rollBtn.style.borderRadius = "6px";
  rollBtn.style.cursor = "pointer";

  rollBtn.onclick = () => {
    const rollValue =
      Math.floor(Math.random() * (maxRoll - minRoll + 1)) + minRoll;
    output.innerHTML = `<p>🎯 Roll: <strong>${rollValue}</strong></p>`;

    const yesBtn = document.createElement("button");
    const noBtn = document.createElement("button");

    yesBtn.textContent = "Yes";
    noBtn.textContent = "No";

    [yesBtn, noBtn].forEach((btn) => {
      btn.style.margin = "6px";
      btn.style.padding = "4px 10px";
      btn.style.borderRadius = "6px";
      btn.style.border = "none";
      btn.style.cursor = "pointer";
      btn.style.background = "#555";
      btn.style.color = "white";
    });

    yesBtn.onclick = () => {
      const dmgValue =
        Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
      output.innerHTML = `<p>🎯 Roll: <strong>${rollValue}</strong></p><p>💥 Hit! Damage: <strong>${dmgValue}</strong></p>`;
    };

    noBtn.onclick = () => {
      output.innerHTML = "";
    };

    output.appendChild(document.createTextNode("Hit? "));
    output.appendChild(yesBtn);
    output.appendChild(noBtn);
  };

  leftSide.appendChild(title);
  leftSide.appendChild(desc);
  leftSide.appendChild(rollText);
  leftSide.appendChild(dmgText);
  leftSide.appendChild(rollBtn);
  leftSide.appendChild(output);

  const statPanel = document.createElement("div");
  statPanel.style.marginLeft = "24px";
  statPanel.style.minWidth = "100px";
  statPanel.innerHTML = `
  <p><strong>HP:</strong> ${currentHP} / ${maxHP}</p>
  <p><strong>Armor:</strong> ${armor}</p>
`;

  card.appendChild(leftSide);
  card.appendChild(statPanel);
  drawer.appendChild(card);
}
