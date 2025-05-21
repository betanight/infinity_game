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

  await updateCoreStatTotals(charId);
  await saveCharacterData(charId, char);
}

export function calculateRank(skills) {
  let totalPoints = 0;
  let unlockedStats = 0;

  for (const stat in skills) {
    const skillSet = skills[stat];
    const sum = Object.values(skillSet).reduce((a, b) => a + b, 0);

    if (sum > 0) unlockedStats += 1;
    totalPoints += sum;
  }

  const denominator = unlockedStats || 1;
  const score = Math.floor(totalPoints / denominator);

  if (score >= 201) return "SS";
  if (score >= 101) return "S";
  if (score >= 61) return "A";
  if (score >= 41) return "B";
  if (score >= 26) return "C";
  if (score >= 16) return "D";
  if (score >= 9) return "E";
  if (score >= 4) return "F";
  return "G";
}

export async function updateCoreStatTotals(charId) {
  const char = await getCharacterData(charId);

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
    updatedPrimary[stat] = 1 + total;
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

  await saveCharacterData(charId, char);
}
