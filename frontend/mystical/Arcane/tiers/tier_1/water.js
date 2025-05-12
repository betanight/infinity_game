import { WaterEquations } from "../../equations/tier-1/water-functions.js";
import { insertSkill } from "../../../../scripts/skilltree_functions.js";

export function defineWaterSkills(db) {
  insertSkill(
    db,
    "Water",
    "Surge Jet",
    {
      description:
        "Fire a high-pressure jet of water that pierces armor and scales with momentum. Deals piercing damage.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "piercing", "ranged"],
      effect: ({ level, arcane }) => WaterEquations.surgeJet(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Hydro Slip",
    {
      description:
        "Slide effortlessly across the ground with slick water underfoot, ignoring difficult terrain and gaining evasion.",
      tier: 1,
      effective_value: 0,
      tags: ["movement", "utility"],
      effect: ({ level }) => WaterEquations.hydroSlip(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Tideguard",
    {
      description:
        "Wrap yourself in a swirling shield of water that reduces fire damage and deflects projectiles slightly.",
      tier: 1,
      effective_value: 0,
      tags: ["defense", "buff"],
      effect: ({ level }) => WaterEquations.tideguard(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Pressure Bloom",
    {
      description:
        "Burst a ring of water outward from your position, pushing enemies back and dealing bludgeoning damage.",
      tier: 1,
      effective_value: 0,
      tags: ["area", "bludgeoning", "ranged"],
      effect: ({ level, arcane }) =>
        WaterEquations.pressureBloom(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Aqueous Bind",
    {
      description:
        "Form bands of water that constrict and slow a target. Reduces movement and reaction speed.",
      tier: 1,
      effective_value: 0,
      tags: ["snare", "control", "ranged"],
      effect: ({ level }) => WaterEquations.aqueousBind(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Geyser Shot",
    {
      description:
        "Launch a pressurized burst of water that explodes upward. Can knock enemies airborne.",
      tier: 1,
      effective_value: 0,
      tags: ["projectile", "bludgeoning", "ranged"],
      effect: ({ level, arcane }) => WaterEquations.geyserShot(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Current Sense",
    {
      description:
        "Feel faint motions in nearby water or humidity. Detect submerged movement or shifts through walls.",
      tier: 1,
      effective_value: 0,
      tags: ["detection", "utility"],
      effect: ({ level }) => WaterEquations.currentSense(level),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Tide Limbs",
    {
      description:
        "Extend water tendrils from your arms, increasing melee reach by 5 feet. Your next melee attacks deal slashing damage and scale with spell level.",
      tier: 1,
      effective_value: 0,
      tags: ["buff", "slashing", "touch"],
      effect: ({ level, arcane }) => WaterEquations.tideLimbs(level, arcane),
    },
    "Tier 1"
  );

  insertSkill(
    db,
    "Water",
    "Undertow Grasp",
    {
      description:
        "Whip a tendril of water at a target to pull them toward you. May unbalance or slow them momentarily.",
      tier: 1,
      effective_value: 0,
      tags: ["control", "pull", "ranged"],
      effect: ({ level, arcane }) =>
        WaterEquations.undertowGrasp(level, arcane),
    },
    "Tier 1"
  );
}
