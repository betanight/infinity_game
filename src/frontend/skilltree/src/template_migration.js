import { strengthSkills } from "./strength";

// Import all tier definitions as they're created
const tierDefinitions = {
  Strength: strengthSkills,
  // Add other stats as we define them
};

export async function migrateTemplate(db) {
  const templateRef = ref(db, "template/skills");
  const snapshot = await get(templateRef);
  const currentTemplate = snapshot.val();

  // Create new template structure
  const newTemplate = {};

  // Copy over mystical stats as is (they already use tiers)
  ["Arcane", "Willpower", "Spirit", "Presence"].forEach((stat) => {
    newTemplate[stat] = currentTemplate[stat];
  });

  // Migrate regular stats to tiered structure
  Object.keys(tierDefinitions).forEach((stat) => {
    newTemplate[stat] = tierDefinitions[stat];
  });

  // Update template in Firebase
  await set(templateRef, newTemplate);
  console.log("✅ Template migrated to new tier structure");
}

// Helper function to check if a character meets skill prerequisites
export function checkPrerequisites(characterData, stat, tier, skill) {
  const skillData = tierDefinitions[stat]?.[tier]?.[skill];
  if (!skillData?.prerequisites) return true;

  return skillData.prerequisites.every((prereq) => {
    const prereqTier = findPrereqTier(stat, prereq.skill);
    const currentLevel =
      characterData?.skills?.[stat]?.[prereqTier]?.[prereq.skill] || 0;
    return currentLevel >= prereq.minLevel;
  });
}

// Helper function to find which tier a skill belongs to
export function findPrereqTier(stat, skillName) {
  const tiers = tierDefinitions[stat];
  if (!tiers) return null;

  for (const tier in tiers) {
    if (tiers[tier][skillName]) {
      return tier;
    }
  }
  return null;
}

// Helper function to get all available skills for a character
export function getAvailableSkills(characterData, stat) {
  const tiers = tierDefinitions[stat];
  if (!tiers) return [];

  const available = [];

  Object.keys(tiers).forEach((tier) => {
    Object.keys(tiers[tier]).forEach((skill) => {
      if (checkPrerequisites(characterData, stat, tier, skill)) {
        available.push({
          tier,
          skill,
          description: tiers[tier][skill].description,
          currentLevel: characterData?.skills?.[stat]?.[tier]?.[skill] || 0,
        });
      }
    });
  });

  return available;
}

// Helper function to validate if a skill can be upgraded
export function canUpgradeSkill(characterData, stat, tier, skill) {
  const skillData = tierDefinitions[stat]?.[tier]?.[skill];
  if (!skillData) return false;

  // Check prerequisites
  if (!checkPrerequisites(characterData, stat, tier, skill)) {
    return false;
  }

  // Check if character has enough skill points
  const availablePoints = characterData?.meta?.available_skill_points || 0;
  if (availablePoints < 1) {
    return false;
  }

  // Add any additional validation logic here
  // For example, maximum skill levels, character level requirements, etc.

  return true;
}
