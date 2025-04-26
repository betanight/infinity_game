const { db } = require("../firebase/firebase");

// Create a new character
async function createCharacter(name) {
  const ref = db.ref(`characters/${name.toLowerCase()}`);
  await ref.set({
    level: 0,
    skills: {}
  });
}

async function getAvailableSkills(statType) {
  const ref = db.ref(`template/skills/${statType}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();
  
  if (!data) return [];

  return Object.keys(data);  // 🔥 This returns actual skill names like "Anchor Stance", "Grip Strength", etc.
}

// Allocate a skill point to a skill
async function allocateSkillPoint(characterName, statType, skillName) {
  const ref = db.ref(`characters/${characterName.toLowerCase()}/skills/${statType}/${skillName}`);
  const snapshot = await ref.once("value");
  const currentValue = snapshot.val() || 0;
  await ref.set(currentValue + 1);
}

module.exports = {
  createCharacter,
  getAvailableSkills,
  allocateSkillPoint
};
