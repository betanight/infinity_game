export function insertSkill(
  db,
  score,
  categoryOrName,
  nameOrData,
  maybeDataOrTier,
  maybeTier
) {
  let scorePath, category, name, data, tier;

  if (typeof nameOrData === "object") {
    // 4-arg form: insertSkill(db, "Willpower", "Palm Echo", { ... }, "Monk")
    scorePath = score;
    category = null;
    name = categoryOrName;
    data = nameOrData;
    tier = maybeDataOrTier || "Tier 1"; // corrected fallback
  } else {
    // 5-arg form: insertSkill(db, "Willpower", "Passive", "Iron Body", { ... }, "Monk")
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

  // Uncomment to debug path issues:
  // console.log("📦 Writing to:", path);

  return db.ref(path).set(firebaseData);
}
