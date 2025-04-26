const { saveCharacter, getCharacter, updateSkill } = require("../firebase/firebase");
const { db } = require("../firebase/firebase"); // ✅ CORRECT

// Function to create a new character by copying the template
async function createCharacter(name) {
  const db = getDatabase();
  const snapshot = await get(child(ref(db), "template"));
  if (!snapshot.exists()) {
    throw new Error("Template not found!");
  }
  const templateData = snapshot.val();
  await saveCharacter(name, templateData);
  console.log(`✅ Character '${name}' created based on template.`);
}

// Function to update a specific skill value
async function allocateSkillPoint(characterName, statType, skillName) {
  await updateSkill(characterName, statType, skillName, 1); // Give +1 starting point
  console.log(`✅ Allocated 1 point to ${skillName} under ${statType}.`);
}

// Function to get available skills for a stat
async function getAvailableSkills(statType) {
  const db = getDatabase();
  const snapshot = await get(child(ref(db), `template/skills/${statType}`));
  if (!snapshot.exists()) {
    console.warn(`No skills found for ${statType}`);
    return [];
  }
  return Object.keys(snapshot.val());
}

module.exports = {
  createCharacter,
  allocateSkillPoint,
  getAvailableSkills
};
