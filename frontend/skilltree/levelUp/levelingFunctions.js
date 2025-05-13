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

// 🔼 Upgrade skill by N points
export async function upgradeSkill(charId, stat, skill, amount) {
  const char = await getCharacterData(charId);

  if (!char.skills[stat]) char.skills[stat] = {};
  const current = char.skills[stat][skill] || 0;
  const available = char.meta?.available_skill_points || 0;
  const toAdd = Math.min(amount, available);

  char.skills[stat][skill] = current + toAdd;
  char.meta.available_skill_points = available - toAdd;

  await saveCharacterData(charId, char);
}

// 🔽 Downgrade skill by N points (or to 0)
export async function downgradeSkill(charId, stat, skill, amount) {
  const char = await getCharacterData(charId);

  if (!char.skills[stat]) return;
  const current = char.skills[stat][skill] || 0;
  const toRemove = amount === "reset" ? current : Math.min(amount, current);

  char.skills[stat][skill] = current - toRemove;
  if (char.skills[stat][skill] <= 0) {
    delete char.skills[stat][skill];
  }

  char.meta.available_skill_points =
    (char.meta.available_skill_points || 0) + toRemove;

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

  if (score >= 401) return "SS";
  if (score >= 200) return "S";
  if (score >= 101) return "A";
  if (score >= 81) return "B";
  if (score >= 51) return "C";
  if (score >= 31) return "D";
  if (score >= 21) return "E";
  if (score >= 11) return "F";
  return "G";
}
