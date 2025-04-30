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
        const skills = data.skills || {};
        const primary = data.primary_scores || {};
        const secondary = data.secondary_scores || {};

        let totalPoints = 0;
        Object.values(skills).forEach(skillGroup => {
          Object.values(skillGroup).forEach(val => {
            totalPoints += val;
          });
        });

        const characterLi = document.createElement("li");
        characterLi.textContent = `${name} (Character Power: ${totalPoints})`;
        characterLi.style.cursor = "pointer";

        const detail = document.createElement("ul");
        detail.style.display = "none";
        detail.style.marginTop = "0.5rem";

        const skillsDetails = document.createElement("details");
        const skillsSummary = document.createElement("summary");
        skillsSummary.textContent = "Skills";
        skillsDetails.appendChild(skillsSummary);

        Object.entries(skills).forEach(([stat, skillMap]) => {
          if (!skillMap) return;
          const entries = Object.entries(skillMap).filter(([, val]) => val > 0);
          if (entries.length === 0) return;

          entries.forEach(([skill, val]) => {
            const skillLi = document.createElement("li");
            skillLi.innerHTML = `<em>${stat}</em>: ${skill} (level ${val})`;
            skillsDetails.appendChild(skillLi);
          });
        });

        const statsDetails = document.createElement("details");
        const statsSummary = document.createElement("summary");
        statsSummary.textContent = "Stats";
        statsDetails.appendChild(statsSummary);

        const flatSkills = flattenSkills(skills);
        const tagsUsed = Object.keys(flatSkills);
        const usesTag = (...tags) => tags.some(tag => tagsUsed.includes(tag));
        let armorType = "unarmored";

        if (usesTag("Light Armor Training")) {
          armorType = "light";
        }
        if (usesTag("Heavy Armor Training")) {
          armorType = "heavy";
        }

        const statGroups = [
          {
            label: "Core Stats",
            items: [
              ["Health", visibleStatEquations.characterHealth(null, primary, flatSkills)],
              ["Movement Speed", visibleStatEquations.characterMovement(primary, flatSkills)],
              ["Armor", visibleStatEquations.characterArmor(primary, flatSkills, armorType)]
            ]
          },
          {
            label: "Raw Damage",
            items: [
              ["Raw Physical Damage", visibleStatEquations.rawPhysicalDamage(primary, flatSkills, null)]
            ]
          },
          {
            label: "Melee",
            items: [
              ...(usesTag("Brutish Melee") ? [
                ["Melee Accuracy (Brutish)", visibleStatEquations.meleeAttackAccuracy(primary, flatSkills, "Brutish Melee").totalAccuracy],
                ["Melee Damage (Brutish)", visibleStatEquations.meleeWeaponDamage(primary, flatSkills, "Brutish Melee", null)],
                ...["Spirit", "Arcane", "Willpower", "Presence"]
                  .filter(e => usesTag(e))
                  .map(e => [`Melee Damage (Brutish / ${e})`, visibleStatEquations.meleeWeaponDamage(primary, flatSkills, "Brutish Melee", e)])
              ] : []),
              ...(usesTag("Finesse Melee") ? [
                ["Melee Accuracy (Finesse)", visibleStatEquations.meleeAttackAccuracy(primary, flatSkills, "Finesse Melee").totalAccuracy],
                ["Melee Damage (Finesse)", visibleStatEquations.meleeWeaponDamage(primary, flatSkills, "Finesse Melee", null)],
                ...["Spirit", "Arcane", "Willpower", "Presence"]
                  .filter(e => usesTag(e))
                  .map(e => [`Melee Damage (Finesse / ${e})`, visibleStatEquations.meleeWeaponDamage(primary, flatSkills, "Finesse Melee", e)])
              ] : [])
            ]
          },
          {
            label: "Ranged",
            items: [
              ...(usesTag("Brutish Throw") ? [["Ranged Accuracy (Brutish Throw)", visibleStatEquations.rangedAttackAccuracy(primary, flatSkills, "Brutish Throw").totalAccuracy]] : []),
              ...(usesTag("Light Weapon") ? [["Ranged Accuracy (Light Weapon)", visibleStatEquations.rangedAttackAccuracy(primary, flatSkills, "Light Weapon").totalAccuracy]] : []),
              ...(usesTag("Bow Type") ? [["Ranged Accuracy (Bow Type)", visibleStatEquations.rangedAttackAccuracy(primary, flatSkills, "Bow Type").totalAccuracy]] : []),
              ...(usesTag("Firearm") ? [["Ranged Accuracy (Firearm)", visibleStatEquations.rangedAttackAccuracy(primary, flatSkills, "Firearm").totalAccuracy]] : []),

              ...(usesTag("Brutish Ranged") ? [
                ["Ranged Damage (Brutish)", visibleStatEquations.rangedWeaponDamage(primary, flatSkills, "Brutish Ranged", null)],
                ...["Spirit", "Arcane", "Willpower", "Presence"]
                  .filter(e => usesTag(e))
                  .map(e => [`Ranged Damage (Brutish / ${e})`, visibleStatEquations.rangedWeaponDamage(primary, flatSkills, "Brutish Ranged", e)])
              ] : []),
              ...(usesTag("Finesse Ranged") ? [
                ["Ranged Damage (Finesse)", visibleStatEquations.rangedWeaponDamage(primary, flatSkills, "Finesse Ranged", null)],
                ...["Spirit", "Arcane", "Willpower", "Presence"]
                  .filter(e => usesTag(e))
                  .map(e => [`Ranged Damage (Finesse / ${e})`, visibleStatEquations.rangedWeaponDamage(primary, flatSkills, "Finesse Ranged", e)])
              ] : [])
            ]
          },
          {
            label: "Energy",
            items: [
              ...(usesTag("Arcane") ? [["Energy Accuracy (Intelligence)", visibleStatEquations.energyAttackAccuracy(primary, flatSkills, "Intelligence").totalAccuracy]] : []),
              ...(usesTag("Wisdom") ? [["Energy Accuracy (Wisdom)", visibleStatEquations.energyAttackAccuracy(primary, flatSkills, "Wisdom").totalAccuracy]] : []),
              ...(usesTag("Spirit") ? [["Energy Accuracy (Spirit)", visibleStatEquations.energyAttackAccuracy(primary, flatSkills, "Spirit").totalAccuracy]] : []),
              ...(usesTag("Willpower") ? [["Energy Accuracy (Willpower)", visibleStatEquations.energyAttackAccuracy(primary, flatSkills, "Willpower").totalAccuracy]] : [])
            ]
          }
        ];

        statGroups.forEach(group => {
          if (group.items.length === 0) return;

          const detailSection = document.createElement("details");
          const summary = document.createElement("summary");
          summary.textContent = group.label;
          detailSection.appendChild(summary);

          group.items.forEach(([label, value]) => {
            if (value === null || value === undefined) return;
            const statLi = document.createElement("li");
            statLi.innerHTML = `<strong>${label}</strong>: ${Math.round(value)}`;
            detailSection.appendChild(statLi);
          });

          statsDetails.appendChild(detailSection);
        });


        detail.appendChild(skillsDetails);
        detail.appendChild(statsDetails);

        characterLi.onclick = () => {
          detail.style.display = detail.style.display === "none" ? "block" : "none";
        };

        list.appendChild(characterLi);
        list.appendChild(detail);
      });
    })
    .catch(err => {
      list.innerHTML = `<li>Error loading characters: ${err.message}</li>`;
    });
}

function flattenSkills(skills) {
  const flat = {};
  Object.values(skills).forEach(skillGroup => {
    Object.entries(skillGroup).forEach(([name, val]) => {
      flat[name] = val;
    });
  });
  return flat;
}

window.onload = () => {
  loadTemplate();
  attachCreateForm();
};
