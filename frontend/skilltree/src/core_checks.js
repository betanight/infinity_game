export function createCoreCheckDrawer(characterData) {
  const coreDrawer = document.createElement("div");
  coreDrawer.id = "corecheck-drawer";
  coreDrawer.style.position = "fixed";
  coreDrawer.style.top = "0";
  coreDrawer.style.left = "-260px";
  coreDrawer.style.width = "240px";
  coreDrawer.style.height = "100vh";
  coreDrawer.style.background = "#1e1e1e";
  coreDrawer.style.color = "white";
  coreDrawer.style.zIndex = 9997;
  coreDrawer.style.padding = "120px 16px 16px";
  coreDrawer.style.transition = "left 0.3s ease-in-out";
  coreDrawer.style.overflowY = "auto";
  coreDrawer.style.boxShadow = "2px 0 10px rgba(0,0,0,0.7)";
  document.body.appendChild(coreDrawer);

  const coreBtn = document.createElement("button");
  coreBtn.textContent = "Core Checks";
  coreBtn.style.position = "fixed";
  coreBtn.style.top = "64px";
  coreBtn.style.left = "0px";
  coreBtn.style.zIndex = 9999;
  coreBtn.style.padding = "10px 16px";
  coreBtn.style.borderRadius = "0 8px 8px 0";
  coreBtn.style.border = "none";
  coreBtn.style.background = "#0af";
  coreBtn.style.color = "white";
  coreBtn.style.cursor = "pointer";
  document.body.appendChild(coreBtn);

  let coreOpen = false;
  coreBtn.onclick = () => {
    coreOpen = !coreOpen;
    coreDrawer.style.left = coreOpen ? "0px" : "-260px";
    coreBtn.textContent = coreOpen ? "Hide Core" : "Core Checks";
    if (coreOpen) renderCoreChecks(coreDrawer, characterData);
  };
}

function renderCoreChecks(container, characterData) {
  container.innerHTML = "<h2 style='margin-bottom:16px;'>Core Stats</h2>";

  const primary = characterData.primary_scores || {};
  const coreStats = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  coreStats.forEach((stat) => {
    const score = primary[stat] || 0;
    const min = 10;
    const max = 10 + score;

    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginBottom = "6px";

    const label = document.createElement("span");
    label.textContent = `${stat} (${score})`;

    const rollBtn = document.createElement("button");
    rollBtn.textContent = "🎲";
    rollBtn.style.marginLeft = "6px";
    rollBtn.style.padding = "2px 8px";
    rollBtn.style.borderRadius = "6px";
    rollBtn.style.border = "none";
    rollBtn.style.background = "#0af";
    rollBtn.style.color = "white";
    rollBtn.style.cursor = "pointer";

    rollBtn.onclick = () => {
      const roll = Math.floor(Math.random() * (max - min + 1)) + min;

      let result = div.querySelector(".roll-result");
      if (!result) {
        result = document.createElement("div");
        result.className = "roll-result";
        result.style.fontSize = "12px";
        result.style.color = "#ccc";
        result.style.marginLeft = "8px";
        result.style.marginTop = "2px";
        div.appendChild(result);
      }

      result.innerHTML = `🎲 <strong>${roll}</strong> (range ${min}–${max})`;
    };

    div.appendChild(label);
    div.appendChild(rollBtn);
    container.appendChild(div);
  });
}
