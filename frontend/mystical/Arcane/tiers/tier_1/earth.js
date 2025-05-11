import { EarthEquations } from "../../../equations/earth-functions.js";

export function defineEarthSkills(db) {
  insertSkill(db, "Earth", "Stone Bolt", {
    description:
      "Launch a dense shard of rock that deals piercing damage. Penetration increases with level.",
    tier: 1,
    effective_value: 0,
    tags: ["projectile", "piercing"],
    effect: ({ level, arcane }) => EarthEquations.stoneBolt(level, arcane),
  });

  insertSkill(db, "Dust Cloak", {
    description:
      "Kick up a dust cloud that lowers enemy accuracy and lightly shields the user.",
    tier: 1,
    effective_value: 0,
    tags: ["defense", "utility"],
    effect: ({ level }) => EarthEquations.dustCloak(level),
  });

  insertSkill(db, "Earthen Grasp", {
    description:
      "Stone hands emerge to grab a target. Root strength and duration increase with level.",
    tier: 1,
    effective_value: 0,
    tags: ["control", "bludgeoning"],
    effect: ({ level, earthSkills }) =>
      EarthEquations.earthenGrasp(level, earthSkills),
  });

  insertSkill(db, "Tremor Step", {
    description:
      "Shockwave follows your movement, tripping nearby enemies. Scales with level.",
    tier: 1,
    effective_value: 0,
    tags: ["movement", "area", "bludgeoning"],
    effect: ({ level, earthSkills }) =>
      EarthEquations.tremorStep(level, earthSkills),
  });

  insertSkill(db, "Stone Skin", {
    description:
      "Reinforce your body with stone, reducing incoming physical damage.",
    tier: 1,
    effective_value: 0,
    tags: ["buff", "defense"],
    effect: ({ level }) => EarthEquations.stoneSkin(level),
  });

  insertSkill(db, "Buried Sense", {
    description:
      "Sense movement and vibrations underground, improving perception of hidden threats.",
    tier: 1,
    effective_value: 0,
    tags: ["detection"],
    effect: ({ level }) => EarthEquations.buriedSense(level),
  });

  insertSkill(db, "Clay Bindings", {
    description: "Trap enemy legs with clay, slowing them.",
    tier: 1,
    effective_value: 0,
    tags: ["snare"],
    effect: ({ level, earthSkills }) =>
      EarthEquations.clayBindings(level, earthSkills),
  });
}
