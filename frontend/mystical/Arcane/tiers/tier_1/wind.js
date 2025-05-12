import { WindEquations } from "../../equations/tier-1/wind-functions.js";
import { insertSkill } from "../../../scripts/skilltree_functions.js";

export function defineWindSkills(db) {
  insertSkill(
    db,
    "Wind",
    "Gale Cutter",
    {
      description:
        "Launch a slicing arc of wind that deals slashing damage. At level 10+, may fuse with another element you have at level 5+.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "slashing", "ranged"],
      effect: ({ level, arcane, otherElementLevels }) =>
        WindEquations.galeCutter(level, arcane, otherElementLevels),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Tailwind Step",
    {
      description:
        "Harness the wind to dash forward, increasing movement and evasion for a short time.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "utility"],
      effect: ({ level }) => WindEquations.tailwindStep(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Buffer Zone",
    {
      description:
        "Create a swirling shield of air that deflects incoming projectiles and reduces fall damage.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "utility"],
      effect: ({ level }) => WindEquations.bufferZone(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Cyclone Burst",
    {
      description:
        "Release a sudden burst of wind around you, knocking back enemies and dealing bludgeoning damage. At level 10+, can infuse another element.",
      tier: 1,
      effective_value: 0,
      tags: ["area", "bludgeoning", "ranged"],
      effect: ({ level, arcane, otherElementLevels }) =>
        WindEquations.cycloneBurst(level, arcane, otherElementLevels),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Windsnare",
    {
      description:
        "Whip strands of wind around nearby enemies to trip them, rendering them prone for 1 round. Affects more targets as it levels.",
      tier: 1,
      effective_value: 0,
      tags: ["control", "ranged"],
      effect: ({ level }) => WindEquations.windsnare(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Skyhook Lash",
    {
      description:
        "Throw a tether of wind to grab a target and pull yourself to them, dealing light slashing damage on impact.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "slashing", "ranged"],
      effect: ({ level, arcane }) => WindEquations.skyhookLash(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Whisper Sense",
    {
      description:
        "Hear even the faintest disruptions in the air, allowing detection of invisible movement and speech.",
      tier: 1,
      effective_value: 0,
      tags: ["detection", "utility"],
      effect: ({ level }) => WindEquations.whisperSense(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Gust",
    {
      description:
        "Knock enemies back in a wide cone. Knockback and cone distance both scale with level.",
      tier: 1,
      effective_value: 0,
      tags: ["area", "control", "ranged"],
      effect: ({ level }) => WindEquations.gust(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Reactive Boost",
    {
      description:
        "Instantly redirect air to stop a falling creature from taking fall damage. The amount of fall damage prevented scales with level.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "reaction", "utility"],
      effect: ({ level }) => WindEquations.reactiveBoost(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Wind",
    "Gale Lift",
    {
      description:
        "Generate a gentle updraft that increases your jump height and slows your descent.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "utility"],
      effect: ({ level }) => WindEquations.galeLift(level),
    },
    "Tier 1"
  );
}
