import {
  drawSkillNodes,
  getHoveredSkill,
} from "./scripts/skilltree_functions.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "infinity-e0f55.firebaseapp.com",
  databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
  projectId: "infinity-e0f55",
  storageBucket: "infinity-e0f55.appspot.com",
  messagingSenderId: "120929977477",
  appId: "1:120929977477:web:45dc9989f834f69a9195ec",
  measurementId: "G-PFFQDN2MHX"
};

firebase.initializeApp(firebaseConfig);

window.onload = () => {
  const canvas = document.getElementById("skill-canvas");
  const ctx = canvas.getContext("2d");
  const popup = document.getElementById("popup");
  const popupText = document.getElementById("popup-text");
  const addPointBtn = document.getElementById("add-point");
  const closePopupBtn = document.getElementById("close-popup");
  const tooltip = document.getElementById("tooltip");
  const counter = document.getElementById("skill-counter");

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

  const primaryStats = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  const secondaryStats = ["Willpower", "Spirit", "Instinct", "Presence"];

  function layoutStatNodes() {
  statNodes = {};

  const orderedStats = [
    "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom",
    "Charisma", "Willpower", "Spirit", "Instinct", "Presence"
  ];

  orderedStats.forEach((stat, i) => {
    const angleDeg = 180 + (i * 36);
    const angleRad = (angleDeg % 360) * Math.PI / 180;
    statNodes[stat] = {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
      angle: angleRad
    };
  });
}

  function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 10; i++) {
    const angle = ((i + 0.5) * (2 * Math.PI)) / 10;
    const x = centerX + 2000 * Math.cos(angle);
    const y = centerY + 2000 * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (const stat in statNodes) {
    const node = statNodes[stat];

    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = primaryStats.includes(stat) ? "#3e8ed0" : "#47a447";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(stat, node.x, node.y - 28);

    const skillGroup = characterData.skills?.[stat];
    let skillPoints = 0;
    if (skillGroup) {
      skillPoints = Object.values(skillGroup).reduce((sum, val) => sum + val, 0);
    }

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = primaryStats.includes(stat) ? "white" : "#888";
    ctx.fillText(skillPoints, node.x, node.y + 5);
  }

  const boxWidth = 60;
  const boxHeight = 30;

  ctx.beginPath();
  ctx.roundRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight, 6);
  ctx.fillStyle = "#111";
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`${used} / ${total}`, centerX, centerY + 5);

  skillNodeMap = [];
  drawSkillNodes(ctx, statNodes, skillsByStat, characterData, skillNodeRadius, skillNodeMap, centerX, centerY);
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
    draw(); // ← only call draw after all data is loaded
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