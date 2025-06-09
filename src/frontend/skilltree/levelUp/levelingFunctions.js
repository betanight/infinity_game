import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
import { firebaseConfig } from "../src/firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function getCharacterData(charId) {
  const snapshot = await get(ref(db, `characters/${charId.toLowerCase()}`));
  if (!snapshot.exists()) throw new Error("Character not found.");
  return snapshot.val();
}

export async function saveCharacterData(charId, data) {
  await set(ref(db, `characters/${charId.toLowerCase()}`), data);
}

export async function upgradeMysticalSkill(
  charId,
  stat,
  tier,
  category,
  skill,
  amount
) {
  const char = await getCharacterData(charId);
  const available = char.meta?.available_skill_points || 0;
  const toAdd = Math.min(amount, available);

  if (!char.skills[stat]) char.skills[stat] = {};
  if (!char.skills[stat][tier]) char.skills[stat][tier] = {};
  if (!char.skills[stat][tier][category])
    char.skills[stat][tier][category] = {};

  const current = char.skills[stat][tier][category][skill] || 0;
  char.skills[stat][tier][category][skill] = current + toAdd;
  char.meta.available_skill_points = available - toAdd;

  // Update rank after skill changes
  char.meta.rank = calculateRank(char.skills);

  await updateCoreStatTotals(charId);
  await saveCharacterData(charId, char);
}

export async function upgradePrimarySkill(charId, stat, skill, amount) {
  const char = await getCharacterData(charId);
  const available = char.meta?.available_skill_points || 0;
  const toAdd = Math.min(amount, available);

  if (!char.skills[stat]) {
    char.skills[stat] = {};
  }

  const current = char.skills[stat][skill] || 0;
  char.skills[stat][skill] = current + toAdd;
  char.meta.available_skill_points = available - toAdd;

  // Update rank after skill changes
  char.meta.rank = calculateRank(char.skills);

  await updateCoreStatTotals(charId);
  await saveCharacterData(charId, char);
}

export async function downgradeMysticalSkill(
  charId,
  stat,
  tier,
  category,
  skill,
  amount
) {
  const char = await getCharacterData(charId);
  if (!char.skills?.[stat]?.[tier]?.[category]?.[skill]) return;
  console.log(
    "🧪 Before downgrade:",
    JSON.stringify(char.skills[stat], null, 2)
  );

  const current = char.skills[stat][tier][category][skill] || 0;
  const toRemove = amount === "reset" ? current : Math.min(amount, current);

  char.skills[stat][tier][category][skill] = current - toRemove;
  console.log(
    "🧪 After subtraction:",
    char.skills[stat][tier][category][skill]
  );

  if (char.skills[stat][tier][category][skill] <= 0) {
    delete char.skills[stat][tier][category][skill];
  }

  if (Object.keys(char.skills[stat][tier][category] || {}).length === 0) {
    delete char.skills[stat][tier][category];
  }

  if (Object.keys(char.skills[stat][tier] || {}).length === 0) {
    delete char.skills[stat][tier];
  }

  if (Object.keys(char.skills[stat] || {}).length === 0) {
    delete char.skills[stat];
  }
  console.log(
    "🧼 Cleaned skill tree:",
    JSON.stringify(char.skills[stat], null, 2)
  );

  char.meta.available_skill_points =
    (char.meta.available_skill_points || 0) + toRemove;

  // Update rank after skill changes
  char.meta.rank = calculateRank(char.skills);

  await updateCoreStatTotals(charId);
  await saveCharacterData(charId, char);
}

export async function downgradePrimarySkill(charId, stat, skill, amount) {
  const char = await getCharacterData(charId);
  if (!char.skills?.[stat]?.[skill]) return;

  const current = char.skills[stat][skill] || 0;
  const toRemove = amount === "reset" ? current : Math.min(amount, current);

  char.skills[stat][skill] = current - toRemove;

  if (char.skills[stat][skill] <= 0) {
    delete char.skills[stat][skill];
  }

  if (Object.keys(char.skills[stat] || {}).length === 0) {
    delete char.skills[stat];
  }

  char.meta.available_skill_points =
    (char.meta.available_skill_points || 0) + toRemove;

  // Update rank after skill changes
  char.meta.rank = calculateRank(char.skills);

  await updateCoreStatTotals(charId);
  await saveCharacterData(charId, char);
}

export function calculateRank(skills) {
  let totalPoints = 0;
  let skillTreeCount = 0;

  // Calculate total points and count skill trees
  for (const stat in skills) {
    const skillSet = skills[stat];
    // Only count skill trees that have points invested
    if (typeof skillSet === "object" && Object.keys(skillSet).length > 0) {
      let hasPoints = false;

      // Check if there are any points invested in this skill tree
      for (const tier in skillSet) {
        if (typeof skillSet[tier] === "object") {
          for (const category in skillSet[tier]) {
            for (const skill in skillSet[tier][category]) {
              // Handle both effective_value and raw value cases
              const value =
                typeof skillSet[tier][category][skill] === "object"
                  ? skillSet[tier][category][skill].effective_value || 0
                  : skillSet[tier][category][skill] || 0;
              if (value > 0) {
                hasPoints = true;
                break;
              }
            }
            if (hasPoints) break;
          }
        } else if (typeof skillSet[tier] === "object") {
          // Handle case where skill is an object with effective_value
          const value = skillSet[tier].effective_value || 0;
          if (value > 0) {
            hasPoints = true;
            break;
          }
        } else {
          // Handle raw value case
          if (skillSet[tier] > 0) {
            hasPoints = true;
            break;
          }
        }
      }

      if (hasPoints) {
        skillTreeCount++;
        // Add up the points
        for (const tier in skillSet) {
          if (typeof skillSet[tier] === "object") {
            if (skillSet[tier].effective_value !== undefined) {
              // Handle case where tier itself has effective_value
              totalPoints += skillSet[tier].effective_value || 0;
            } else {
              // Handle nested category/skill case
              for (const category in skillSet[tier]) {
                for (const skill in skillSet[tier][category]) {
                  // Handle both effective_value and raw value cases
                  const value =
                    typeof skillSet[tier][category][skill] === "object"
                      ? skillSet[tier][category][skill].effective_value || 0
                      : skillSet[tier][category][skill] || 0;
                  totalPoints += value;
                }
              }
            }
          } else {
            // Handle raw value case
            totalPoints += skillSet[tier] || 0;
          }
        }
      }
    }
  }

  // Adjust points based on number of skill trees
  // Default is 6 trees (primary stats), so we normalize against that
  const normalizedPoints = totalPoints * (6 / Math.max(6, skillTreeCount));
  const score = Math.floor(Math.sqrt(normalizedPoints));

  // Helper function to determine +/- modifier
  const getModifier = (score, minThreshold, nextThreshold) => {
    if (nextThreshold === undefined) return "+"; // For SS rank
    const range = nextThreshold - minThreshold;
    const position = score - minThreshold;
    const third = range / 3;

    if (position < third) return "-";
    if (position >= third * 2) return "+";
    return "";
  };

  // Rank thresholds
  if (score >= 35) return "SS" + getModifier(score, 35); // 1225+ points
  if (score >= 25) return "S" + getModifier(score, 25, 35); // 625+ points
  if (score >= 15) return "A" + getModifier(score, 15, 25); // 225+ points
  if (score >= 10) return "B" + getModifier(score, 10, 15); // 100+ points
  if (score >= 8) return "C" + getModifier(score, 8, 10); // 64+ points
  if (score >= 6) return "D" + getModifier(score, 6, 8); // 36+ points
  if (score >= 4) return "E" + getModifier(score, 4, 6); // 16+ points
  if (score >= 3) return "F" + getModifier(score, 3, 4); // 9+ points
  if (score >= 1) return "G" + getModifier(score, 1, 3); // 1+ points
  return "G-"; // 0 points
}

export async function updateCoreStatTotals(charId) {
  const char = await getCharacterData(charId);
  console.log("Updating core stats");

  const coreStats = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];
  const mysticalStats = ["Arcane", "Willpower", "Spirit", "Presence"];
  const updatedPrimary = { ...char.primary_scores };
  const updatedSecondary = { ...char.secondary_scores };

  // Update primary stats
  coreStats.forEach((stat) => {
    let total = 0;
    const skillBlock = char.skills?.[stat];
    if (skillBlock) {
      for (const skill in skillBlock) {
        total += skillBlock[skill] || 0;
      }
    }
    updatedPrimary[stat] = total;
  });

  // Update mystical stats
  mysticalStats.forEach((stat) => {
    let total = 0;
    const tree = char.skills?.[stat];
    if (tree) {
      for (const tier in tree) {
        for (const category in tree[tier]) {
          for (const skill in tree[tier][category]) {
            total += tree[tier][category][skill] || 0;
          }
        }
      }
    }
    updatedSecondary[stat] = total;
  });

  char.primary_scores = updatedPrimary;
  char.secondary_scores = updatedSecondary;

  // Update rank after core stat totals are updated
  char.meta.rank = calculateRank(char.skills);

  await saveCharacterData(charId, char);
}
