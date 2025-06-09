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
import { getAuth } from "firebase/auth";
console.log("👤 skilltree auth user:", getAuth().currentUser?.uid);

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
} from "../levelUp/levelingFunctions.js";

// Firebase setup
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

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

function getTierVisibility(rank) {
  // Simple mapping of ranks to visible tiers
  switch (
    rank[0] // Get first character of rank (ignoring +/-)
  ) {
    case "S":
    case "A":
      return {
        tier1: true,
        tier2: true,
        tier3: true,
        tier4: true,
        tier5: true,
        finalTier: rank === "SS+", // Only SS+ can see final tier
      };
    case "B":
      return {
        tier1: true,
        tier2: true,
        tier3: true,
        tier4: false,
        tier5: false,
        finalTier: false,
      };
    case "C":
      return {
        tier1: true,
        tier2: true,
        tier3: false,
        tier4: false,
        tier5: false,
        finalTier: false,
      };
    case "D":
    case "E":
      return {
        tier1: true,
        tier2: true,
        tier3: false,
        tier4: false,
        tier5: false,
        finalTier: false,
      };
    default: // F, G or no rank
      return {
        tier1: true,
        tier2: false,
        tier3: false,
        tier4: false,
        tier5: false,
        finalTier: false,
      };
  }
}

export async function renderSkillTree(characterData, onNavigate, svgElement) {
  console.log("🎯 TESTING CHANGES - NEW VERSION");
  console.log("🎮 renderSkillTree called with:", {
    characterId: characterData?.meta?.character_id,
    rank: characterData?.meta?.rank,
    svgElement: !!svgElement,
  });

  if (!svgElement) {
    console.error("No SVG element provided");
    return;
  }

  // D3 canvas setup - Increased size for better spacing
  const svg = d3.select(svgElement);
  const width = 4000; // Increased from 3000
  const height = 4000; // Increased from 3000

  // Clear any existing content
  svg.selectAll("*").remove();

  // Add a gradient definition for the background
  const defs = svg.append("defs");
  const gradient = defs
    .append("radialGradient")
    .attr("id", "skill-tree-background")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color:#1a1a2e;stop-opacity:1");
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color:#111111;stop-opacity:1");

  // Add subtle grid pattern
  const pattern = defs
    .append("pattern")
    .attr("id", "grid")
    .attr("width", 50)
    .attr("height", 50)
    .attr("patternUnits", "userSpaceOnUse");

  pattern
    .append("path")
    .attr("d", "M 50 0 L 0 0 0 50")
    .attr("fill", "none")
    .attr("stroke", "rgba(255,255,255,0.05)")
    .attr("stroke-width", 1);

  svg
    .attr("viewBox", [0, 0, width, height].join(" "))
    .style("background", "url(#skill-tree-background)")
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "url(#grid)");

  const container = svg.append("g").attr("class", "zoom-container");

  // Add a subtle outer glow filter
  const filter = defs
    .append("filter")
    .attr("id", "glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");

  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", "3")
    .attr("result", "coloredBlur");

  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  console.log("🧪 renderSkillTree received:", characterData);
  if (!characterData?.meta) {
    console.warn("⛔ Incomplete character data. Skipping render.");
    return;
  }

  nodes = [];
  links.length = 0;

  try {
    // Get the complete template data
    const templateSnapshot = await get(ref(db, "template/skills"));
    const template = templateSnapshot.val();

    if (!template) {
      console.error("No template data found");
      return;
    }

    // Get visible tiers based on character rank
    console.log("🎯 Character rank:", characterData.meta?.rank);
    const visibleTiers = getTierVisibility(characterData.meta?.rank || "G-");
    console.log("🎯 Visible tiers:", visibleTiers);

    // Calculate positions for tiered layout
    const baseRadius = 400; // Radius for the main stat circle
    const orbitRadius = 500; // TESTING - Made this very large to verify changes
    const statSpacing = (2 * Math.PI) / statList.length;

    const centerX = width / 2;
    const centerY = height / 2;

    // Convert polar coordinates to cartesian
    function polarToCartesian(centerX, centerY, radius, angleInRadians) {
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    }

    // Get fixed positions in an orbit
    function getOrbitalPositions(count, centerX, centerY, radius, startAngle) {
      const positions = [];
      if (count === 0) return positions;

      // For single node, place it at the top of the orbit
      if (count === 1) {
        positions.push(
          polarToCartesian(centerX, centerY, radius, startAngle - Math.PI / 2)
        );
        return positions;
      }

      // For multiple nodes, distribute them evenly in the top 180° arc
      const arcLength = Math.PI;
      const angleStep = arcLength / (count - 1);

      for (let i = 0; i < count; i++) {
        const angle = startAngle - Math.PI / 2 - arcLength / 2 + i * angleStep;
        positions.push(polarToCartesian(centerX, centerY, radius, angle));
      }

      return positions;
    }

    statList.forEach((stat, statIndex) => {
      if (!template[stat]) return;

      // Position stat nodes in a circle
      const statAngle = statIndex * statSpacing;
      const statPos = polarToCartesian(centerX, centerY, baseRadius, statAngle);

      nodes.push({
        id: stat,
        isStat: true,
        title: stat,
        x: statPos.x,
        y: statPos.y,
        angle: statAngle,
      });

      const tiers = mysticalStats.includes(stat)
        ? ["Tier 1"]
        : ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Final Tier"];

      // Filter tiers based on visibility
      const visibleTiersList = tiers.filter((tier) => {
        const tierNum =
          tier === "Final Tier" ? "finalTier" : `tier${tier.split(" ")[1]}`;
        return visibleTiers[tierNum];
      });

      // Position tiers along the stat's radius
      visibleTiersList.forEach((tier, tierIndex) => {
        const tierRadius = baseRadius * (0.7 + tierIndex * 0.25);
        const tierPos = polarToCartesian(
          centerX,
          centerY,
          tierRadius,
          statAngle
        );

        const tierNode = {
          id: `${stat}-${tier}`,
          title: tier,
          stat,
          isTier: true,
          x: tierPos.x,
          y: tierPos.y,
          angle: statAngle,
        };
        nodes.push(tierNode);

        // Connect tier to previous tier or stat
        const prevTier = visibleTiersList[tierIndex - 1];
        links.push({
          source: prevTier ? `${stat}-${prevTier}` : stat,
          target: `${stat}-${tier}`,
          value: 1,
        });

        if (mysticalStats.includes(stat)) {
          if (template[stat]?.[tier]) {
            const elements = Object.keys(template[stat][tier]);
            const elementNodes = elements.map((element) => ({
              id: `${stat}-${tier}-${element}`,
              title: element,
              stat,
              tier,
              isElement: true,
            }));

            // Get fixed positions for elements
            const elementPositions = getOrbitalPositions(
              elementNodes.length,
              tierPos.x,
              tierPos.y,
              orbitRadius,
              statAngle
            );

            // Assign positions to element nodes
            elementNodes.forEach((node, index) => {
              node.x = elementPositions[index].x;
              node.y = elementPositions[index].y;
              node.angle = statAngle;
              nodes.push(node);

              links.push({
                source: `${stat}-${tier}`,
                target: node.id,
              });

              // Handle skills for this element
              const skills = Object.keys(template[stat][tier][node.title]);
              const skillNodes = skills.map((skill) => ({
                id: `${stat}-${tier}-${node.title}-${skill}`,
                title: skill,
                stat,
                tier,
                element: node.title,
                description:
                  template[stat][tier][node.title][skill]?.description || "",
                value:
                  characterData?.skills?.[stat]?.[tier]?.[node.title]?.[
                    skill
                  ] || 0,
              }));

              // Get fixed positions for skills
              const skillPositions = getOrbitalPositions(
                skillNodes.length,
                node.x,
                node.y,
                orbitRadius * 0.6,
                statAngle
              );

              // Assign positions to skill nodes
              skillNodes.forEach((skillNode, skillIndex) => {
                skillNode.x = skillPositions[skillIndex].x;
                skillNode.y = skillPositions[skillIndex].y;
                skillNode.angle = statAngle;
                nodes.push(skillNode);

                links.push({
                  source: node.id,
                  target: skillNode.id,
                  value: skillNode.value,
                });
              });
            });
          }
        } else {
          const tierSkills = template[stat][tier] || {};
          const skills = Object.keys(tierSkills);

          const skillNodes = skills.map((skill) => ({
            id: `${stat}-${tier}-${skill}`,
            title: skill,
            stat,
            tier,
            description: tierSkills[skill].description || "",
            value: characterData?.skills?.[stat]?.[tier]?.[skill] || 0,
          }));

          // Get fixed positions for skills
          const skillPositions = getOrbitalPositions(
            skillNodes.length,
            tierPos.x,
            tierPos.y,
            orbitRadius,
            statAngle
          );

          // Assign positions to skill nodes
          skillNodes.forEach((node, index) => {
            node.x = skillPositions[index].x;
            node.y = skillPositions[index].y;
            node.angle = statAngle;
            nodes.push(node);

            links.push({
              source: `${stat}-${tier}`,
              target: node.id,
              value: node.value > 0 ? 1 : 0,
            });
          });
        }
      });
    });

    // Update link rendering
    container.selectAll("line").remove();
    container
      .append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", (d) => {
        const source = nodes.find((n) => n.id === d.source);
        const target = nodes.find((n) => n.id === d.target);

        // Calculate control points for a subtle curve
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);

        // Add very subtle curve
        const curve = dr * 0.1;
        return `M${source.x},${source.y} Q${(source.x + target.x) / 2},${
          (source.y + target.y) / 2 + curve
        } ${target.x},${target.y}`;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const targetNode = nodes.find((n) => n.id === d.target);
        const sourceNode = nodes.find((n) => n.id === d.source);
        const stat = sourceNode?.stat || targetNode?.stat;
        return d.value > 0 ? brightColors[stat] : dullColors[stat];
      })
      .attr("stroke-width", (d) => (d.value > 0 ? 1.5 : 0.75))
      .attr("opacity", (d) => (d.value > 0 ? 0.3 : 0.15));

    // Add arrow markers to show progression direction
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#4CAF50")
      .style("stroke", "none");

    // Add arrowheads to prerequisite lines
    container
      .selectAll("path")
      .filter((d) => d.isPrereq)
      .attr("marker-end", "url(#arrowhead)");

    // Create visual node containers with different sizes
    const nodeGroup = container
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Add hover effect container
    nodeGroup
      .append("circle")
      .attr("class", "hover-effect")
      .attr("r", (d) => {
        if (d.isStat) return 45; // Slightly larger than the node
        if (d.isTier) return 40;
        if (d.isElement) return 35;
        return 20;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => brightColors[d.stat])
      .attr("stroke-width", 2)
      .attr("opacity", 0)
      .style("pointer-events", "none");

    // Draw the node circles with different sizes and enhanced styling
    nodeGroup
      .append("circle")
      .attr("class", "node-circle")
      .attr("r", (d) => {
        if (d.isStat) return 50; // Increased sizes
        if (d.isTier) return 40;
        if (d.isElement) return 35;
        return 25; // Bigger skill nodes
      })
      .attr("fill", (d) => {
        if (d.isStat) {
          const scores = {
            ...(characterData.primary_scores || {}),
            ...(characterData.secondary_scores || {}),
          };
          const val = scores[d.id] || 0;
          return val > 0 ? brightColors[d.id] : dullColors[d.id];
        }
        if (d.isTier || d.isElement) {
          return dullColors[d.stat];
        }
        const color = d.value > 0 ? brightColors[d.stat] : dullColors[d.stat];
        return color;
      })
      .style("cursor", "pointer")
      .style("filter", (d) => {
        if (d.value > 0 || d.isStat) return "url(#glow)";
        return "none";
      })
      .style("opacity", (d) => {
        if (d.isStat || d.isTier || d.isElement) return 1;
        return d.value > 0 ? 1 : 0.6; // Increased visibility of inactive nodes
      })
      .attr("stroke", (d) => brightColors[d.stat])
      .attr("stroke-width", (d) => (d.value > 0 ? 3 : 1)) // More visible borders
      .attr("stroke-opacity", 0.6);

    // Add pulsing animation for active skills
    nodeGroup
      .filter((d) => d.value > 0 && !d.isStat && !d.isTier && !d.isElement)
      .append("circle")
      .attr("class", "pulse")
      .attr("r", 15)
      .attr("fill", "none")
      .attr("stroke", (d) => brightColors[d.stat])
      .attr("stroke-width", 2)
      .attr("opacity", 0.3)
      .style("pointer-events", "none")
      .style("animation", "pulse 2s infinite");

    // Add text labels with enhanced styling
    nodeGroup
      .append("text")
      .text((d) => {
        if (d.isStat)
          return `${d.title}\n${
            characterData.primary_scores?.[d.id] ||
            characterData.secondary_scores?.[d.id] ||
            0
          }`;
        return d.title;
      })
      .attr("text-anchor", "middle")
      .attr("dy", (d) => {
        if (d.isStat) return "-0.5em";
        if (d.isTier) return "0.35em";
        if (d.isElement) return "3em";
        return "2.5em";
      })
      .attr("fill", "white")
      .style("font-size", (d) => {
        if (d.isStat) return "24px";
        if (d.isTier) return "20px";
        if (d.isElement) return "18px";
        return "16px";
      })
      .style("font-weight", (d) => (d.value > 0 ? "bold" : "normal"))
      .style("pointer-events", "none")
      .style("opacity", (d) => {
        if (d.isStat || d.isTier || d.isElement) return 1;
        return d.value > 0 ? 1 : 0.8;
      })
      .style("text-shadow", "0 0 10px rgba(0,0,0,0.8)");

    // Add stat value as separate text element for better positioning
    nodeGroup
      .filter((d) => d.isStat)
      .append("text")
      .text(
        (d) =>
          characterData.primary_scores?.[d.id] ||
          characterData.secondary_scores?.[d.id] ||
          0
      )
      .attr("text-anchor", "middle")
      .attr("dy", "0.8em")
      .attr("fill", "white")
      .style("font-size", "28px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 10px rgba(0,0,0,0.8)");

    // Add hover interactions
    nodeGroup
      .on("mouseover", function (event, d) {
        // Highlight connected nodes and links
        const connectedLinks = links.filter(
          (l) => l.source === d.id || l.target === d.id
        );
        const connectedNodeIds = new Set([
          ...connectedLinks.map((l) => l.source),
          ...connectedLinks.map((l) => l.target),
        ]);

        // Dim unconnected nodes and links
        container
          .selectAll("path")
          .transition()
          .duration(200)
          .attr("opacity", (l) =>
            connectedLinks.includes(l) ? (l.value > 0 ? 0.8 : 0.4) : 0.1
          );

        nodeGroup
          .transition()
          .duration(200)
          .style("opacity", (n) =>
            connectedNodeIds.has(n.id) || n.id === d.id ? 1 : 0.2
          );

        // Show hover effect
        d3.select(this)
          .select(".hover-effect")
          .transition()
          .duration(200)
          .attr("opacity", 0.3)
          .attr("r", function () {
            const baseR = +d3.select(this).attr("r");
            return baseR * 1.2;
          });

        // Enlarge the node slightly
        d3.select(this)
          .select(".node-circle")
          .transition()
          .duration(200)
          .attr("r", function () {
            const baseR = +d3.select(this).attr("r");
            return baseR * 1.1;
          });
      })
      .on("mouseout", function () {
        // Restore all nodes and links
        container
          .selectAll("path")
          .transition()
          .duration(200)
          .attr("opacity", (d) => (d.value > 0 ? 0.6 : 0.2));

        nodeGroup
          .transition()
          .duration(200)
          .style("opacity", (d) => {
            if (d.isStat || d.isTier || d.isElement) return 1;
            return d.value > 0 ? 1 : 0.5;
          });

        // Hide hover effect
        d3.select(this)
          .select(".hover-effect")
          .transition()
          .duration(200)
          .attr("opacity", 0)
          .attr("r", function () {
            return +d3.select(this).attr("r") / 1.2;
          });

        // Restore node size
        d3.select(this)
          .select(".node-circle")
          .transition()
          .duration(200)
          .attr("r", function () {
            return +d3.select(this).attr("r") / 1.1;
          });
      });

    // Add CSS for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.5);
          opacity: 0.1;
        }
        100% {
          transform: scale(1);
          opacity: 0.3;
        }
      }
    `;
    document.head.appendChild(style);

    nodeGroup.on("click", async function (event, d) {
      if (d.isStat) {
        const unlocked = characterData.meta?.unlocked_trees || {};
        const key = d.id.charAt(0).toUpperCase() + d.id.slice(1);

        if (mysticalStats.includes(key) && !unlocked[key]) {
          alert(`Admin says:\n\n${key} is locked.`);
          return;
        }

        if (onNavigate) {
          onNavigate(
            `/skilltree/${key}?char=${characterData.meta.character_id}`
          );
        }
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
          renderSkillTree(updated, onNavigate, svgElement);
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
            upgradeMysticalSkill(
              charId,
              stat,
              tier,
              category,
              skill,
              available
            ),
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
            downgradeMysticalSkill(
              charId,
              stat,
              tier,
              category,
              skill,
              "reset"
            ),
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
  } catch (error) {
    console.error("Error loading template:", error);
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h2>Error loading skill tree</h2>
        <p>There was an error loading the template data. Please try again.</p>
        <a href="/" style="color: #0af;">Return to Dashboard</a>
      </div>
    `;
  }
}
