import { LightningEquations } from "../equations/tier_1/lightning-functions.js";
import { insertSkill } from "../../../scripts/skilltree_functions.js";

export function defineLightningSkills(db) {
  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Arc Surge",
    {
      description:
        "Release a short burst of electricity toward a target. Damage and conduction increase with level.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "shock", "ranged"],
      effect: ({ level, arcane }) => LightningEquations.arcSurge(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Static Field",
    {
      description:
        "Charge the air around you, reducing enemy movement speed and increasing critical vulnerability.",
      tier: 1,
      effective_value: 0,
      tags: ["area", "shock", "debuff", "ranged"],
      effect: ({ level }) => LightningEquations.staticField(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Charged Step",
    {
      description:
        "Dash forward with a burst of electricity, gaining momentary evasion and electrifying nearby foes.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "shock", "ranged"],
      effect: ({ level, arcane }) =>
        LightningEquations.chargedStep(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Lightning Rod",
    {
      description:
        "While rooted in place, you absorb incoming attacks and build up electric charge. Each round spent not moving adds a charge stack. When released, unleashes a powerful shock that scales in damage and radius based on the number of stored charges and spell level.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "shock", "ranged"],
      effect: ({ level, arcane, chargeStacks }) =>
        LightningEquations.lightningRod(level, arcane, chargeStacks),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Chain Zap",
    {
      description:
        "Strike a target with lightning that jumps to nearby enemies. Number of jumps and damage scale with level.",
      tier: 1,
      effective_value: 0,
      tags: ["shock", "chain", "ranged"],
      effect: ({ level, arcane }) => LightningEquations.chainZap(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Pulse Vision",
    {
      description:
        "Sense electrical disturbances to locate hidden or invisible entities within range.",
      tier: 1,
      effective_value: 0,
      tags: ["detection", "ranged"],
      effect: ({ level }) => LightningEquations.pulseVision(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Lightning",
    "Nerve Disruptor",
    {
      description:
        "Target a creatures nervous system to reduce reaction time and coordination.",
      tier: 1,
      effective_value: 0,
      tags: ["debuff", "shock", "ranged"],
      effect: ({ level }) => LightningEquations.nerveDisruptor(level),
    },
    "Tier 1"
  );
}
