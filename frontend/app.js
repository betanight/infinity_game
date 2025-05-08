import visibleStatEquations from "./scripts/visible_stat_equations.js";
import { firebaseConfig } from "./firebaseConfig.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let primaryStats = [];
let skillsData = {};

function loadTemplate() {
  const output = document.getElementById("template-output");
  output.innerHTML = "<p>Loading...</p>";

  db.ref("template")
    .once("value")
    .then((templateSnapshot) => {
      const template = templateSnapshot.val();
      if (!template || !template.primary_scores) {
        output.innerHTML = "<p>Template missing or malformed.</p>";
        return;
      }

      primaryStats = Object.keys(template.primary_scores);
      return db.ref("template/skills").once("value");
    })
    .then((snapshot) => {
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

      primaryStats.forEach((stat) => buildSection(stat));
      secondaryOrder.forEach((stat) => buildSection(stat));

      output.innerHTML = html;

      populateSkillDropdowns(skillsData);
      loadCharacters();
    })
    .catch((err) => {
      output.innerHTML = "<p>Error loading template or skills.</p>";
    });
}

function populateSkillDropdowns(skillsData) {
  primaryStats.forEach((stat) => {
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

    primaryStats.forEach((stat) => {
      const select = document.getElementById(`skill-select-${stat}`);
      const selectedSkill = select?.value?.trim();

      if (!selectedSkill) {
        allChosen = false;
      } else {
        template.skills[stat] = {
          [selectedSkill]: 1,
        };
      }
    });

    if (!allChosen)
      return alert("Please choose a skill for every primary stat.");

    await db.ref(`characters/${name.toLowerCase()}`).set(template);

    alert(`Character '${name}' created!`);
    form.reset();
    loadCharacters();
  });
}

function loadCharacters() {
  const list = document.getElementById("character-list");
  list.innerHTML = "<li>Loading...</li>";

  db.ref("characters")
    .once("value")
    .then((snapshot) => {
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
        Object.values(skills).forEach((skillGroup) => {
          Object.values(skillGroup).forEach((val) => {
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
        skillsSummary.innerHTML = `<a href="skilltree.html?character=${name}" style="color: inherit; text-decoration: underline;">Skills</a>`;
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
        const usesTag = (...tags) => tags.some((tag) => tagsUsed.includes(tag));
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
              (() => {
                const healthStats = visibleStatEquations.characterHealth(
                  undefined,
                  primary,
                  flatSkills
                );
                return ["Health", healthStats.maxHealth];
              })(),
              [
                "Movement Speed",
                visibleStatEquations.characterMovement(primary, flatSkills),
              ],
              [
                "Armor",
                visibleStatEquations.characterArmor(
                  primary,
                  flatSkills,
                  armorType
                ),
              ],
              [
                "Raw Physical Damage",
                visibleStatEquations.rawPhysicalDamage(
                  primary,
                  flatSkills,
                  null
                ),
              ],
              (() => {
                const acc = visibleStatEquations.rawMeleeAccuracy(
                  primary,
                  flatSkills
                );
                console.log("Raw Melee Accuracy Debug:", acc);

                if (typeof acc !== "number" || isNaN(acc)) {
                  console.warn("Raw Melee Accuracy is not a valid number.");
                  return ["Raw Melee Accuracy", "Invalid"];
                }

                const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                const formatted = `${min} - ${acc}`;
                console.log("Formatted Raw Melee Accuracy:", formatted);
                return ["Raw Melee Accuracy", formatted];
              })(),
            ],
          },
          {
            label: "Melee",
            items: [
              ...(usesTag("Brutish Melee")
                ? [
                    (() => {
                      const acc = visibleStatEquations.meleeAttackAccuracy(
                        primary,
                        flatSkills,
                        "Brutish Melee"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Melee Accuracy (Brutish)", `${min} - ${acc}`];
                    })(),
                    [
                      "Melee Damage (Brutish)",
                      visibleStatEquations.meleeWeaponDamage(
                        primary,
                        flatSkills,
                        "Brutish Melee",
                        null
                      ),
                    ],
                    ...["Spirit", "Arcane", "Willpower", "Presence"]
                      .filter((e) => usesTag(e))
                      .map((e) => [
                        `Melee Damage (Brutish / ${e})`,
                        visibleStatEquations.meleeWeaponDamage(
                          primary,
                          flatSkills,
                          "Brutish Melee",
                          e
                        ),
                      ]),
                  ]
                : []),
              ...(usesTag("Finesse Melee")
                ? [
                    (() => {
                      const acc = visibleStatEquations.meleeAttackAccuracy(
                        primary,
                        flatSkills,
                        "Finesse Melee"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Melee Accuracy (Finesse)", `${min} - ${acc}`];
                    })(),
                    [
                      "Melee Damage (Finesse)",
                      visibleStatEquations.meleeWeaponDamage(
                        primary,
                        flatSkills,
                        "Finesse Melee",
                        null
                      ),
                    ],
                    ...["Spirit", "Arcane", "Willpower", "Presence"]
                      .filter((e) => usesTag(e))
                      .map((e) => [
                        `Melee Damage (Finesse / ${e})`,
                        visibleStatEquations.meleeWeaponDamage(
                          primary,
                          flatSkills,
                          "Finesse Melee",
                          e
                        ),
                      ]),
                  ]
                : []),
            ],
          },
          {
            label: "Ranged",
            items: [
              ...(usesTag("Brutish Throw")
                ? [
                    (() => {
                      const acc = visibleStatEquations.rangedAttackAccuracy(
                        primary,
                        flatSkills,
                        "Brutish Throw"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return [
                        "Ranged Accuracy (Brutish Throw)",
                        `${min} - ${acc}`,
                      ];
                    })(),
                  ]
                : []),
              ...(usesTag("Light Weapon")
                ? [
                    (() => {
                      const acc = visibleStatEquations.rangedAttackAccuracy(
                        primary,
                        flatSkills,
                        "Light Weapon"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return [
                        "Ranged Accuracy (Light Weapon)",
                        `${min} - ${acc}`,
                      ];
                    })(),
                  ]
                : []),
              ...(usesTag("Bow Type")
                ? [
                    (() => {
                      const acc = visibleStatEquations.rangedAttackAccuracy(
                        primary,
                        flatSkills,
                        "Bow Type"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Ranged Accuracy (Bow Type)", `${min} - ${acc}`];
                    })(),
                  ]
                : []),
              ...(usesTag("Firearm")
                ? [
                    (() => {
                      const acc = visibleStatEquations.rangedAttackAccuracy(
                        primary,
                        flatSkills,
                        "Firearm"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Ranged Accuracy (Firearm)", `${min} - ${acc}`];
                    })(),
                  ]
                : []),

              ...(usesTag("Brutish Ranged")
                ? [
                    [
                      "Ranged Damage (Brutish)",
                      visibleStatEquations.rangedWeaponDamage(
                        primary,
                        flatSkills,
                        "Brutish Ranged",
                        null
                      ),
                    ],
                    ...["Spirit", "Arcane", "Willpower", "Presence"]
                      .filter((e) => usesTag(e))
                      .map((e) => [
                        `Ranged Damage (Brutish / ${e})`,
                        visibleStatEquations.rangedWeaponDamage(
                          primary,
                          flatSkills,
                          "Brutish Ranged",
                          e
                        ),
                      ]),
                  ]
                : []),
              ...(usesTag("Finesse Ranged")
                ? [
                    [
                      "Ranged Damage (Finesse)",
                      visibleStatEquations.rangedWeaponDamage(
                        primary,
                        flatSkills,
                        "Finesse Ranged",
                        null
                      ),
                    ],
                    ...["Spirit", "Arcane", "Willpower", "Presence"]
                      .filter((e) => usesTag(e))
                      .map((e) => [
                        `Ranged Damage (Finesse / ${e})`,
                        visibleStatEquations.rangedWeaponDamage(
                          primary,
                          flatSkills,
                          "Finesse Ranged",
                          e
                        ),
                      ]),
                  ]
                : []),
            ],
          },
          {
            label: "Energy",
            items: [
              ...(usesTag("Arcane")
                ? [
                    (() => {
                      const acc = visibleStatEquations.energyAttackAccuracy(
                        primary,
                        flatSkills,
                        "Intelligence"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return [
                        "Energy Accuracy (Intelligence)",
                        `${min} - ${acc}`,
                      ];
                    })(),
                  ]
                : []),
              ...(usesTag("Wisdom")
                ? [
                    (() => {
                      const acc = visibleStatEquations.energyAttackAccuracy(
                        primary,
                        flatSkills,
                        "Wisdom"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Energy Accuracy (Wisdom)", `${min} - ${acc}`];
                    })(),
                  ]
                : []),
              ...(usesTag("Spirit")
                ? [
                    (() => {
                      const acc = visibleStatEquations.energyAttackAccuracy(
                        primary,
                        flatSkills,
                        "Spirit"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Energy Accuracy (Spirit)", `${min} - ${acc}`];
                    })(),
                  ]
                : []),
              ...(usesTag("Willpower")
                ? [
                    (() => {
                      const acc = visibleStatEquations.energyAttackAccuracy(
                        primary,
                        flatSkills,
                        "Willpower"
                      ).totalAccuracy;
                      const min = Math.max(1, Math.floor(Math.sqrt(acc)));
                      return ["Energy Accuracy (Willpower)", `${min} - ${acc}`];
                    })(),
                  ]
                : []),
            ],
          },
        ];

        statGroups.forEach((group) => {
          if (group.items.length === 0) return;

          const detailSection = document.createElement("details");
          const summary = document.createElement("summary");
          summary.textContent = group.label;
          detailSection.appendChild(summary);

          group.items.forEach(([label, value]) => {
            if (value === null || value === undefined) return;
            const statLi = document.createElement("li");
            statLi.innerHTML = `<strong>${label}</strong>: ${
              typeof value === "number" ? Math.round(value) : value
            }`;
            detailSection.appendChild(statLi);
          });

          detail.appendChild(detailSection); // Directly append to character detail
        });

        detail.appendChild(skillsDetails);

        skillsSummary.onclick = () => {
          window.location.href = `frontend/skilltree/index.html?char=${encodeURIComponent(
            name
          )}`;
        };

        list.appendChild(characterLi);
        list.appendChild(detail);
      });
    })
    .catch((err) => {
      list.innerHTML = `<li>Error loading characters: ${err.message}</li>`;
    });
}

function flattenSkills(skills) {
  const flat = {};
  Object.values(skills).forEach((skillGroup) => {
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
