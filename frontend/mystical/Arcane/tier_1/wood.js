import { WoodEquations } from "../equations/tier_1/wood-functions.js";
import { insertSkill } from "../../../scripts/skilltree_functions.js";

export function defineWoodSkills(db) {
  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Grasping Vines",
    {
      description:
        "Summon thick vines that erupt from the ground and latch onto enemies, restricting movement and reducing dodge capability.",
      tier: 1,
      effective_value: 0,
      tags: ["area", "nature", "root", "ranged"],
      effect: ({ level, arcane }) => WoodEquations.graspingVines(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Living Armor",
    {
      description:
        "Form bark-like armor around yourself or an ally, increasing physical resistance and reducing bleeding effects.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "nature", "bark", "self"],
      effect: ({ level, arcane }) => WoodEquations.livingArmor(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Seedshot",
    {
      description:
        "Fire a hardened seed at a target. If it hits, the seed sprouts on impact, applying a weakening root to the target.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "nature", "debuff", "ranged"],
      effect: ({ level, arcane }) => WoodEquations.seedshot(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Verdant Burst",
    {
      description:
        "Burst wild growth in a small radius. Allies regenerate slightly and enemies are hindered by thickening plantlife.",
      tier: 1,
      effective_value: 0,
      tags: ["healing", "nature", "slow", "area"],
      effect: ({ level, arcane }) => WoodEquations.verdantBurst(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Spine Trap",
    {
      description:
        "Place a trap of spiny roots that triggers when stepped on, causing enemies to bleed and lose footing.",
      tier: 1,
      effective_value: 0,
      tags: ["trap", "nature", "bleed", "ranged"],
      effect: ({ level, arcane }) => WoodEquations.spineTrap(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Natures Pulse",
    {
      description:
        "Feel the pulse of life beneath your feet. Reveals hidden plant-based hazards, traps, and weak ground.",
      tier: 1,
      effective_value: 0,
      tags: ["detection", "utility", "nature"],
      effect: ({ level, arcane }) => WoodEquations.naturesPulse(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Thorn Net",
    {
      description:
        "Throw a net of woven thorns to entangle targets in a cone. Those hit suffer piercing damage and slowed movement.",
      tier: 1,
      effective_value: 0,
      tags: ["cone", "nature", "piercing", "control"],
      effect: ({ level, arcane }) => WoodEquations.thornNet(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Photosynthetic Bloom",
    {
      description:
        "Cause a target area to bloom with radiant overgrowth. Allies standing within are healed slowly each round.",
      tier: 1,
      effective_value: 0,
      tags: ["healing", "area", "nature", "regen"],
      effect: ({ level, arcane }) =>
        WoodEquations.photosyntheticBloom(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Arcane",
    "Wood",
    "Overgrowth Ring",
    {
      description:
        "Trigger a wide ring of dense roots and brush to erupt outward from your position. Creates difficult terrain for enemies and slows their movement significantly.",
      tier: 1,
      effective_value: 0,
      tags: ["area", "terrain", "nature", "control"],
      effect: ({ level, arcane }) =>
        WoodEquations.overgrowthRing(level, arcane),
    },
    "Tier 1"
  );
}
