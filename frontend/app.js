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

let primaryStats = [];
let skillsData = {};

function loadTemplate() {
  const output = document.getElementById("template-output");
  output.innerHTML = "<p>Loading...</p>";

  db.ref("template").once("value")
    .then(templateSnapshot => {
      const template = templateSnapshot.val();
      if (!template || !template.primary_scores) {
        output.innerHTML = "<p>Template missing or malformed.</p>";
        return;
      }

      primaryStats = Object.keys(template.primary_scores);
      return db.ref("template/skills").once("value");
    })
    .then(snapshot => {
      skillsData = snapshot.val();
      if (!skillsData) {
        output.innerHTML = "<p>No skill data found in template.</p>";
        return;
      }

      const secondaryOrder = ["Instinct", "Presence", "Spirit", "Willpower"];
      let html = "";

      function buildSection(stat) {
        if (skillsData[stat]) {
          html += `
            <details style="margin-bottom: 1rem;">
              <summary style="font-weight: bold; text-decoration: underline; font-size: 1.2rem; cursor: pointer;">${stat}</summary>
              <ul style="margin-left: 1rem; margin-top: 0.5rem;">`;

          const statSkills = skillsData[stat];
          for (const skill in statSkills) {
            const desc = statSkills[skill].description || "No description";
            html += `<li style="margin-bottom: 0.3rem;"><strong>${skill}</strong>: ${desc}</li>`;
          }

          html += `</ul></details>`;
        }
      }

      primaryStats.forEach(stat => buildSection(stat));
      secondaryOrder.forEach(stat => buildSection(stat));

      output.innerHTML = html;

      populateSkillDropdowns(skillsData);
      loadCharacters();
    })
    .catch(err => {
      output.innerHTML = "<p>Error loading template or skills.</p>";
    });
}

function populateSkillDropdowns(skillsData) {
  primaryStats.forEach(stat => {
    const select = document.getElementById(`skill-select-${stat}`);
    const skillList = skillsData[stat];

    if (!select || !skillList) return;

    select.innerHTML = `<option value="">-- Choose a ${stat} skill --</option>`;
    for (const skill in skillList) {
      const option = document.createElement("option");
      option.value = skill;
      option.textContent = skill;
      select.appendChild(option);
    }
  });
}

function attachCreateForm() {
  const form = document.getElementById("create-character-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("new-character-name").value.trim();
    if (!name) return alert("Please enter a character name.");

    const templateRef = db.ref("template");
    const templateSnapshot = await templateRef.once("value");
    const template = templateSnapshot.val();

    if (!template || !template.primary_scores) {
      return alert("No valid template found in Firebase.");
    }

    template.meta.character_id = name;
    template.skills = {};

    let allChosen = true;

    primaryStats.forEach(stat => {
      const select = document.getElementById(`skill-select-${stat}`);
      const selectedSkill = select?.value?.trim();

      if (!selectedSkill) {
        allChosen = false;
      } else {
        template.skills[stat] = {
          [selectedSkill]: 1
        };
      }
    });

    if (!allChosen) return alert("Please choose a skill for every primary stat.");

    await db.ref(`characters/${name.toLowerCase()}`).set(template);

    alert(`Character '${name}' created!`);
    form.reset();
    loadCharacters();
  });
}

function loadCharacters() {
  const list = document.getElementById("character-list");
  list.innerHTML = "<li>Loading...</li>";

  db.ref("characters").once("value")
    .then(snapshot => {
      const characters = snapshot.val();
      list.innerHTML = "";

      if (!characters) {
        list.innerHTML = "<li>No characters found.</li>";
        return;
      }

      Object.entries(characters).forEach(([name, data]) => {
        const characterLi = document.createElement("li");
        characterLi.textContent = name;
        characterLi.style.cursor = "pointer";

        const detail = document.createElement("ul");
        detail.style.display = "none";
        detail.style.marginTop = "0.5rem";

        const scores = data.primary_scores || {};
        const secScores = data.secondary_scores || {};
        const skills = data.skills || {};

        const allStats = { ...scores, ...secScores };
        Object.entries(allStats).forEach(([stat, value]) => {
          const statLi = document.createElement("li");
          statLi.innerHTML = `<strong>${stat}</strong>: ${value}`;
          detail.appendChild(statLi);
        });

        Object.entries(skills).forEach(([stat, skillMap]) => {
          if (!skillMap) return;
          const entries = Object.entries(skillMap).filter(([, val]) => val > 0);
          if (entries.length === 0) return;

          const statLi = document.createElement("li");
          const formatted = entries.map(([skill, val]) => `${skill} (level ${val})`);
          statLi.innerHTML = `<em>${stat}</em>: ${formatted.join(", ")}`;
          detail.appendChild(statLi);
        });

        characterLi.onclick = () => {
          detail.style.display = detail.style.display === "none" ? "block" : "none";
        };

        list.appendChild(characterLi);
        if (detail.children.length > 0) list.appendChild(detail);
      });
    })
    .catch(err => {
      list.innerHTML = `<li>Error loading characters: ${err.message}</li>`;
    });
}

window.onload = () => {
  loadTemplate();
  attachCreateForm();
};
