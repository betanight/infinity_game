export function insertSkill(db, element, name, data, tier = "Tier 1") {
  const path = `template/skills/Arcane/${tier}/${element}/${name}`;
  const firebaseData = { ...data };

  if (typeof firebaseData.effect === "function") {
    delete firebaseData.effect;
  }

  return db.ref(path).set(firebaseData);
}
