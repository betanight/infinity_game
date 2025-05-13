import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm";
import { firebaseConfig } from "../../skilltree/src/firebaseConfig.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Extract character name from URL
const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

if (characterName) loadCharacter(characterName);

async function loadCharacter(name) {
  const snapshot = await db
    .ref(`characters/${name.toLowerCase()}`)
    .once("value");
  if (!snapshot.exists()) return alert("Character not found.");
  const characterData = snapshot.val();
  renderArcaneTree(characterData);
}

async function renderArcaneTree(characterData) {
  const templateSnap = await db.ref("template/skills/Arcane").once("value");
  const arcaneData = templateSnap.val();

  const tier = "Tier 1";
  const nodes = [];
  const links = [];

  const arcaneStat = characterData.secondary_scores?.Arcane || 0;

  nodes.push({
    id: "Arcane",
    label: "Arcane",
    isCore: true,
    x: 0,
    y: 0,
    r: 22,
    value: arcaneStat,
  });

  const tierData = arcaneData?.[tier];
  if (!tierData) return;

  const categories = Object.keys(tierData);
  const arcRadius = 220;
  const skillRadius = 100;

  categories.forEach((category, catIndex) => {
    const angle = (2 * Math.PI * catIndex) / categories.length;
    const xCat = Math.cos(angle) * arcRadius;
    const yCat = Math.sin(angle) * arcRadius;

    const categoryId = `Tier1-${category}`;
    nodes.push({
      id: categoryId,
      label: category,
      r: 12,
      x: xCat,
      y: yCat,
    });
    links.push({ source: "Arcane", target: categoryId });

    const skills = tierData[category];
    const skillNames = Object.keys(skills);
    const angleSpread = Math.PI / 2;
    const skillBase = angle - angleSpread / 2;
    const skillStep = angleSpread / Math.max(skillNames.length - 1, 1);

    skillNames.forEach((skillName, skillIndex) => {
      const skillAngle = skillBase + skillIndex * skillStep;
      const xSkill = xCat + Math.cos(skillAngle) * skillRadius;
      const ySkill = yCat + Math.sin(skillAngle) * skillRadius;

      const skillData = skills[skillName];
      const value = characterData.skills?.Arcane?.[skillName] || 0;

      const skillId = `${categoryId}-${skillName}`;
      nodes.push({
        id: skillId,
        label: skillName,
        description: skillData.description,
        value,
        r: 5 + value,
        x: xSkill,
        y: ySkill,
      });
      links.push({ source: categoryId, target: skillId });
    });
  });

  drawTree(nodes, links, characterData.meta?.character_id || "Unnamed");
}

function drawTree(nodes, links, characterName) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = d3
    .select("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "))
    .style("background", "#111");

  const container = svg.append("g");

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // Draw links
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
    .attr("stroke", "#666")
    .attr("stroke-width", 1);

  function getNode(id) {
    return nodes.find((n) => n.id === id);
  }

  // Draw nodes
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

      // Dull versions
      const dull = {
        core: "#4c3273",
        tier: "#6a5495",
        element: "#5a3890",
        spell: "#3a265c",
      };

      // Bright versions
      const bright = {
        core: "#a678ff",
        tier: "#d3baff",
        element: "#8e44ec",
        spell: "#b388ff",
      };

      if (d.isCore) return value === 0 ? dull.core : bright.core;
      if (d.label?.startsWith("Tier"))
        return value === 0 ? dull.tier : bright.tier;
      if (d.label?.match(/^[A-Z]/))
        return value === 0 ? dull.element : bright.element;

      return value === 0 ? dull.spell : bright.spell;
    })

    .on("mouseover", function (event, d) {
      if (d.isCore) return;
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
    })
    .on("mousemove", (event) => {
      d3.select(".tooltip")
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY + 12}px`);
    })
    .on("mouseout", () => {
      d3.select(".tooltip").remove();
    });

  nodeGroup
    .append("text")
    .text((d) => (d.isCore ? d.label : ""))
    .attr("dy", "-1.4em")
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "white")
    .attr("font-weight", "bold");

  container
    .append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + 40)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "20px")
    .text(`${characterName} — Arcane Tree`);

  const zoom = d3
    .zoom()
    .scaleExtent([0.3, 2])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);
}
