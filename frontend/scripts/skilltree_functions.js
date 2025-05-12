export function insertSkill(
  db,
  score,
  categoryOrName,
  nameOrData,
  maybeDataOrTier,
  maybeTier
) {
  let scorePath, category, name, data, tier;

  // Check if this is a 4-arg call (Willpower-style)
  if (typeof nameOrData === "object") {
    // insertSkill(db, "Willpower", "Palm Echo", { ... }, "Monk")
    scorePath = score;
    category = null;
    name = categoryOrName;
    data = nameOrData;
    tier = maybeDataOrTier || "Tier 1";
  } else {
    // insertSkill(db, "Arcane", "Fire", "Cinderbolt", { ... }, "Tier 1")
    scorePath = score;
    category = categoryOrName;
    name = nameOrData;
    data = maybeDataOrTier;
    tier = maybeTier || "Tier 1";
  }

  const firebaseData = { ...data };
  if (typeof firebaseData.effect === "function") {
    delete firebaseData.effect;
  }

  const path = category
    ? `template/skills/${scorePath}/${tier}/${category}/${name}`
    : `template/skills/${scorePath}/${tier}/${name}`;

  return db.ref(path).set(firebaseData);
}
