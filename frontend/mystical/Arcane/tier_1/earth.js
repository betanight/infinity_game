import { EarthEquations } from "../../equations/tier-1/earth-functions.js";
import { insertSkill } from "../../../../scripts/skilltree_functions.js";

export function defineEarthSkills(db) {
  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Stone Bolt",
    {
      description:
        "Launch a dense shard of rock that deals piercing damage. Penetration increases with level.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "piercing"],
      effect: ({ level, arcane }) => EarthEquations.stoneBolt(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Dust Cloak",
    {
      description:
        "Kick up a dust cloud that lowers enemy accuracy and lightly shields the user.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "utility"],
      effect: ({ level }) => EarthEquations.dustCloak(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Earthen Grasp",
    {
      description:
        "Stone hands emerge to grab a target. Root strength and duration increase with level.",
      tier: 1,
      effective_value: 0,
      tags: ["control", "bludgeoning"],
      effect: ({ level, earthSkills }) =>
        EarthEquations.earthenGrasp(level, earthSkills),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Tremor Step",
    {
      description:
        "Shockwave follows your movement, tripping nearby enemies. Scales with level.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "area", "bludgeoning"],
      effect: ({ level, earthSkills }) =>
        EarthEquations.tremorStep(level, earthSkills),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Stone Skin",
    {
      description:
        "Reinforce your body with stone, reducing incoming physical damage.",
      tier: 1,
      effective_value: 0,
      tags: ["buff", "defense"],
      effect: ({ level }) => EarthEquations.stoneSkin(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Buried Sense",
    {
      description:
        "Sense movement and vibrations underground, improving perception of hidden threats.",
      tier: 1,
      effective_value: 0,
      tags: ["detection"],
      effect: ({ level }) => EarthEquations.buriedSense(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Earth",
    "Clay Bindings",
    {
      description: "Trap enemy legs with clay, slowing them.",
      tier: 1,
      effective_value: 0,
      tags: ["snare"],
      effect: ({ level, earthSkills }) =>
        EarthEquations.clayBindings(level, earthSkills),
    },
    "Tier 1"
  );
}
