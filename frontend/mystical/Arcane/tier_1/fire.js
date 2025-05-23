import { FireEquations } from "../equations/tier_1/fire-functions.js";
import { insertSkill } from "../../../scripts/skilltree_functions.js";

export function defineFireSkills(db) {
  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Cinderbolt",
    {
      description:
        "Launch a fire projectile that explodes on impact, increasing in power with each skill level.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "fire"],
      effect: ({ level, arcane }) => FireEquations.cinderbolt(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Ignition Spark",
    {
      description:
        "Ignites dry surfaces or kindling with increasing efficiency and range as skill level improves.",
      tier: 1,
      effective_value: 0,
      tags: ["utility", "fire"],
      effect: ({ level }) => FireEquations.ignitionSpark(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Searing Touch",
    {
      description:
        "Imbue your hands with burning power that enhances unarmed strikes and scales with your skill level.",
      tier: 1,
      effective_value: 0,
      tags: ["melee", "fire", "buff"],
      effect: ({ level }) => FireEquations.searingTouch(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Blazing Step",
    {
      description:
        "Ignite your path to dash forward, dealing trail damage and increasing movement with higher skill level.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "fire"],
      effect: ({ level, fireSkills }) =>
        FireEquations.blazingStep(level, fireSkills),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Heat Vision",
    {
      description:
        "Detect body heat through walls or darkness, improving detection range and precision as skill level increases.",
      tier: 1,
      effective_value: 0,
      tags: ["detection", "fire", "perception"],
      effect: ({ level }) => FireEquations.heatVision(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Fire Arc",
    {
      description:
        "Unleash a wide cone of flame, with damage and reach that scale with skill level.",
      tier: 1,
      effective_value: 0,
      tags: ["cone", "fire", "area"],
      effect: ({ level }) => FireEquations.fireArc(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Fire",
    "Flame Ward",
    {
      description:
        "Wreathe yourself in fire that retaliates against attackers, intensifying with higher skill levels.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "fire"],
      effect: ({ level }) => FireEquations.flameWard(level),
    },
    "Tier 1"
  );
}
