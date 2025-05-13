import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm";
import { firebaseConfig } from "../../skilltree/src/firebaseConfig.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const params = new URLSearchParams(window.location.search);
const characterName = params.get("char");

if (characterName) loadCharacter(characterName);

async function loadCharacter(name) {
  const snapshot = await db
    .ref(`characters/${name.toLowerCase()}`)
    .once("value");
  if (!snapshot.exists()) return alert("Character not found.");
  const characterData = snapshot.val();
  renderWillpowerTree(characterData);
}

async function renderWillpowerTree(characterData) {
  const templateSnap = await db
    .ref("template/skills/Willpower/Tier 1")
    .once("value");
  const willData = templateSnap.val();

  const nodes = [];
  const links = [];

  const willScore = characterData.secondary_scores?.Willpower || 0;

  nodes.push({
    id: "Willpower",
    label: "Willpower",
    isCore: true,
    value: willScore,
    r: 22,
    x: 0,
    y: 0,
  });

  const categories = ["Active", "Passive"];
  const radius = 220;
  const skills = { Active: {}, Passive: willData?.Passive || {} };

  // Everything not Passive is active
  Object.entries(willData || {}).forEach(([key, val]) => {
    if (key !== "Passive") skills.Active[key] = val;
  });

  categories.forEach((category, i) => {
    const angle = (i / categories.length) * 2 * Math.PI;
    const xCat = Math.cos(angle) * radius;
    const yCat = Math.sin(angle) * radius;

    const categoryId = `Tier1-${category}`;
    nodes.push({
      id: categoryId,
      label: category,
      description:
        category === "Passive"
          ? "Passive Willpower Abilities"
          : "Active Monk Techniques",
      r: 12,
      x: xCat,
      y: yCat,
      value: 0,
    });

    links.push({ source: "Willpower", target: categoryId });

    const skillEntries = Object.entries(skills[category]);
    const spread = Math.PI / 2;
    const base = angle - spread / 2;
    const step = spread / Math.max(skillEntries.length - 1, 1);

    skillEntries.forEach(([skillName, skillData], index) => {
      const skillAngle = base + index * step;
      const xSkill = xCat + Math.cos(skillAngle) * 100;
      const ySkill = yCat + Math.sin(skillAngle) * 100;

      const value = characterData.skills?.Willpower?.[skillName] || 0;

      nodes.push({
        id: `${categoryId}-${skillName}`,
        label: skillName,
        description: skillData.description,
        value,
        r: 5 + value,
        x: xSkill,
        y: ySkill,
      });

      links.push({ source: categoryId, target: `${categoryId}-${skillName}` });
    });
  });

  drawTree(nodes, links);
}

function drawTree(nodes, links) {
  const width = window.innerWidth;
  const height = window.innerHeight;

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
    .attr("stroke", "#999")
    .attr("stroke-width", 1);

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
        core: "#4a1515",
        tier: "#663131",
        active: "#772c2c",
        passive: "#5c2323",
      };

      const bright = {
        core: "#ff5e5e",
        tier: "#ff9e9e",
        active: "#ff4d4d",
        passive: "#ff7777",
      };

      if (d.isCore) return value === 0 ? dull.core : bright.core;
      if (d.label === "Active")
        return value === 0 ? dull.active : bright.active;
      if (d.label === "Passive")
        return value === 0 ? dull.passive : bright.passive;
      return value === 0 ? dull.tier : bright.tier;
    });

  nodeGroup
    .append("text")
    .text((d) => (d.isCore ? d.label : ""))
    .attr("dy", "-1.4em")
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
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

  const zoom = d3
    .zoom()
    .scaleExtent([0.3, 2])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);
}
