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
  renderSpiritTree(characterData);
}

async function renderSpiritTree(characterData) {
  const templateSnap = await db
    .ref("template/skills/Spirit/Tier 1")
    .once("value");
  const spiritData = templateSnap.val();

  const nodes = [];
  const links = [];

  const spiritScore = characterData.secondary_scores?.Spirit || 0;

  nodes.push({
    id: "Spirit",
    label: "Spirit",
    isCore: true,
    value: spiritScore,
    r: 22,
    x: 0,
    y: 0,
  });

  const categories = Object.keys(spiritData);
  const ringRadius = 220;
  const skillRadius = 100;

  categories.forEach((category, catIndex) => {
    const angle = (2 * Math.PI * catIndex) / categories.length;
    const xCat = Math.cos(angle) * ringRadius;
    const yCat = Math.sin(angle) * ringRadius;

    const categoryId = `Tier1-${category}`;
    nodes.push({
      id: categoryId,
      label: category,
      description: `${category} Spirit Skills`,
      r: 12,
      x: xCat,
      y: yCat,
      value: 0,
    });

    links.push({ source: "Spirit", target: categoryId });

    const skills = spiritData[category];
    const skillNames = Object.keys(skills);
    const angleSpread = Math.PI / 2;
    const skillBase = angle - angleSpread / 2;
    const skillStep = angleSpread / Math.max(skillNames.length - 1, 1);

    skillNames.forEach((skillName, skillIndex) => {
      const skillAngle = skillBase + skillStep * skillIndex;
      const xSkill = xCat + Math.cos(skillAngle) * skillRadius;
      const ySkill = yCat + Math.sin(skillAngle) * skillRadius;

      const skillData = skills[skillName];
      const value = characterData.skills?.Spirit?.[skillName] || 0;

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
    .attr("stroke", "#888")
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
        core: "#3a4a55",
        tier: "#4c5c63",
        category: "#45616e",
        spell: "#2f4e59",
      };

      const bright = {
        core: "#7fd7ff",
        tier: "#ace7ff",
        category: "#9bd9ff",
        spell: "#bdeaff",
      };

      if (d.isCore) return value === 0 ? dull.core : bright.core;
      if (d.label?.startsWith("Tier"))
        return value === 0 ? dull.tier : bright.tier;
      if (["Guardian", "Hex Warrior", "Spectre"].includes(d.label))
        return value === 0 ? dull.category : bright.category;

      return value === 0 ? dull.spell : bright.spell;
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
