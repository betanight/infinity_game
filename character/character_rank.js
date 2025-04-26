const { db } = require("../firebase/firebase");

async function createCharacter(name) {
  const ref = db.ref("template");
  const snapshot = await ref.once("value");
  const template = snapshot.val();

  if (!template) throw new Error("Template not found in Firebase.");

  template.meta.character_id = name;
  const characterRef = db.ref(`characters/${name.toLowerCase()}`);
  await characterRef.set(template);

  const refs = db.ref(`characters/${name.toLowerCase()}`);
  await refs.set({
    created_at: Date.now(),
    skills: {} // placeholder
  });  

  console.log(`✅ Character '${name}' created in Firebase.`);
}

async function getAvailableSkills(statType) {
  const ref = db.ref(`template/skills/${statType}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();
  
  if (!data) return [];

  return Object.keys(data);
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
  allocateSkillPoint,
  getAvailableSkills
};

