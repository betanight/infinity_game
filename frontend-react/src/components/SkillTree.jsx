import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { ref, get, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import * as d3 from 'd3';
import React, { useState } from 'react';
import SkillCheckDrawer from './SkillCheckDrawer';
import CoreCheckDrawer from './CoreCheckDrawer';
import AbilityDrawer from './AbilityDrawer';

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

function SkillTree() {
  const svgRef = useRef(null);
  const { characterName } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSkillDrawer, setShowSkillDrawer] = useState(false);
  const [showCoreDrawer, setShowCoreDrawer] = useState(false);
  const [showAbilityDrawer, setShowAbilityDrawer] = useState(false);
  const [characterData, setCharacterData] = useState(null);
  const [templateSkills, setTemplateSkills] = useState({});

  const updatePrimarySkill = async (charId, stat, skill, amount, isDowngrade = false) => {
    const charSnap = await get(ref(db, `characters/${charId.toLowerCase()}`));
    if (!charSnap.exists()) return;
    const char = charSnap.val();
    const available = char.meta?.available_skill_points || 0;
    const current = char.skills?.[stat]?.[skill] || 0;
    let toChange = amount === 'reset' ? current : Math.min(amount, isDowngrade ? current : available);
    if (!char.skills[stat]) char.skills[stat] = {};
    if (isDowngrade) {
      char.skills[stat][skill] = current - toChange;
      if (char.skills[stat][skill] <= 0) delete char.skills[stat][skill];
      if (Object.keys(char.skills[stat]).length === 0) delete char.skills[stat];
      char.meta.available_skill_points = available + toChange;
    } else {
      char.skills[stat][skill] = current + toChange;
      char.meta.available_skill_points = available - toChange;
    }
    await set(ref(db, `characters/${charId.toLowerCase()}`), char);
    setRefreshKey(k => k + 1);
  };

  const updateMysticalSkill = async (charId, stat, tier, category, skill, amount, isDowngrade = false) => {
    const charSnap = await get(ref(db, `characters/${charId.toLowerCase()}`));
    if (!charSnap.exists()) return;
    const char = charSnap.val();
    const available = char.meta?.available_skill_points || 0;
    if (!char.skills[stat]) char.skills[stat] = {};
    if (!char.skills[stat][tier]) char.skills[stat][tier] = {};
    if (!char.skills[stat][tier][category]) char.skills[stat][tier][category] = {};
    const current = char.skills[stat][tier][category][skill] || 0;
    let toChange = amount === 'reset' ? current : Math.min(amount, isDowngrade ? current : available);
    if (isDowngrade) {
      char.skills[stat][tier][category][skill] = current - toChange;
      if (char.skills[stat][tier][category][skill] <= 0) delete char.skills[stat][tier][category][skill];
      if (Object.keys(char.skills[stat][tier][category]).length === 0) delete char.skills[stat][tier][category];
      if (Object.keys(char.skills[stat][tier]).length === 0) delete char.skills[stat][tier];
      if (Object.keys(char.skills[stat]).length === 0) delete char.skills[stat];
      char.meta.available_skill_points = available + toChange;
    } else {
      char.skills[stat][tier][category][skill] = current + toChange;
      char.meta.available_skill_points = available - toChange;
    }
    await set(ref(db, `characters/${charId.toLowerCase()}`), char);
    setRefreshKey(k => k + 1);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        const snapshot = await get(ref(db, `characters/${characterName.toLowerCase()}`));
        if (!snapshot.exists()) {
          console.error("Character not found");
          return;
        }

        const characterData = snapshot.val();
        renderSkillTree(characterData);
      } catch (error) {
        console.error("Error loading character:", error);
      }
    });

    return () => unsubscribe();
  }, [characterName, navigate, refreshKey]);

  useEffect(() => {
    async function fetchData() {
      const charSnap = await get(ref(db, `characters/${characterName.toLowerCase()}`));
      if (charSnap.exists()) setCharacterData(charSnap.val());
      const templateSnap = await get(ref(db, 'template/skills'));
      if (templateSnap.exists()) setTemplateSkills(templateSnap.val());
    }
    fetchData();
  }, [characterName, refreshKey]);

  const renderSkillTree = async (characterData) => {
    if (!svgRef.current) return;

    const width = 2500;
    const height = 2500;
    const statRadius = 250;
    const skillRadiusStart = 240;
    const skillSpacing = 30;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height].join(" "))
      .style("background", "#111");

    // Create layers using defs and use
    const defs = svg.append("defs");
    const layers = {
      lines: svg.append("g").attr("class", "lines-layer"),
      nodes: svg.append("g").attr("class", "nodes-layer"),
      labels: svg.append("g").attr("class", "labels-layer")
    };

    // Get template data
    const templateSnapshot = await get(ref(db, "template"));
    const template = templateSnapshot.val();
    const skillData = template.skills;

    if (!skillData) {
      console.error("No skill data found in template");
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const statAngleMap = {};
    const angleStep = (2 * Math.PI) / statList.length;

    // Measure how many skills each stat has
    const skillCounts = statList.map((stat) =>
      mysticalStats.includes(stat) || !skillData?.[stat]
        ? 0
        : Object.keys(skillData[stat]).length
    );
    const maxSkills = Math.max(...skillCounts);
    const minSkills = Math.min(...skillCounts);

    // Add SVG filter for vibrant neon blue glow
    svg.select('defs').remove(); // Remove any previous filter
    defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')
      .html(`
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feFlood flood-color="#00eaff" result="color"/>
        <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      `);

    // --- Draw all connection lines first ---
    statList.forEach((stat, i) => {
      if (!skillData?.[stat] || mysticalStats.includes(stat)) return;
      const angle = i * angleStep;
      const x = centerX + statRadius * Math.cos(angle);
      const y = centerY + statRadius * Math.sin(angle);
      const skills = Object.keys(skillData[stat]);
      const count = skills.length;
      skills.forEach((skill, j) => {
        const norm = (count - minSkills) / (maxSkills - minSkills + 1e-6);
        const fanWidth = Math.PI / 4.5 - (Math.PI / 4.5 - Math.PI / 5) * norm;
        const offset = (j - (count - 1) / 2) * (fanWidth / count);
        const skillAngle = angle + offset;
        const radius = skillRadiusStart + j * skillSpacing;
        const skillX = centerX + Math.cos(skillAngle) * radius;
        const skillY = centerY + Math.sin(skillAngle) * radius;
        layers.lines.append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", skillX)
          .attr("y2", skillY)
          .attr("stroke", dullColors[stat])
          .attr("stroke-width", 1);
      });
    });

    // Helper function to create safe IDs
    const createSafeId = (str) => str.replace(/[^a-zA-Z0-9]/g, '_');

    // --- Draw all skill nodes (circles) ---
    statList.forEach((stat, i) => {
      if (!skillData?.[stat] || mysticalStats.includes(stat)) return;
      const angle = i * angleStep;
      const x = centerX + statRadius * Math.cos(angle);
      const y = centerY + statRadius * Math.sin(angle);
      const skills = Object.keys(skillData[stat]);
      const count = skills.length;
      skills.forEach((skill, j) => {
        const norm = (count - minSkills) / (maxSkills - minSkills + 1e-6);
        const fanWidth = Math.PI / 4.5 - (Math.PI / 4.5 - Math.PI / 5) * norm;
        const offset = (j - (count - 1) / 2) * (fanWidth / count);
        const skillAngle = angle + offset;
        const radius = skillRadiusStart + j * skillSpacing;
        const skillX = centerX + Math.cos(skillAngle) * radius;
        const skillY = centerY + Math.sin(skillAngle) * radius;
        const value = characterData.skills?.[stat]?.[skill] || 0;
        
        // Create safe IDs for this node
        const safeStatId = createSafeId(stat);
        const safeSkillId = createSafeId(skill);
        const labelId = `skill-label-${safeStatId}-${safeSkillId}`;
        
        // Draw skill node (circle)
        layers.nodes.append("circle")
          .attr("cx", skillX)
          .attr("cy", skillY)
          .attr("r", 5.5)
          .attr("fill", value > 0 ? brightColors[stat] : dullColors[stat])
          .style("cursor", "pointer")
          .on("mouseover", function () {
            d3.select(this).attr("filter", "brightness(1.3)");
            const label = layers.labels.select(`#${labelId}`);
            if (label.empty()) {
              console.warn(`Label not found: ${labelId} (${stat} - ${skill})`);
              return;
            }
            label.transition().duration(150)
              .attr("font-size", "16px")
              .style("opacity", 1)
              .raise();
          })
          .on("mouseout", function () {
            d3.select(this).attr("filter", null);
            const label = layers.labels.select(`#${labelId}`);
            if (label.empty()) {
              console.warn(`Label not found: ${labelId} (${stat} - ${skill})`);
              return;
            }
            label.transition().duration(150)
              .attr("font-size", "12px")
              .style("opacity", 0);
          })
          .on("click", function () {
            setModal({
              stat,
              skill,
              description: skillData[stat][skill]?.description || '',
              value,
              available: characterData.meta?.available_skill_points || 0,
              isMystical: mysticalStats.includes(stat),
              tier: null,
              category: null,
              charId: characterData.meta?.character_id,
            });
          });

        // Add skill label with safe ID
        layers.labels.append("text")
          .attr("id", labelId)
          .attr("x", skillX)
          .attr("y", skillY - 15)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#fff")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("stroke", dullColors[stat])
          .attr("stroke-width", 0.5)
          .attr("stroke-linejoin", "round")
          .text(skill)
          .style("pointer-events", "none")
          .style("opacity", 0);

        // Add skill level
        if (value > 0) {
          layers.labels.append("text")
            .attr("x", skillX)
            .attr("y", skillY + 15)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("font-size", "10px")
            .text(value)
            .style("pointer-events", "none");
        }
      });
    });

    // --- Draw all stat nodes (circles) ---
    statList.forEach((stat, i) => {
      if (!skillData?.[stat]) return;
      const angle = i * angleStep;
      const x = centerX + statRadius * Math.cos(angle);
      const y = centerY + statRadius * Math.sin(angle);
      
      // Create safe ID for stat
      const safeStatId = createSafeId(stat);
      const labelId = `stat-label-${safeStatId}`;
      
      // Draw stat node (circle)
      layers.nodes.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .attr("fill", brightColors[stat])
        .style("cursor", "pointer")
        .on("mouseover", function () {
          d3.select(this).attr("filter", "brightness(1.3)");
          const label = layers.labels.select(`#${labelId}`);
          if (label.empty()) {
            console.warn(`Label not found: ${labelId} (${stat})`);
            return;
          }
          label.transition().duration(150).attr("font-size", "24px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("filter", null);
          const label = layers.labels.select(`#${labelId}`);
          if (label.empty()) {
            console.warn(`Label not found: ${labelId} (${stat})`);
            return;
          }
          label.transition().duration(150).attr("font-size", "16px");
        })
        .on("click", function () {
          console.log("Stat node clicked:", stat);
        });

      // Add stat label with safe ID
      layers.labels.append("text")
        .attr("id", labelId)
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#fff")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("stroke", dullColors[stat])
        .attr("stroke-width", 0.5)
        .attr("stroke-linejoin", "round")
        .text(stat)
        .style("pointer-events", "none");
    });

    // Calculate center data
    const rank = calculateRank(characterData.skills || {});
    const totalUsed = getTotalSkillPoints(characterData.skills || {});
    const totalAvailable = characterData.meta?.available_skill_points || 0;
    const totalCapacity = totalUsed + totalAvailable;
    const centerXText = width / 2;
    const centerYText = height / 2;

    // Character name as dashboard title
    layers.labels.append("text")
      .attr("x", centerXText)
      .attr("y", centerYText - 80)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .text(`${characterData.meta?.character_id}'s Skilltree`);

    // Rank label
    layers.labels.append("text")
      .attr("x", centerXText)
      .attr("y", centerYText - 20)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`RANK: ${rank}`);

    // Skill points fraction — numerator (used)
    layers.labels.append("text")
      .attr("x", centerXText)
      .attr("y", centerYText + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${totalUsed}`);

    // Fraction line
    layers.labels.append("line")
      .attr("x1", centerXText - 20)
      .attr("x2", centerXText + 20)
      .attr("y1", centerYText + 20)
      .attr("y2", centerYText + 20)
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    // Denominator (available total)
    layers.labels.append("text")
      .attr("x", centerXText)
      .attr("y", centerYText + 42)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(`${totalCapacity}`);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        Object.values(layers).forEach(layer => {
          layer.attr("transform", event.transform);
        });
      });
    svg.call(zoom);

    // --- Auto-zoom to fit all stat nodes (after zoom is attached) ---
    setTimeout(() => {
      // Collect all stat and skill node positions
      const allNodes = [];
      // Stat nodes
      statList.forEach((stat, i) => {
        if (!skillData?.[stat]) return;
        const angle = i * angleStep;
        const x = centerX + statRadius * Math.cos(angle);
        const y = centerY + statRadius * Math.sin(angle);
        allNodes.push({ x, y });
        // Skill nodes for non-mystical stats
        if (!mysticalStats.includes(stat)) {
          const skills = Object.keys(skillData[stat]);
          const count = skills.length;
          skills.forEach((skill, j) => {
            const norm = (count - minSkills) / (maxSkills - minSkills + 1e-6);
            const fanWidth = Math.PI / 4.5 - (Math.PI / 4.5 - Math.PI / 5) * norm;
            const offset = (j - (count - 1) / 2) * (fanWidth / count);
            const skillAngle = angle + offset;
            const radius = skillRadiusStart + j * skillSpacing;
            const skillX = centerX + Math.cos(skillAngle) * radius;
            const skillY = centerY + Math.sin(skillAngle) * radius;
            allNodes.push({ x: skillX, y: skillY });
          });
        }
      });
      if (allNodes.length > 0) {
        const minX = Math.min(...allNodes.map(n => n.x));
        const maxX = Math.max(...allNodes.map(n => n.x));
        const minY = Math.min(...allNodes.map(n => n.y));
        const maxY = Math.max(...allNodes.map(n => n.y));
        const bboxWidth = maxX - minX;
        const bboxHeight = maxY - minY;
        const padding = 20;
        const fitWidth = width - padding * 2;
        const fitHeight = height - padding * 2;
        const scale = Math.min(fitWidth / bboxWidth, fitHeight / bboxHeight) * 1.4;
        const tx = width / 2 - ((minX + maxX) / 2) * scale;
        const ty = height / 2 - ((minY + maxY) / 2) * scale;
        svg.transition().duration(0).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
      }
    }, 0);
  };

  const SkillModal = modal && (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{ background: '#222', padding: 24, borderRadius: 12, color: 'white', textAlign: 'center', maxWidth: 400 }}>
        <h2>{modal.skill}</h2>
        <p>{modal.description || 'No description.'}</p>
        <p><strong>Current Level:</strong> {modal.value}</p>
        <p><strong>Available Skill Points:</strong> {modal.available}</p>
        <div style={{ margin: '12px 0' }}>
          <button onClick={async () => { await (modal.isMystical ? updateMysticalSkill(modal.charId, modal.stat, modal.tier, modal.category, modal.skill, 1) : updatePrimarySkill(modal.charId, modal.stat, modal.skill, 1)); setModal(null); }} disabled={modal.available < 1}>+1</button>
          <button onClick={async () => { await (modal.isMystical ? updateMysticalSkill(modal.charId, modal.stat, modal.tier, modal.category, modal.skill, 5) : updatePrimarySkill(modal.charId, modal.stat, modal.skill, 5)); setModal(null); }} disabled={modal.available < 1}>+5</button>
          <button onClick={async () => { await (modal.isMystical ? updateMysticalSkill(modal.charId, modal.stat, modal.tier, modal.category, modal.skill, modal.available) : updatePrimarySkill(modal.charId, modal.stat, modal.skill, modal.available)); setModal(null); }} disabled={modal.available < 1}>Max</button>
          <br />
          <button onClick={async () => { await (modal.isMystical ? updateMysticalSkill(modal.charId, modal.stat, modal.tier, modal.category, modal.skill, 1, true) : updatePrimarySkill(modal.charId, modal.stat, modal.skill, 1, true)); setModal(null); }} disabled={modal.value === 0}>-1</button>
          <button onClick={async () => { await (modal.isMystical ? updateMysticalSkill(modal.charId, modal.stat, modal.tier, modal.category, modal.skill, 5, true) : updatePrimarySkill(modal.charId, modal.stat, modal.skill, 5, true)); setModal(null); }} disabled={modal.value === 0}>-5</button>
          <button onClick={async () => { await (modal.isMystical ? updateMysticalSkill(modal.charId, modal.stat, modal.tier, modal.category, modal.skill, 'reset', true) : updatePrimarySkill(modal.charId, modal.stat, modal.skill, 'reset', true)); setModal(null); }} disabled={modal.value === 0}>Reset</button>
        </div>
        <button style={{ marginTop: 12 }} onClick={() => setModal(null)}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="skill-tree-container">
      <svg ref={svgRef}></svg>
      {SkillModal}
      {characterData && templateSkills && (
        <SkillCheckDrawer
          open={showSkillDrawer}
          onClose={() => setShowSkillDrawer((v) => !v)}
          characterData={characterData}
          templateSkills={templateSkills}
        />
      )}
      {characterData && (
        <CoreCheckDrawer
          open={showCoreDrawer}
          onClose={() => setShowCoreDrawer((v) => !v)}
          characterData={characterData}
        />
      )}
      {characterData && (
        <AbilityDrawer
          open={showAbilityDrawer}
          onClose={() => setShowAbilityDrawer((v) => !v)}
          characterData={characterData}
        />
      )}
      {!showSkillDrawer && (
        <button
          style={{ position: 'fixed', top: 16, left: 0, zIndex: 9999, padding: '10px 16px', borderRadius: '0 8px 8px 0', border: 'none', background: '#0af', color: 'white', cursor: 'pointer' }}
          onClick={() => setShowSkillDrawer(true)}
        >Skill Checks</button>
      )}
      {!showCoreDrawer && (
        <button
          style={{ position: 'fixed', top: 56, right: 0, zIndex: 9999, padding: '10px 16px', borderRadius: '8px 0 0 8px', border: 'none', background: '#0af', color: 'white', cursor: 'pointer' }}
          onClick={() => setShowCoreDrawer(true)}
        >Core Checks</button>
      )}
      {!showAbilityDrawer && (
        <button
          style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999, padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#0af', color: 'white', cursor: 'pointer' }}
          onClick={() => setShowAbilityDrawer(true)}
        >Show Abilities</button>
      )}
    </div>
  );
}

function getTotalSkillPoints(skills) {
  let total = 0;
  for (const stat in skills) {
    const statBlock = skills[stat];
    if (typeof statBlock !== "object") continue;
    for (const key in statBlock) {
      const value = statBlock[key];
      if (typeof value === "number") {
        total += value;
      } else if (typeof value === "object") {
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

function calculateRank(skills) {
  let totalPoints = 0;
  let unlockedStats = 0;
  for (const stat in skills) {
    const skillSet = skills[stat];
    const sum = Object.values(skillSet).reduce((a, b) => a + b, 0);
    if (sum > 0) unlockedStats += 1;
    totalPoints += sum;
  }
  const denominator = unlockedStats || 1;
  const score = Math.floor(totalPoints / denominator);
  if (score >= 201) return "SS";
  if (score >= 101) return "S";
  if (score >= 61) return "A";
  if (score >= 41) return "B";
  if (score >= 26) return "C";
  if (score >= 16) return "D";
  if (score >= 9) return "E";
  if (score >= 4) return "F";
  return "G";
}

export default SkillTree; 