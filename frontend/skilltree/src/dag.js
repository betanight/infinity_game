import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig.js";

import {
  upgradeSkill,
  downgradeSkill,
  getCharacterData,
  calculateRank,
} from "../levelUp/levelingFunctions.js";

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

window.levelMode = JSON.parse(
  sessionStorage.getItem("levelMode") ||
    '{"mode":null,"character":null,"stat":null}'
);
sessionStorage.removeItem("levelMode");

export async function renderSkillTree(characterData) {
  const response = await fetch(
    "https://infinity-e0f55-default-rtdb.firebaseio.com/template.json"
  );
  const template = await response.json();
  const skillData = template.skills;
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
  const nodes = [];
  const links = [];

  statList.forEach((stat) => {
    nodes.push({ id: stat, isStat: true, title: stat });

    if (mysticalStats.includes(stat)) return;

    const skills = Object.keys(skillData[stat]);
    for (let j = 0; j < skills.length; j++) {
      const skill = skills[j];
      const value = characterData.skills?.[stat]?.[skill] || 0;
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
      links.push({ source: stat, target: `${stat}-${skill}` });
    }
  });

  const width = 2500;
  const height = 2500;
  const svg = d3
    .select("svg")
    .attr("viewBox", [0, 0, width, height].join(" "))
    .style("background", "#111");

  const container = svg.append("g").attr("class", "zoom-container");

  const statRadius = 250;
  const skillRadiusStart = 240;
  const skillSpacing = 30;
  const statAngleMap = {};
  const maxFanWidth = Math.PI / 4.5;
  const minFanWidth = Math.PI / 5;

  const angleStep = (2 * Math.PI) / statList.length;
  statList.forEach((stat, i) => {
    const angle = i * angleStep;
    statAngleMap[stat] = angle;
    const node = nodes.find((n) => n.id === stat);
    node.angle = angle;
    node.radius = statRadius;
    node.x = width / 2 + Math.cos(angle) * statRadius;
    node.y = height / 2 + Math.sin(angle) * statRadius;
  });

  const skillCounts = statList.map((stat) =>
    mysticalStats.includes(stat) ? 0 : Object.keys(skillData[stat]).length
  );
  const maxSkills = Math.max(...skillCounts);
  const minSkills = Math.min(...skillCounts);

  nodes.forEach((node) => {
    if (!node.isStat) {
      const statAngle = statAngleMap[node.stat];
      const count = node.count;
      const norm = (count - minSkills) / (maxSkills - minSkills + 1e-6);
      const fanWidth = maxFanWidth - (maxFanWidth - minFanWidth) * norm;
      const offset = (node.index - (count - 1) / 2) * (fanWidth / count);
      const angle = statAngle + offset;
      const radius = skillRadiusStart + node.index * skillSpacing;
      node.angle = angle;
      node.radius = radius;
      node.x = width / 2 + Math.cos(angle) * radius;
      node.y = height / 2 + Math.sin(angle) * radius;
    }
  });

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
      return targetNode.value > 0 ? brightColors[stat] : dullColors[stat];
    });

  const nodeGroup = container
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodeGroup
    .append("circle")
    .attr("r", (d) => (d.isStat ? 20 : 5.5))
    .attr("fill", (d) => {
      if (d.isStat) {
        const val =
          characterData.primary_scores?.[d.id] ||
          characterData.secondary_scores?.[d.id] ||
          0;
        return val > 0 ? brightColors[d.id] : dullColors[d.id];
      }
      return d.value > 0 ? brightColors[d.stat] : dullColors[d.stat];
    })
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
          .html(`<strong>${d.title}</strong><br>${d.description}`);
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
    })
    .on("click", async function (event, d) {
      if (d.isStat) return;

      const charId = characterData.meta?.character_id;
      const stat = d.stat;
      const skill = d.title;
      const skillLevel = d.value || 0;
      const available = characterData.meta?.available_skill_points || 0;

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
          const updatedCharacter = await getCharacterData(charId);
          d3.select("svg").selectAll("*").remove();
          renderSkillTree(updatedCharacter);
        };
        box.appendChild(btn);
      };

      addButton(
        "+1",
        () => upgradeSkill(charId, stat, skill, 1),
        available < 1
      );
      addButton(
        "+5",
        () => upgradeSkill(charId, stat, skill, 5),
        available < 1
      );
      addButton(
        "Max",
        () => upgradeSkill(charId, stat, skill, available),
        available < 1
      );

      box.appendChild(document.createElement("br"));
      addButton(
        "-1",
        () => downgradeSkill(charId, stat, skill, 1),
        skillLevel === 0
      );
      addButton(
        "-5",
        () => downgradeSkill(charId, stat, skill, 5),
        skillLevel === 0
      );
      addButton(
        "Reset",
        () => downgradeSkill(charId, stat, skill, "reset"),
        skillLevel === 0
      );
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

  nodeGroup
    .append("text")
    .text((d) => (d.isStat ? d.title : ""))
    .attr("dy", "-1.7em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-weight", "bold")
    .attr("font-size", "16px");

  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });
  svg.call(zoom);

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
  const totalPoints = Object.values(characterData.skills || {}).reduce(
    (sum, skillGroup) =>
      sum + Object.values(skillGroup).reduce((a, b) => a + b, 0),
    0
  );

  container
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 50)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "40px")
    .style("font-weight", "bold")
    .text(characterData.meta?.character_id || "Unnamed Character");

  container
    .append("rect")
    .attr("x", width / 2 - 60)
    .attr("y", height / 2 - 10)
    .attr("width", 120)
    .attr("height", 50)
    .attr("fill", "#222")
    .attr("stroke", "white")
    .attr("rx", 6)
    .attr("ry", 6);

  container
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 + 10)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text(`Rank ${rank}`);

  container
    .append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 + 30)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "14px")
    .text(`Total Skills: ${totalPoints}`);
}
