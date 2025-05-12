import { ColdEquations } from "../../../equations/tier-1/frost-functions.js";

export function defineColdSkills(db) {
  insertSkill(db, "Frost", "Frost Shard", {
    description:
      "Launch a shard of ice that damages enemies. Damage increases with skill level and Arcane.",
    tier: 1,
    effective_value: 0,
    tags: ["projectile", "frost", "debuff", "piercing"],
    effect: ({ level, arcane }) => ColdEquations.frostShard(level, arcane),
  });

  insertSkill(db, "Frost", "Chill Skin", {
    description:
      "Envelop your body in cold armor that resists fire and reduces incoming damage. Scales with skill level.",
    tier: 1,
    effective_value: 0,
    tags: ["defense", "frost", "resistance"],
    effect: ({ level }) => ColdEquations.chillSkin(level),
  });

  insertSkill(db, "Frost", "Frozen Footing", {
    description:
      "Maintain control on icy terrain and resist slipping. Improves ice navigation as skill level increases.",
    tier: 1,
    effective_value: 0,
    tags: ["movement", "frost", "terrain"],
    effect: ({ level }) => ColdEquations.frozenFooting(level),
  });

  insertSkill(db, "Frost", "Icy Veins", {
    description:
      "Sharpen your focus and cool your blood, gaining temporary resistance to fire, poison, and blood-based effects. Strength and duration scale with skill level.",
    tier: 1,
    effective_value: 0,
    tags: ["focus", "frost", "buff"],
    effect: ({ level }) => ColdEquations.icyVeins(level),
  });

  insertSkill(db, "Frost", "Frostbite Aura", {
    description:
      "Emit a chilling aura that damages nearby enemies each turn. Radius and damage scale with your Frost skills.",
    tier: 1,
    effective_value: 0,
    tags: ["aura", "frost", "area", "damage-over-time", "cold"],
    effect: ({ level, coldSkills }) =>
      ColdEquations.frostbiteAura(level, coldSkills),
  });

  insertSkill(db, "Frost", "Snowstep", {
    description:
      "Move with supernatural quiet and fluidity. Enhances stealth and leaves no tracks, with additional mobility in snowy terrain. Improves with skill level.",
    tier: 1,
    effective_value: 0,
    tags: ["stealth", "frost", "movement", "snow-enhanced"],
  });
}
