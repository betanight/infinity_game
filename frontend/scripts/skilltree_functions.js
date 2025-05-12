export function insertSkill(db, element, name, data, tier = "Tier 1") {
  const path = `template/skills/Arcane/${tier}/${element}/${name}`;
  return db.ref(path).set(data);
}
