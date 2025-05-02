// Firebase-integrated skill tree with popup interactions

import "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";

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
const db = firebase.database();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const tooltip = document.getElementById("tooltip");
const popup = document.getElementById("popup");
const popupOverlay = document.getElementById("popup-overlay");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const addPointBtn = document.getElementById("add-point");
const closePopupBtn = document.getElementById("close-popup");
const skillCounter = document.getElementById("skill-counter");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

const primaryStats = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const secondaryStats = ["Willpower", "Spirit", "Instinct", "Presence"];
const allStats = [...primaryStats, ...secondaryStats];

const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;
const circleRadius = 250;
const nodeRadius = 18;

const nodes = [];
let skillsByStat = {};
let characterSkills = {};

function layoutNodes() {
  nodes.length = 0;
  const total = allStats.length;
  for (let i = 0; i < total; i++) {
    const angle = (2 * Math.PI * i) / total - Math.PI / 2;
    const x = centerX() + circleRadius * Math.cos(angle);
    const y = centerY() + circleRadius * Math.sin(angle);
    nodes.push({ name: allStats[i], x, y, type: i < 6 ? "primary" : "secondary" });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  layoutNodes();

  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = node.type === "primary" ? "#68f" : "#6f8";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.name, node.x, node.y - nodeRadius - 8);

    // Stat-level skill usage counter
    const statSkills = characterSkills[node.name] || {};
    const count = Object.values(statSkills).reduce((a, b) => a + b, 0);
    if (count > 0) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(count, node.x, node.y + 4);
    }
  }

  console.log("Rendered nodes:", nodes.map(n => n.name));
}

draw();

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  tooltip.style.display = "none";
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (const node of nodes) {
    const dx = mx - node.x;
    const dy = my - node.y;
    if (dx * dx + dy * dy <= nodeRadius * nodeRadius) {
      if (skillsByStat[node.name]) openPopup(node);
      break;
    }
  }
});

function openPopup(node) {
  popupTitle.textContent = node.name;
  const skills = skillsByStat[node.name];
  if (skills) {
    popupDescription.innerHTML = `<div style="max-height: 300px; overflow-y: auto;">` +
      Object.entries(skills)
        .map(([skill, data]) => `<strong>${skill}</strong>: ${data.description}`)
        .join("<br><br>") + "</div>";
  } else {
    popupDescription.textContent = "No skills found for this stat.";
  }
  popupOverlay.style.display = "block";
  popup.style.display = "block";
}

closePopupBtn.onclick = () => {
  popup.style.display = "none";
  popupOverlay.style.display = "none";
};

function getCharacterName() {
  const params = new URLSearchParams(window.location.search);
  return params.get("character")?.toLowerCase();
}

async function loadSkillsFromFirebase() {
  const snapshot = await firebase.database().ref("template/skills").once("value");
  skillsByStat = snapshot.val() || {};
  await loadCharacterSkills();
  draw();
}

async function loadCharacterSkills() {
  const charName = getCharacterName();
  if (!charName) return;
  const snap = await firebase.database().ref(`characters/${charName}/skills`).once("value");
  characterSkills = snap.val() || {};

  let used = 0;
  Object.values(characterSkills).forEach(group => {
    Object.values(group).forEach(v => used += v);
  });

  const total = used;
  skillCounter.textContent = `${used} / ${total}`;
}

loadSkillsFromFirebase();