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
        characterLi.style.cursor = "pointer";

        // Header with name + editable total points
        const header = document.createElement("div");
        header.innerHTML = `<strong>${name}</strong> <span style="margin-left: 1rem;">Total Points:</span>`;

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
          e.stopPropagation();

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

        // THEN append the full header
        characterLi.appendChild(header);

        const updateFirebase = (value) => {
          const newAvailable = value - totalUsedPoints;
          set(
            ref(db, `characters/${name}/meta/available_skill_points`),
            newAvailable
          );
        };

        decrement.onclick = (e) => {
          e.stopPropagation();
          if (totalAvailable > totalUsedPoints) {
            totalAvailable--;
            counter.textContent = totalAvailable;
            updateFirebase(totalAvailable);
          }
        };
        increment.onclick = (e) => {
          e.stopPropagation();
          totalAvailable++;
          counter.textContent = totalAvailable;
          updateFirebase(totalAvailable);
        };

        const detail = document.createElement("ul");
        detail.style.display = "none";
        detail.style.marginTop = "0.5rem";

        const skillsDetails = document.createElement("details");
        const skillsSummary = document.createElement("summary");
        skillsSummary.innerHTML = `<a href="/skilltree/index.html?char=${encodeURIComponent(
          name
        )}" style="color: inherit; text-decoration: underline;">Skills</a>`;
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

        detail.appendChild(skillsDetails);

        characterLi.onclick = () => {
          detail.style.display =
            detail.style.display === "none" ? "block" : "none";
        };

        list.appendChild(characterLi);
        list.appendChild(detail);
      });
    })
    .catch((err) => {
      list.innerHTML = `<li>Error loading characters: ${err.message}</li>`;
    });
}

function attachEquipmentCreator() {
  const container = document.createElement("div");
  container.innerHTML = `
    <h3>Create Equipment</h3>
    <select id="equip-type">
      <option value="">-- Select Type --</option>
      <option value="Armor">Armor</option>
      <option value="weapon">Weapon</option>
      <option value="item">Item</option>
    </select>
    <select id="weapon-range" style="display:none">
      <option value="">-- Select Weapon Type --</option>
      <option value="Melee">Melee</option>
      <option value="Ranged">Ranged</option>
    </select>
    <select id="equip-category"></select>
    <select id="equip-rarity">
      <option value="Common">Common</option>
      <option value="Uncommon">Uncommon</option>
      <option value="Rare">Rare</option>
      <option value="Epic">Epic</option>
      <option value="Legendary">Legendary</option>
    </select>
    <select id="equip-bonus">
      <option value="Strength">Strength</option>
      <option value="Dexterity">Dexterity</option>
      <option value="Constitution">Constitution</option>
      <option value="Intelligence">Intelligence</option>
      <option value="Wisdom">Wisdom</option>
      <option value="Charisma">Charisma</option>
    </select>
    <select id="equip-value">
      ${Array.from({ length: 11 }, (_, i) => i - 5)
        .map((n) => `<option value="${n}">${n >= 0 ? "+" : ""}${n}</option>`)
        .join("")}
    </select>
    <select id="equip-player"></select>
    <button id="create-equip-btn">Create Equipment</button>
  `;
  document.body.appendChild(container);

  // Populate category options
  document.getElementById("equip-type").onchange = () => {
    const type = document.getElementById("equip-type").value;
    const weaponRange = document.getElementById("weapon-range");
    const categorySelect = document.getElementById("equip-category");
    categorySelect.innerHTML = "";
    weaponRange.style.display = "none";

    if (type === "Armor") {
      categorySelect.innerHTML = `<option value="Light">Light</option><option value="Heavy">Heavy</option><option value="Unarmored">Unarmored</option>`;
    } else if (type === "weapon") {
      weaponRange.style.display = "inline";
      weaponRange.onchange = () => {
        const rangeType = weaponRange.value;
        categorySelect.innerHTML = "";
        if (rangeType === "Melee") {
          categorySelect.innerHTML = `<option value="Sword">Sword</option><option value="Axe">Axe</option><option value="Staff">Staff</option><option value="Dagger">Dagger</option>`;
        } else if (rangeType === "Ranged") {
          categorySelect.innerHTML = `<option value="Bow">Bow</option><option value="Longbow">Longbow</option><option value="Crossbow">Crossbow</option><option value="Heavy Crossbow">Heavy Crossbow</option><option value="Dart">Dart</option><option value="Sling">Sling</option>`;
        }
      };
    } else if (type === "item") {
      categorySelect.innerHTML = `<option value="Potion">Potion</option><option value="Ring">Ring</option><option value="Scroll">Scroll</option>`;
    }
  };

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

    if (!type || !category || !charId) {
      alert("Please fill in type, category, and select a player.");
      return;
    }

    const itemData = {
      name: category,
      category,
      rarity,
      bonuses: [{ type: bonus, value }],
    };

    const refPath = `characters/${charId.toLowerCase()}/Equipment/${type}`;
    console.log("Attempting to write to:", refPath);

    try {
      await push(ref(db, refPath), itemData);
      alert(`✅ Equipment created for ${charId}: ${category}`);
    } catch (err) {
      console.error("❌ Error pushing equipment:", err);
      alert(`Failed to create equipment: ${err.message}`);
    }
  };
}

window.onload = () => {
  loadTemplate();
  attachCreateForm();
};
