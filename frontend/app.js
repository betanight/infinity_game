// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function loadCharacters() {
  db.ref("characters").once("value")
    .then(snapshot => {
      const characters = snapshot.val();
      const list = document.getElementById("character-list");
      list.innerHTML = "";

      if (characters) {
        Object.keys(characters).forEach(name => {
          const li = document.createElement("li");
          li.textContent = name;
          li.style.cursor = "pointer";

          const details = document.createElement("div");
          details.style.display = "none";
          details.style.marginLeft = "20px";
          details.style.marginTop = "5px";

          li.addEventListener("click", () => {
            if (details.style.display === "none") {
              details.style.display = "block";
              loadCharacterSkills(name, details);
            } else {
              details.style.display = "none";
            }
          });

          list.appendChild(li);
          list.appendChild(details);
        });
      } else {
        list.innerHTML = "<li>No characters found.</li>";
      }
    })
    .catch(err => console.error("Error loading characters:", err));
}

function loadCharacterSkills(name, detailsContainer) {
  db.ref(`characters/${name}/skills`).once("value")
    .then(snapshot => {
      const skills = snapshot.val();
      if (!skills) {
        detailsContainer.innerHTML = "<i>No skills found.</i>";
        return;
      }

      const primaryStats = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
      const lines = [];

      primaryStats.forEach(stat => {
        if (skills[stat]) {
          const statSkills = skills[stat];
          const selectedSkill = Object.keys(statSkills).find(skillName => statSkills[skillName].effective_value > 0);
          if (selectedSkill) {
            lines.push(`${stat}: ${selectedSkill} (Level ${statSkills[selectedSkill].effective_value})`);
          } else {
            lines.push(`${stat}: Empty`);
          }
        } else {
          lines.push(`${stat}: Empty`);
        }
      });

      detailsContainer.innerHTML = lines.map(line => `<div>${line}</div>`).join("");
    })
    .catch(err => {
      console.error("Error loading skills:", err);
      detailsContainer.innerHTML = "<i>Error loading skills.</i>";
    });
}

function loadTemplate() {
  db.ref("template").once("value")
    .then(snapshot => {
      const template = snapshot.val();
      const output = document.getElementById("template-output");
      output.textContent = JSON.stringify(template, null, 2);
    })
    .catch(err => console.error("Error loading template:", err));
}

window.onload = function() {
  loadCharacters();
  loadTemplate();
};
