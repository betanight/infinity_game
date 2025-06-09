// Tier thresholds used across all mystical ability scores
export const mysticalTierThresholds = {
  1: 1,
  2: 20,
  3: 50,
  4: 100,
};

// Shared tier-checking logic for any mystical score
export function getMysticalTier(statName, totalPoints) {
  if (totalPoints >= mysticalTierThresholds[4]) return 4;
  if (totalPoints >= mysticalTierThresholds[3]) return 3;
  if (totalPoints >= mysticalTierThresholds[2]) return 2;
  if (totalPoints >= mysticalTierThresholds[1]) return 1;
  return 0;
}

// helper to check if a skill can be used based on current tier
export function isSkillUnlocked(skillTier, currentTier) {
  return currentTier >= skillTier;
}
