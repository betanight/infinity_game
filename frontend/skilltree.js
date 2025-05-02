import {
  drawSkillNodes,
  getHoveredSkill
} from "./scripts/skilltree_functions.js";

window.onload = () => {
  const canvas = document.getElementById("skill-canvas");
  const ctx = canvas.getContext("2d");
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popup-text");
  const addPointBtn = document.getElementById("add-point");
  const closePopupBtn = document.getElementById("close-popup");
  const tooltip = document.getElementById("tooltip");
  const counter = document.getElementById("skill-counter");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 250;
  const skillNodeRadius = 10;

  let skillNodeMap = [];
  let statNodes = {};
  let characterName = "";
  let characterData = {};
  let skillsByStat = {};
  let used = 0;
  let total = 0;

  const statOrder = [
    "Strength", "Dexterity", "Constitution",
    "Intelligence", "Wisdom", "Charisma",
    "Willpower", "Spirit", "Instinct", "Presence"
  ];

  const topStats = statOrder.slice(0, 6);
  const bottomStats = statOrder.slice(6, 10);

  function layoutStatNodes() {
    const angleStepTop = Math.PI / (topStats.length - 1);
    const angleStepBottom = Math.PI / (bottomStats.length - 1);

    topStats.forEach((stat, i) => {
      const angle = Math.PI - (i * angleStepTop);
      statNodes[stat] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle
      };
    });

    bottomStats.forEach((stat, i) => {
      const angle = Math.PI + (i * angleStepBottom);
      statNodes[stat] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`${used} / ${total}`, centerX, centerY);

    for (const stat in statNodes) {
      const node = statNodes[stat];
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = topStats.includes(stat) ? "#3e8ed0" : "#47a447";
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(stat, node.x, node.y + 4);

      const skillGroup = characterData.skills?.[stat];
      if (skillGroup) {
        const skillPoints = Object.values(skillGroup).reduce((sum, val) => sum + val, 0);
        ctx.font = "bold 14px Arial";
        ctx.fillText(skillPoints, node.x, node.y - 25);
      }
    }

    skillNodeMap = [];
    drawSkillNodes(ctx, statNodes, skillsByStat, skillNodeRadius, skillNodeMap);
  }

  function showPopup(skillObj) {
    const stat = skillObj.stat;
    const skill = skillObj.skill;
    const desc = skillsByStat[stat]?.[skill]?.description || "No description.";

    popupText.textContent = `${skill}: ${desc}`;
    popup.style.display = "block";
  }

  function hidePopup() {
    popup.style.display = "none";
  }

  function updateCounter() {
    used = 0;
    total = 0;

    if (characterData.skills) {
      for (const stat in characterData.skills) {
        for (const val of Object.values(characterData.skills[stat])) {
          used += val;
        }
      }
    }

    if (characterData.primary_scores) {
      total = Object.values(characterData.primary_scores).reduce((a, b) => a + b, 0);
    }

    counter.textContent = `${used} / ${total}`;
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = getHoveredSkill(x, y, skillNodeMap);

    if (hovered) {
      tooltip.style.display = "block";
      tooltip.style.left = `${x + 15}px`;
      tooltip.style.top = `${y + 15}px`;
      tooltip.textContent = hovered.skill;
      canvas.style.cursor = "pointer";
    } else {
      tooltip.style.display = "none";
      canvas.style.cursor = "default";
    }
  });

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = getHoveredSkill(x, y, skillNodeMap);
    if (hovered) {
      showPopup(hovered);
    }
  });

  closePopupBtn.onclick = hidePopup;

  function getCharacterNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("character");
  }

  function fetchData() {
    characterName = getCharacterNameFromURL();
    if (!characterName) return;

    const db = firebase.database();
    const charRef = db.ref(`characters/${characterName.toLowerCase()}`);
    const skillRef = db.ref("template/skills");

    Promise.all([charRef.once("value"), skillRef.once("value")])
      .then(([charSnap, skillSnap]) => {
        characterData = charSnap.val() || {};
        skillsByStat = skillSnap.val() || {};
        updateCounter();
        layoutStatNodes();
        draw();
      });
  }

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    layoutStatNodes();
    draw();
  });

  fetchData();
};