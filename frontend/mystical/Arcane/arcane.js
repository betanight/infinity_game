import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm";
import { firebaseConfig } from "../../skilltree/src/firebaseConfig.js";
import {
  upgradeMysticalSkill,
  downgradeMysticalSkill,
  getCharacterData,
} from "../../skilltree/levelUp/levelingFunctions.js";

const brightColors = {
  Arcane: "#c18cff",
};

const dullColors = {
  Arcane: "#2f2044",
};

// Firebase setup
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

// Wait for auth state before loading character
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (characterName) loadCharacter(characterName);
  } else {
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h2>Please Sign In</h2>
        <p>You need to be signed in to view this page.</p>
        <a href="/" style="color: #0af;">Return to Dashboard</a>
      </div>
    `;
  }
});

async function loadCharacter(name) {
  try {
    const snapshot = await get(ref(db, `characters/${name.toLowerCase()}`));
    if (!snapshot.exists()) {
      alert("Character not found.");
      return;
    }
    const characterData = snapshot.val();
    renderArcaneTree(characterData);
  } catch (error) {
    console.error("Error loading character:", error);
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h2>Error Loading Character</h2>
        <p>There was an error loading the character data. Please try again.</p>
        <a href="/" style="color: #0af;">Return to Dashboard</a>
      </div>
    `;
  }
}

async function renderArcaneTree(characterData) {
  const templateSnap = await get(ref(db, "template/skills/Arcane/Tier 1"));
  const arcaneData = templateSnap.val();

  const nodes = [];
  const links = [];

  nodes.push({
    id: "Arcane",
    label: "Arcane",
    isCore: true,
    value: 0,
    r: 22,
    x: 0,
    y: 0,
  });

  const categories = Object.keys(arcaneData);
  const ringRadius = 220;
  const skillRadius = 100;
  let arcaneTotal = 0;

  categories.forEach((category, catIndex) => {
    const angle = (2 * Math.PI * catIndex) / categories.length;
    const xCat = Math.cos(angle) * ringRadius;
    const yCat = Math.sin(angle) * ringRadius;

    const categoryId = `Tier1-${category}`;
    let categoryValue = 0;

    const skills = arcaneData[category];
    const skillNames = Object.keys(skills);
    const angleSpread = Math.PI / 2;
    const skillBase = angle - angleSpread / 2;
    const skillStep = angleSpread / Math.max(skillNames.length - 1, 1);

    skillNames.forEach((skillName, skillIndex) => {
      const skillAngle = skillBase + skillStep * skillIndex;
      const xSkill = xCat + Math.cos(skillAngle) * skillRadius;
      const ySkill = yCat + Math.sin(skillAngle) * skillRadius;

      const skillData = skills[skillName];
      const level =
        characterData.skills?.Arcane?.["Tier 1"]?.[category]?.[skillName] || 0;

      categoryValue += level;
      arcaneTotal += level;

      const skillId = `${categoryId}-${skillName}`;
      nodes.push({
        id: skillId,
        label: skillName,
        description: skillData.description,
        value: level,
        r: 5 + level,
        x: xSkill,
        y: ySkill,
        fullName: skillName,
        category,
        tier: "Tier 1",
      });

      links.push({ source: categoryId, target: skillId });
    });

    nodes.push({
      id: categoryId,
      label: category,
      description: `${category} Arcane Spells`,
      r: 12,
      x: xCat,
      y: yCat,
      value: categoryValue,
    });

    links.push({ source: "Arcane", target: categoryId });
  });

  const arcaneNode = nodes.find((n) => n.id === "Arcane");
  if (arcaneNode) arcaneNode.value = arcaneTotal;

  drawTree(nodes, links, characterData);
}

function drawTree(nodes, links, characterData) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  d3.select("svg").selectAll("*").remove();

  const svg = d3
    .select("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "))
    .style("background", "#111");

  const container = svg.append("g");

  container
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", (d) => getNode(d.source).x)
    .attr("y1", (d) => getNode(d.source).y)
    .attr("x2", (d) => getNode(d.target).x)
    .attr("y2", (d) => getNode(d.target).y)
    .attr("stroke", (d) => {
      const target = getNode(d.target);
      return target.value > 0 ? brightColors.Arcane : dullColors.Arcane;
    });

  function getNode(id) {
    return nodes.find((n) => n.id === id);
  }

  const nodeGroup = container
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  nodeGroup
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => {
      const value = d.value ?? 0;

      const dull = {
        core: "#2f2044",
        tier: "#3f2d5a",
        category: "#49326a",
        skill: "#392c52",
      };

      const bright = {
        core: "#c18cff",
        tier: "#d1a3ff",
        category: "#e0bdff",
        skill: "#ebd4ff",
      };

      if (d.isCore) return value === 0 ? dull.core : bright.core;
      if (d.label?.startsWith("Tier"))
        return value === 0 ? dull.tier : bright.tier;
      if (nodes.find((n) => n.id === d.id && !n.id.includes("-")))
        return value === 0 ? dull.category : bright.category;

      return value === 0 ? dull.skill : bright.skill;
    });

  nodeGroup
    .append("text")
    .filter((d) => d.isCore)
    .text((d) => d.label)
    .attr("dy", "-0.3em")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .attr("fill", "white")
    .attr("font-weight", "bold");

  nodeGroup
    .append("text")
    .filter((d) => d.isCore && d.value > 0)
    .text((d) => d.value)
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "white")
    .attr("font-weight", "bold");

  nodeGroup.on("mouseover", function (event, d) {
    if (d.description) {
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .html(
          `<strong>${d.label}</strong><br>${d.description}<br>Level: ${d.value}`
        );
      tooltip
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY + 12}px`);
    }
  });

  nodeGroup.on("mousemove", (event) => {
    d3.select(".tooltip")
      .style("left", `${event.pageX + 12}px`)
      .style("top", `${event.pageY + 12}px`);
  });

  nodeGroup.on("mouseout", () => {
    d3.select(".tooltip").remove();
  });

  nodeGroup.on("click", async function (event, d) {
    if (!d.fullName) return;

    const charId = characterName.toLowerCase();
    const stat = "Arcane";
    const skillName = d.fullName;
    const category = d.category;
    const tier = d.tier;
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
      <h2>${d.label}</h2>
      <p>${d.description}</p>
      <p><strong>Current Level:</strong> ${skillLevel}</p>
      <p><strong>Available Skill Points:</strong> ${available}</p>
      <hr>
    `;

    const addButton = (label, cb, disabled = false) => {
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
        await cb();
        const updated = await getCharacterData(charId);
        renderArcaneTree(updated);
      };
      box.appendChild(btn);
    };

    addButton(
      "+1",
      () => upgradeMysticalSkill(charId, stat, tier, category, skillName, 1),
      available < 1
    );
    addButton(
      "+5",
      () => upgradeMysticalSkill(charId, stat, tier, category, skillName, 5),
      available < 1
    );
    addButton(
      "Max",
      () =>
        upgradeMysticalSkill(
          charId,
          stat,
          tier,
          category,
          skillName,
          available
        ),
      available < 1
    );

    box.appendChild(document.createElement("br"));

    addButton(
      "-1",
      () => downgradeMysticalSkill(charId, stat, tier, category, skillName, 1),
      skillLevel === 0
    );
    addButton(
      "-5",
      () => downgradeMysticalSkill(charId, stat, tier, category, skillName, 5),
      skillLevel === 0
    );
    addButton(
      "Reset",
      () =>
        downgradeMysticalSkill(
          charId,
          stat,
          tier,
          category,
          skillName,
          "reset"
        ),
      skillLevel === 0
    );

    const close = document.createElement("button");
    close.textContent = "Close";
    close.style.marginTop = "12px";
    close.style.padding = "8px 16px";
    close.style.borderRadius = "6px";
    close.style.border = "none";
    close.style.background = "#888";
    close.style.color = "white";
    close.style.cursor = "pointer";
    close.onclick = () => modal.remove();

    box.appendChild(document.createElement("br"));
    box.appendChild(close);
    modal.appendChild(box);
    document.body.appendChild(modal);
  });

  const zoom = d3
    .zoom()
    .scaleExtent([0.3, 2])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);
}
