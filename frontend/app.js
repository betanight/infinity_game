import { firebaseConfig } from "./skilltree/src/firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Add auth state listener
onAuthStateChanged(auth, (user) => {
  const signOutBtn = document.querySelector(".sign-out-btn");
  if (user) {
    signOutBtn.style.display = "block";
    // Check admin status when user is authenticated
    checkAdminAndSetupEquipment(user);
  } else {
    signOutBtn.style.display = "none";
  }
});

// Add sign out handler
document.querySelector(".sign-out-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.reload(); // Reload the page to reset the state
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out. Please try again.");
  }
});

async function checkAdminAndSetupEquipment(user) {
  try {
    const adminSnapshot = await get(ref(db, `admins/${user.uid}`));
    const isAdmin = adminSnapshot.val() === true;
    const isSpecialUser = user.uid === "ch1yWOwbx7h2QUXQsSjj0pqVw8d2";

    console.log("Admin check:", {
      uid: user.uid,
      isAdmin,
      isSpecialUser,
    });

    if (isAdmin || isSpecialUser) {
      attachEquipmentCreator();
    }
  } catch (err) {
    console.error("Error checking admin status:", err);
  }
}

let primaryStats = [];
let skillsData = {};

function loadTemplate() {
  const output = document.getElementById("template-output");
  output.innerHTML = "<p>Loading...</p>";

  get(ref(db, "template"))
    .then((templateSnapshot) => {
      const template = templateSnapshot.val();
      if (!template || !template.primary_scores) {
        output.innerHTML = "<p>Template missing or malformed.</p>";
        return;
      }

      primaryStats = Object.keys(template.primary_scores);
      return get(ref(db, "template/skills"));
    })
    .then((snapshot) => {
      skillsData = snapshot.val();
      if (!skillsData) {
        output.innerHTML = "<p>No skill data found in template.</p>";
        return;
      }

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

    const templateSnapshot = await get(ref(db, "template"));
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

    // ✅ CHECK AUTH FIRST
    const user = auth.currentUser;

    console.log("🧪 currentUser UID:", user?.uid);

    if (!user) {
      alert("You must be signed in to create characters.");
      return;
    }

    // ✅ Now safe to write
    await set(ref(db, `characters/${name.toLowerCase()}`), template);

    alert(`Character '${name}' created!`);
    form.reset();
    loadCharacters();
  });
}

function flattenSkills(skills) {
  const flat = {};

  function dive(obj) {
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === "number") {
        flat[key] = (flat[key] || 0) + val;
      } else if (typeof val === "object" && val !== null) {
        dive(val); // go deeper
      }
    }
  }

  dive(skills);
  return flat;
}

function loadCharacters() {
  const list = document.getElementById("character-list");
  list.innerHTML = "<li>Loading...</li>";

  get(ref(db, "characters"))
    .then((snapshot) => {
      const characters = snapshot.val();
      list.innerHTML = "";

      if (!characters) {
        list.innerHTML = "<li>No characters found.</li>";
        return;
      }

      Object.entries(characters).forEach(([name, data]) => {
        const skills = data.skills || {};
        const flatSkills = flattenSkills(skills);
        const totalUsedPoints = Object.values(flatSkills).reduce(
          (sum, val) => sum + val,
          0
        );

        let available = data.meta?.available_skill_points || 0;
        let totalAvailable = available + totalUsedPoints;

        const characterLi = document.createElement("li");

        // Header with name + editable total points
        const header = document.createElement("div");

        // Create the name link
        const nameLink = document.createElement("a");
        nameLink.href = `/skilltree/index.html?char=${encodeURIComponent(
          name
        )}`;
        nameLink.innerHTML = `<strong>${name}</strong>`;
        nameLink.style.color = "inherit";
        nameLink.style.textDecoration = "none";
        nameLink.style.cursor = "pointer";

        header.appendChild(nameLink);
        header.innerHTML += ` <span style="margin-left: 1rem;">Total Points:</span>`;

        const decrement = document.createElement("button");
        decrement.textContent = "−";
        decrement.style.margin = "0 0.3rem";

        const counter = document.createElement("span");
        counter.textContent = totalAvailable;
        counter.style.margin = "0 0.3rem";

        const increment = document.createElement("button");
        increment.textContent = "+";

        header.appendChild(decrement);
        header.appendChild(counter);
        header.appendChild(increment);

        // Ascension button
        const ascendBtn = document.createElement("button");
        ascendBtn.textContent = "Ascension";
        ascendBtn.style.marginLeft = "1rem";
        ascendBtn.onclick = async (e) => {
          const choice = prompt(
            "Choose an ascension path:\n- Willpower\n- Presence\n- Spirit\n- Arcane"
          )?.trim();
          if (!["Willpower", "Presence", "Spirit", "Arcane"].includes(choice)) {
            alert("Invalid choice.");
            return;
          }

          const capitalized = choice.charAt(0).toUpperCase() + choice.slice(1);

          try {
            const tierSnap = await get(
              ref(db, `template/skills/${capitalized}/Tier 1`)
            );
            const tierData = tierSnap.val();

            if (!tierData) {
              alert(`No Tier 1 skills found for ${capitalized}`);
              return;
            }

            const categories = Object.keys(tierData);
            const randomCategory =
              categories[Math.floor(Math.random() * categories.length)];
            const skillList = Object.keys(tierData[randomCategory]);
            const randomSkill =
              skillList[Math.floor(Math.random() * skillList.length)];

            const charKey = name.toLowerCase(); // normalize usage
            const skillPath = `characters/${charKey}/skills/${capitalized}/Tier 1/${randomCategory}/${randomSkill}`;
            const scorePath = `characters/${charKey}/secondary_scores/${capitalized}`;
            const unlockPath = `characters/${charKey}/meta/unlocked_trees/${capitalized}`;
            await set(ref(db, unlockPath), true);
            await set(ref(db, scorePath), 1);
            await set(ref(db, skillPath), 1);

            console.log("✅ Ascension complete:", {
              unlockPath,
              scorePath,
              skillPath,
            });

            alert(
              `${capitalized} tree unlocked. 1 point added to "${randomSkill}" under ${randomCategory}.`
            );
          } catch (err) {
            console.error("Ascension error:", err);
            alert("Something went wrong during ascension.");
          }
        };
        header.appendChild(ascendBtn);

        characterLi.appendChild(header);

        const updateFirebase = (value) => {
          const newAvailable = value - totalUsedPoints;
          set(
            ref(db, `characters/${name}/meta/available_skill_points`),
            newAvailable
          );
        };

        decrement.onclick = (e) => {
          if (totalAvailable > totalUsedPoints) {
            totalAvailable--;
            counter.textContent = totalAvailable;
            updateFirebase(totalAvailable);
          }
        };
        increment.onclick = (e) => {
          totalAvailable++;
          counter.textContent = totalAvailable;
          updateFirebase(totalAvailable);
        };

        list.appendChild(characterLi);
      });
    })
    .catch((err) => {
      list.innerHTML = `<li>Error loading characters: ${err.message}</li>`;
    });
}

function attachEquipmentCreator() {
  const container = document.createElement("div");
  container.innerHTML = `
    <div style="display: flex; gap: 20px;">
      <div style="flex: 1;">
        <h3>Create Custom Equipment</h3>
        <input type="text" id="equip-name" placeholder="Enter equipment name" style="margin-bottom: 0.5rem;">
        <select id="equip-type">
          <option value="">-- Select Type --</option>
          <option value="Armor">Armor</option>
          <option value="weapon">Weapon</option>
          <option value="item">Item</option>
        </select>
        <select id="weapon-range" style="display:none">
          <option value="">-- Select Range --</option>
          <option value="Melee">Melee</option>
          <option value="Ranged">Ranged</option>
        </select>
        <select id="equip-category">
          <option value="">-- Select Category --</option>
        </select>
        <select id="equip-rarity">
          <option value="">-- Select Rarity --</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Epic</option>
          <option value="Legendary">Legendary</option>
        </select>
        <select id="equip-bonus">
          <option value="">-- Select Bonus Type --</option>
          <option value="Strength">Strength</option>
          <option value="Dexterity">Dexterity</option>
          <option value="Constitution">Constitution</option>
          <option value="Intelligence">Intelligence</option>
          <option value="Wisdom">Wisdom</option>
          <option value="Charisma">Charisma</option>
        </select>
        <select id="equip-value">
          <option value="">-- Select Bonus Value --</option>
          ${Array.from({ length: 11 }, (_, i) => i - 5)
            .sort((a, b) => a - b) // Sort from -5 to +5
            .map(
              (n) =>
                `<option value="${n}" ${n === 0 ? "selected" : ""}>${
                  n >= 0 ? "+" : ""
                }${n}</option>`
            )
            .join("")}
        </select>
        <select id="equip-player">
          <option value="">-- Select Player --</option>
        </select>
        <button id="create-equip-btn">Create Equipment</button>
      </div>
      
      <div style="flex: 1;">
        <h3>Equipment Templates</h3>
        <div id="template-equipment"></div>
      </div>
    </div>`;

  document.body.appendChild(container);

  // Initialize event handlers
  const typeSelect = document.getElementById("equip-type");
  const weaponRange = document.getElementById("weapon-range");
  const categorySelect = document.getElementById("equip-category");

  typeSelect.addEventListener("change", () => {
    const type = typeSelect.value;
    weaponRange.style.display = "none";
    categorySelect.innerHTML =
      '<option value="">-- Select Category --</option>';

    if (type === "Armor") {
      categorySelect.innerHTML += `<option value="Light">Light</option><option value="Heavy">Heavy</option><option value="Unarmored">Unarmored</option>`;
    } else if (type === "weapon") {
      weaponRange.style.display = "inline";
      // Don't set any default options - they will be set by the range change event
    } else if (type === "item") {
      categorySelect.innerHTML += `<option value="Potion">Potion</option><option value="Ring">Ring</option><option value="Scroll">Scroll</option>`;
    }
  });

  weaponRange.addEventListener("change", () => {
    const rangeType = weaponRange.value;
    categorySelect.innerHTML =
      '<option value="">-- Select Category --</option>';
    if (rangeType === "Melee") {
      categorySelect.innerHTML += `<option value="Sword">Sword</option><option value="Axe">Axe</option><option value="Staff">Staff</option><option value="Dagger">Dagger</option>`;
    } else if (rangeType === "Ranged") {
      categorySelect.innerHTML += `<option value="Bow">Bow</option><option value="Longbow">Longbow</option><option value="Crossbow">Crossbow</option><option value="Heavy Crossbow">Heavy Crossbow</option><option value="Dart">Dart</option><option value="Sling">Sling</option>`;
    }
  });

  // Load and display equipment templates
  loadEquipmentTemplates();

  // Populate player list from Firebase
  get(ref(db, "characters"))
    .then((snapshot) => {
      const players = snapshot.val() || {};
      const playerSelect = document.getElementById("equip-player");
      playerSelect.innerHTML = `<option value="">-- Select Player --</option>`;

      if (Object.keys(players).length === 0) {
        console.log("No players found in database");
        return;
      }

      Object.keys(players).forEach((player) => {
        playerSelect.innerHTML += `<option value="${player}">${player}</option>`;
      });
    })
    .catch((err) => {
      console.error("Error loading players:", err);
      const playerSelect = document.getElementById("equip-player");
      playerSelect.innerHTML = `<option value="">Error loading players</option>`;
    });

  document.getElementById("create-equip-btn").onclick = async () => {
    const type = document.getElementById("equip-type").value;
    const category = document.getElementById("equip-category").value;
    const rarity = document.getElementById("equip-rarity").value;
    const bonus = document.getElementById("equip-bonus").value;
    const value = parseInt(document.getElementById("equip-value").value);
    const charId = document.getElementById("equip-player").value;
    const equipName = document.getElementById("equip-name").value.trim();

    if (!type || !category || !charId || !equipName) {
      alert("Please fill in all fields including name and select a player.");
      return;
    }

    const itemData = {
      name: equipName,
      category,
      rarity,
      bonuses: [{ type: bonus, value }],
    };

    const refPath = `characters/${charId.toLowerCase()}/Equipment/${type}`;
    console.log("Attempting to write to:", refPath);

    try {
      await push(ref(db, refPath), itemData);
      alert(`✅ Equipment created for ${charId}: ${category}`);
      displayAllEquipment(); // Refresh the equipment display after creating new item
    } catch (err) {
      console.error("❌ Error pushing equipment:", err);
      alert(`Failed to create equipment: ${err.message}`);
    }
  };

  // Add equipment display container
  const equipmentDisplayContainer = document.createElement("div");
  equipmentDisplayContainer.id = "equipment-display";
  equipmentDisplayContainer.innerHTML = "<h3>All Equipment</h3>";
  document.body.appendChild(equipmentDisplayContainer);

  // Initial display of equipment
  displayAllEquipment();
}

async function displayAllEquipment() {
  const container = document.getElementById("equipment-display");
  if (!container) return;

  // Add CSS for the popup
  if (!document.getElementById("equipment-popup-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "equipment-popup-styles";
    styleSheet.textContent = `
      .delete-popup {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        padding: 8px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
      }
      .delete-popup button {
        margin: 0 4px;
        padding: 4px 8px;
        cursor: pointer;
      }
      .delete-popup button.yes {
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 3px;
      }
      .delete-popup button.no {
        background: #666;
        color: white;
        border: none;
        border-radius: 3px;
      }
      .equipment-item {
        position: relative;
        margin-left: 1rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  container.innerHTML =
    '<h3>All Equipment</h3><div id="equipment-list">Loading...</div>';
  const equipmentList = document.getElementById("equipment-list");

  try {
    const charactersSnapshot = await get(ref(db, "characters"));
    const characters = charactersSnapshot.val() || {};
    let equipmentHtml = "";

    for (const [charName, charData] of Object.entries(characters)) {
      if (!charData.Equipment) continue;

      equipmentHtml += `<div class="character-equipment" style="margin-bottom: 1rem;">
        <h4>${charName}'s Equipment</h4>`;

      for (const [equipType, typeItems] of Object.entries(charData.Equipment)) {
        equipmentHtml += `<div style="margin-left: 1rem;"><strong>${equipType}:</strong>`;
        for (const [itemId, item] of Object.entries(typeItems)) {
          const bonusText =
            item.bonuses
              ?.map((b) => `${b.type} ${b.value >= 0 ? "+" : ""}${b.value}`)
              .join(", ") || "No bonuses";
          equipmentHtml += `
            <div class="equipment-item">
              <div><strong>${item.name}</strong> (${item.category}) - ${item.rarity}</div>
              <div style="color: #666;">${bonusText}</div>
              <button 
                onclick="showDeleteConfirm(this, '${charName}', '${equipType}', '${itemId}')"
                style="margin-top: 0.5rem; color: red; cursor: pointer;">
                Delete
              </button>
              <div class="delete-popup">
                Are you sure?
                <button class="yes" onclick="confirmDelete('${charName}', '${equipType}', '${itemId}')">Yes</button>
                <button class="no" onclick="hideDeleteConfirm(this)">No</button>
              </div>
            </div>`;
        }
        equipmentHtml += "</div>";
      }
      equipmentHtml += "</div>";
    }

    equipmentList.innerHTML = equipmentHtml || "<p>No equipment found.</p>";

    // Add the helper functions to window scope
    window.showDeleteConfirm = (button, charName, equipType, itemId) => {
      // Hide any other open popups
      document.querySelectorAll(".delete-popup").forEach((popup) => {
        popup.style.display = "none";
      });

      const popup = button.nextElementSibling;
      popup.style.display = "block";
    };

    window.hideDeleteConfirm = (button) => {
      button.closest(".delete-popup").style.display = "none";
    };

    window.confirmDelete = async (charName, equipType, itemId) => {
      try {
        await set(
          ref(
            db,
            `characters/${charName.toLowerCase()}/Equipment/${equipType}/${itemId}`
          ),
          null
        );
        displayAllEquipment(); // Refresh the display
      } catch (err) {
        console.error("Error deleting equipment:", err);
        alert("Failed to delete equipment: " + err.message);
      }
    };
  } catch (err) {
    console.error("Error loading equipment:", err);
    equipmentList.innerHTML =
      "<p>Error loading equipment: " + err.message + "</p>";
  }
}

async function loadEquipmentTemplates() {
  const container = document.getElementById("template-equipment");
  if (!container) return;

  try {
    // First, let's create our template structure if it doesn't exist
    const templateRef = ref(db, "template/equipment");
    const snapshot = await get(templateRef);

    if (!snapshot.exists()) {
      // Create default equipment templates
      const defaultTemplates = {
        weapon: {
          Melee: {
            Sword: {
              Template_Sword: {
                name: "Sword Template",
                category: "Sword",
                rarity: "Common",
              },
            },
            Axe: {
              Template_Axe: {
                name: "Axe Template",
                category: "Axe",
                rarity: "Common",
              },
            },
            Staff: {
              Template_Staff: {
                name: "Staff Template",
                category: "Staff",
                rarity: "Common",
              },
            },
            Dagger: {
              Template_Dagger: {
                name: "Dagger Template",
                category: "Dagger",
                rarity: "Common",
              },
            },
          },
          Ranged: {
            Bow: {
              Template_Bow: {
                name: "Bow Template",
                category: "Bow",
                rarity: "Common",
              },
            },
            Crossbow: {
              Template_Crossbow: {
                name: "Crossbow Template",
                category: "Crossbow",
                rarity: "Common",
              },
            },
            Dart: {
              Template_Dart: {
                name: "Dart Template",
                category: "Dart",
                rarity: "Common",
              },
            },
            Sling: {
              Template_Sling: {
                name: "Sling Template",
                category: "Sling",
                rarity: "Common",
              },
            },
          },
        },
        Armor: {
          Light: {
            Template_Light: {
              name: "Light Armor Template",
              category: "Light",
              rarity: "Common",
            },
          },
          Heavy: {
            Template_Heavy: {
              name: "Heavy Armor Template",
              category: "Heavy",
              rarity: "Common",
            },
          },
          Unarmored: {
            Template_Unarmored: {
              name: "Unarmored Template",
              category: "Unarmored",
              rarity: "Common",
            },
          },
        },
        item: {
          Potion: {
            Template_Potion: {
              name: "Potion Template",
              category: "Potion",
              rarity: "Common",
            },
          },
          Ring: {
            Template_Ring: {
              name: "Ring Template",
              category: "Ring",
              rarity: "Common",
            },
          },
          Scroll: {
            Template_Scroll: {
              name: "Scroll Template",
              category: "Scroll",
              rarity: "Common",
            },
          },
        },
      };

      await set(templateRef, defaultTemplates);
    }

    // Now load and display the templates
    const templates = (await get(templateRef)).val();
    let html = "";

    for (const [type, typeData] of Object.entries(templates)) {
      html += `<div class="equipment-type" style="margin-bottom: 1rem;">
        <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>`;

      if (type === "weapon") {
        for (const [rangeType, rangeData] of Object.entries(typeData)) {
          html += `<div style="margin-left: 1rem;"><strong>${rangeType}:</strong>`;
          for (const [category, categoryData] of Object.entries(rangeData)) {
            for (const [templateId, template] of Object.entries(categoryData)) {
              html += createTemplateItemHtml(
                template,
                type,
                rangeType,
                category
              );
            }
          }
          html += "</div>";
        }
      } else {
        for (const [category, categoryData] of Object.entries(typeData)) {
          for (const [templateId, template] of Object.entries(categoryData)) {
            html += createTemplateItemHtml(template, type, null, category);
          }
        }
      }

      html += "</div>";
    }

    container.innerHTML = html;

    // Add the use template function to window scope
    window.useTemplate = function (template, type, rangeType, category) {
      console.log("Template data:", { template, type, rangeType, category }); // Debug log

      const nameInput = document.getElementById("equip-name");
      const typeSelect = document.getElementById("equip-type");
      const weaponRange = document.getElementById("weapon-range");
      const categorySelect = document.getElementById("equip-category");

      // Set the type first and trigger its change event
      if (typeSelect) {
        typeSelect.value = type;
        typeSelect.dispatchEvent(new Event("change"));
      }

      // Handle weapon-specific logic
      if (type === "weapon" && weaponRange) {
        weaponRange.style.display = "inline";
        weaponRange.value = rangeType || "Melee";
        weaponRange.dispatchEvent(new Event("change"));
      }

      // Wait a brief moment for the category options to be populated
      setTimeout(() => {
        if (categorySelect) {
          categorySelect.value = category;
        }

        if (nameInput) {
          nameInput.value = ""; // Clear the name for new input
          nameInput.focus();
        }
      }, 100);
    };
  } catch (err) {
    console.error("Error loading equipment templates:", err);
    container.innerHTML =
      "<p>Error loading equipment templates: " + err.message + "</p>";
  }
}

function createTemplateItemHtml(template, type, rangeType, category) {
  // Escape any special characters in the stringified template
  const safeTemplate = JSON.stringify(template).replace(/'/g, "\\'");

  return `
    <div class="equipment-item" style="margin-left: 1rem;">
      <div><strong>${template.category}</strong> (${type}${
    rangeType ? ` - ${rangeType}` : ""
  })</div>
      <button 
        onclick='useTemplate(${safeTemplate}, "${type}", ${
    rangeType ? `"${rangeType}"` : "null"
  }, "${category}")'
        style="margin-top: 0.5rem; cursor: pointer;">
        Use Template
      </button>
    </div>`;
}

window.onload = () => {
  loadTemplate();
  attachCreateForm();
};
