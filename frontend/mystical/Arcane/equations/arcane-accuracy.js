export function getMagicAccuracy({ level = 0, arcane = 0, tags = [] }) {
  // AoE spells (area or cone) do not require accuracy
  if (tags.includes("area") || tags.includes("cone")) return null;

  let accuracy = 10;

  accuracy += level * 3;
  accuracy += arcane * 1.5;

  if (tags.includes("projectile")) accuracy += 5;

  return Math.round(accuracy);
}

export function rollMagicHit(totalAccuracy) {
  if (typeof totalAccuracy !== "number") return null;

  const minRoll = Math.max(1, Math.round(Math.sqrt(totalAccuracy)));
  const maxRoll = Math.round(totalAccuracy);

  const roll = Math.floor(Math.random() * (maxRoll - minRoll + 1)) + minRoll;

  return {
    roll,
    min: minRoll,
    max: maxRoll,
  };
}
