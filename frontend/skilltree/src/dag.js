let skillData;
let nodes = [];
const links = [];

const statList = [
  "Charisma",
  "Arcane",
  "Willpower",
  "Presence",
  "Spirit",
  "Constitution",
  "Strength",
  "Intelligence",
  "Dexterity",
  "Wisdom",
];

const mysticalStats = ["Arcane", "Willpower", "Spirit", "Presence"];

const brightColors = {
  Arcane: "#c18cff",
  Willpower: "#ff2e2e",
  Spirit: "#8fe8ff",
  Presence: "#ffec88",
  Strength: "#66ffff",
  Dexterity: "#ff6b6b",
  Constitution: "#5f8dff",
  Intelligence: "#5cf87b",
  Wisdom: "#ffd94a",
  Charisma: "#ffb566",
};

const dullColors = {
  Arcane: "#2f2044",
  Willpower: "#3a1010",
  Spirit: "#1e3a44",
  Presence: "#5e5023",
  Strength: "#1a4f4f",
  Dexterity: "#4d1e1e",
  Constitution: "#1a2a66",
  Intelligence: "#1d4c29",
  Wisdom: "#665b23",
  Charisma: "#4c2f1a",
};

import * as d3 from "d3";
import { createHotbar } from "./hotbar.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig.js";
import {
  upgradeMysticalSkill,
  upgradePrimarySkill,
  downgradeMysticalSkill,
  downgradePrimarySkill,
  calculateRank,
  getCharacterData,
  saveCharacterData,
} from "../levelUp/levelingFunctions.js";

// Firebase setup
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// D3 canvas setup
const svg = d3.select("svg");
const width = 2500;
const height = 2500;

svg
  .attr("viewBox", [0, 0, width, height].join(" "))
  .style("background", "#111");

const container = svg.append("g").attr("class", "zoom-container");

function getSkillLevel(data, stat, tier, category, skill) {
  return data?.skills?.[stat]?.[tier]?.[category]?.[skill] || 0;
}

function getTotalTierLevels(data, stat, tier) {
  const tierData = data?.skills?.[stat]?.[`Tier ${tier}`];
  return Object.values(tierData || {})
    .flatMap(Object.values)
    .reduce((a, b) => a + b, 0);
}

function getTotalSkillPoints(skills) {
  let total = 0;

  for (const stat in skills) {
    const statBlock = skills[stat];

    if (typeof statBlock !== "object") continue;

    for (const key in statBlock) {
      const value = statBlock[key];

      if (typeof value === "number") {
        total += value; // primary stat skill like Strength → "Power Strike": 3
      } else if (typeof value === "object") {
        // mystical tiered layout
        for (const category in value) {
          const skillGroup = value[category];
          for (const skillName in skillGroup) {
            total += skillGroup[skillName] || 0;
          }
        }
      }
    }
  }

  return total;
}

export async function renderSkillTree(characterData) {
  d3.select("g.zoom-container").remove();
  const container = svg.append("g").attr("class", "zoom-container");
  console.log("🧪 renderSkillTree received:", characterData);
  if (
    !characterData ||
    !characterData.meta ||
    !characterData.skills ||
    typeof characterData.skills !== "object"
  ) {
    console.warn("⛔ Incomplete character data. Skipping render.");
    return;
  }

  nodes = [];
  links.length = 0;

  const response = await fetch(
    "https://infinity-e0f55-default-rtdb.firebaseio.com/template.json"
  );
  const template = await response.json();
  skillData = template.skills;

  statList.forEach((stat) => {
    if (!skillData?.[stat]) return;

    // Add central stat node
    nodes.push({
      id: stat,
      isStat: true,
      title: stat,
    });

    // Mystical trees use tiers and categories
    if (mysticalStats.includes(stat)) {
      return; // only show the stat node, don't render skills
    } else {
      // Regular trees (e.g. Strength)
      const skills = Object.keys(skillData[stat]);
      skills.forEach((skill, j) => {
        let value = 0;

        if (
          characterData &&
          characterData.skills &&
          characterData.skills[stat] &&
          typeof characterData.skills[stat] === "object"
        ) {
          value = characterData.skills[stat][skill] || 0;
        }

        nodes.push({
          id: `${stat}-${skill}`,
          title: skill,
          stat,
          description: skillData[stat][skill]?.description || "",
          isStat: false,
          value,
          index: j,
          count: skills.length,
        });

        links.push({
          source: stat,
          target: `${stat}-${skill}`,
        });
      });
    }
  });
  const statRadius = 250;
  const skillRadiusStart = 240;
  const skillSpacing = 30;

  const centerX = width / 2;
  const centerY = height / 2;

  const statAngleMap = {};
  const angleStep = (2 * Math.PI) / statList.length;

  // Place each stat in a circle
  statList.forEach((stat, i) => {
    const angle = i * angleStep;
    statAngleMap[stat] = angle;
    const node = nodes.find((n) => n.id === stat);
    if (node) {
      node.angle = angle;
      node.radius = statRadius;
      node.x = centerX + Math.cos(angle) * statRadius;
      node.y = centerY + Math.sin(angle) * statRadius;
    }
  });

  // Measure how many skills each stat has
  const skillCounts = statList.map((stat) =>
    mysticalStats.includes(stat) || !skillData?.[stat]
      ? 0
      : Object.keys(skillData[stat]).length
  );
  const maxSkills = Math.max(...skillCounts);
  const minSkills = Math.min(...skillCounts);

  // Fan out skill nodes around each stat
  nodes.forEach((node) => {
    if (!node.isStat) {
      const statAngle = statAngleMap[node.stat];
      const count = node.count;
      const norm = (count - minSkills) / (maxSkills - minSkills + 1e-6);
      const fanWidth = Math.PI / 4.5 - (Math.PI / 4.5 - Math.PI / 5) * norm;
      const offset = (node.index - (count - 1) / 2) * (fanWidth / count);
      const angle = statAngle + offset;
      const radius = skillRadiusStart + node.index * skillSpacing;
      node.angle = angle;
      node.radius = radius;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
    }
  });
  // Draw connecting lines from stat to skill
  container.selectAll("line").remove(); // 🔧 ensures no duplicates
  container
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", (d) => nodes.find((n) => n.id === d.source).x)
    .attr("y1", (d) => nodes.find((n) => n.id === d.source).y)
    .attr("x2", (d) => nodes.find((n) => n.id === d.target).x)
    .attr("y2", (d) => nodes.find((n) => n.id === d.target).y)
    .attr("stroke", (d) => {
      const targetNode = nodes.find((n) => n.id === d.target);
      const sourceNode = nodes.find((n) => n.id === d.source);
      const stat = sourceNode?.id || targetNode?.stat;
      return targetNode.value > 0 ? brightColors[stat] : dullColors[stat]; // rule 4/5
    });

  // Create visual node containers
  const nodeGroup = container
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  // Draw the node circles
  nodeGroup
    .append("circle")
    .attr("r", (d) => (d.isStat ? 20 : 5.5))
    .attr("fill", (d) => {
      if (d.isStat) {
        const scores = {
          ...(characterData.primary_scores || {}),
          ...(characterData.secondary_scores || {}),
        };
        const val = scores[d.id] || 0;
        return val > 0 ? brightColors[d.id] : dullColors[d.id];
      }
      return d.value > 0 ? brightColors[d.stat] : dullColors[d.stat];
    })

    .style("cursor", (d) => (d.isStat ? "pointer" : "default"))
    .on("mouseover", function (event, d) {
      if (!d.isStat) {
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "#222")
          .style("color", "#fff")
          .style("padding", "6px 10px")
          .style("border-radius", "6px")
          .style("pointer-events", "none")
          .style("font-size", "13px")
          .html(() => {
            const desc = d.description || "No description.";
            return `<strong>${d.title}</strong><br>${desc}`;
          });
        tooltip
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);
      }
    })
    .on("mousemove", function (event) {
      d3.select(".tooltip")
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY + 12}px`);
    })
    .on("mouseout", function () {
      d3.select(".tooltip").remove();
    });

  // Add text labels for stat nodes only
  nodeGroup
    .append("text")
    .text((d) => (d.isStat ? d.title : ""))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("pointer-events", "none");

  nodeGroup.on("click", async function (event, d) {
    if (d.isStat) {
      const unlocked = characterData.meta?.unlocked_trees || {};
      const key = d.id.charAt(0).toUpperCase() + d.id.slice(1);

      if (mysticalStats.includes(key) && !unlocked[key]) {
        alert(`Admin says:\n\n${key} is locked.`);
        return;
      }

      const folder = key;
      const file = key.toLowerCase();
      window.location.href = `/mystical/${folder}/${file}.html?char=${characterData.meta.character_id}`;
      return;
    }
    // Skill node clicked
    const charId = characterData.meta?.character_id;
    const stat = d.stat;
    const skill = d.title;
    const isMystical = mysticalStats.includes(stat);

    let tier = null;
    let category = null;
    let skillLevel = 0;

    if (isMystical) {
      const parts = d.id.split("-");
      tier = parts[1];
      category = parts[2];
      skillLevel = getSkillLevel(characterData, stat, tier, category, skill);
    } else {
      skillLevel = d.value || 0;
    }

    const available = characterData.meta?.available_skill_points || 0;

    // Modal structure
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.85)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = 9999;

    const box = document.createElement("div");
    box.style.background = "#222";
    box.style.padding = "24px";
    box.style.borderRadius = "12px";
    box.style.color = "white";
    box.style.textAlign = "center";
    box.style.maxWidth = "400px";

    box.innerHTML = `
    <h2>${skill}</h2>
    <p>${d.description || "No description."}</p>
    <p><strong>Current Level:</strong> ${skillLevel}</p>
    <p><strong>Available Skill Points:</strong> ${available}</p>
  `;

    // Button builder
    const addButton = (label, callback, disabled = false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.style.margin = "6px";
      btn.style.padding = "8px 16px";
      btn.style.borderRadius = "6px";
      btn.style.border = "none";
      btn.style.cursor = disabled ? "not-allowed" : "pointer";
      btn.style.background = disabled ? "#555" : "#0af";
      btn.style.color = "white";
      btn.disabled = disabled;
      btn.onclick = async () => {
        modal.remove();
        await callback();
        const updated = await getCharacterData(charId);
        renderSkillTree(updated);
      };
      box.appendChild(btn);
    };

    if (isMystical) {
      addButton(
        "+1",
        () => upgradeMysticalSkill(charId, stat, tier, category, skill, 1),
        available < 1
      );
      addButton(
        "+5",
        () => upgradeMysticalSkill(charId, stat, tier, category, skill, 5),
        available < 1
      );
      addButton(
        "Max",
        () =>
          upgradeMysticalSkill(charId, stat, tier, category, skill, available),
        available < 1
      );
      box.appendChild(document.createElement("br"));
      addButton(
        "-1",
        () => downgradeMysticalSkill(charId, stat, tier, category, skill, 1),
        skillLevel === 0
      );
      addButton(
        "-5",
        () => downgradeMysticalSkill(charId, stat, tier, category, skill, 5),
        skillLevel === 0
      );
      addButton(
        "Reset",
        () =>
          downgradeMysticalSkill(charId, stat, tier, category, skill, "reset"),
        skillLevel === 0
      );
    } else {
      addButton(
        "+1",
        () => upgradePrimarySkill(charId, stat, skill, 1),
        available < 1
      );
      addButton(
        "+5",
        () => upgradePrimarySkill(charId, stat, skill, 5),
        available < 1
      );
      addButton(
        "Max",
        () => upgradePrimarySkill(charId, stat, skill, available),
        available < 1
      );
      box.appendChild(document.createElement("br"));
      addButton(
        "-1",
        () => downgradePrimarySkill(charId, stat, skill, 1),
        skillLevel === 0
      );
      addButton(
        "-5",
        () => downgradePrimarySkill(charId, stat, skill, 5),
        skillLevel === 0
      );
      addButton(
        "Reset",
        () => downgradePrimarySkill(charId, stat, skill, "reset"),
        skillLevel === 0
      );
    }

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.marginTop = "12px";
    closeBtn.style.padding = "8px 16px";
    closeBtn.style.borderRadius = "6px";
    closeBtn.style.border = "none";
    closeBtn.style.background = "#888";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => modal.remove();

    box.appendChild(document.createElement("br"));
    box.appendChild(closeBtn);

    modal.appendChild(box);
    document.body.appendChild(modal);
  });

  // Enable zoom + pan with scroll and drag
  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);

  // Automatically center the view around the stat circle
  const scale = 1.7;
  setTimeout(() => {
    const statNodes = nodes.filter((n) => n.isStat);
    const avgX = d3.mean(statNodes, (d) => d.x);
    const avgY = d3.mean(statNodes, (d) => d.y);
    const tx = width / 2 - avgX * scale;
    const ty = height / 2 - avgY * scale;

    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }, 100);

  const rank = calculateRank(characterData.skills || {});
  const totalUsed = getTotalSkillPoints(characterData.skills || {});
  const totalAvailable = characterData.meta?.available_skill_points || 0;
  const totalCapacity = totalUsed + totalAvailable;

  const centerXText = width / 2;
  const centerYText = height / 2;

  // Character name as dashboard title
  container
    .append("text")
    .attr("x", centerXText)
    .attr("y", centerYText - 80)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "32px")
    .style("font-weight", "bold")
    .text(`${characterData.meta?.character_id}'s Skilltree`);

  // Rank label
  container
    .append("text")
    .attr("x", centerXText)
    .attr("y", centerYText - 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(`RANK: ${rank}`);

  // Skill points fraction — numerator (used)
  container
    .append("text")
    .attr("x", centerXText)
    .attr("y", centerYText + 15)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(`${totalUsed}`);

  // Fraction line
  container
    .append("line")
    .attr("x1", centerXText - 20)
    .attr("x2", centerXText + 20)
    .attr("y1", centerYText + 20)
    .attr("y2", centerYText + 20)
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  // Denominator (available total)
  container
    .append("text")
    .attr("x", centerXText)
    .attr("y", centerYText + 42)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(`${totalCapacity}`);

  createHotbar(characterData);
}
