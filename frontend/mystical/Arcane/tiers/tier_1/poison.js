import { PoisonEquations } from "../../equations/tier-1/poison-functions.js";

export function definePoisonSkills(db) {
  insertSkill(db, "Poison", "Venom Dart", {
    description:
      "Launch a toxin-laced dart that injects venom into the target, dealing damage over time.",
    tier: 1,
    effective_value: 0,
    tags: ["projectile", "poison", "venom", "dot", "ranged"],
    effect: ({ level, arcane }) => PoisonEquations.venomDart(level, arcane),
  });

  insertSkill(db, "Poison", "Toxic Bloom", {
    description:
      "Create a lingering cloud of airborne poison that deals damage over time to enemies inside.",
    tier: 1,
    effective_value: 0,
    tags: ["area", "poison", "toxin", "dot", "ranged"],
    effect: ({ level }) => PoisonEquations.toxicBloom(level),
  });

  insertSkill(db, "Poison", "Serpent Step", {
    description:
      "Move evasively while releasing toxic vapors. Enemies near your path may be poisoned or slowed.",
    tier: 1,
    effective_value: 0,
    tags: ["movement", "poison", "toxin", "ranged"],
    effect: ({ level, arcane }) => PoisonEquations.serpentStep(level, arcane),
  });

  insertSkill(db, "Poison", "Coiling Trap", {
    description:
      "Place a trap that releases venom when triggered, dealing damage over time and applying stacking toxins.",
    tier: 1,
    effective_value: 0,
    tags: ["trap", "poison", "venom", "dot", "ranged"],
    effect: ({ level, arcane }) => PoisonEquations.coilingTrap(level, arcane),
  });

  insertSkill(db, "Poison", "Viral Bite", {
    description:
      "Curse a target with a spreading infection that reduces healing and may transfer to nearby enemies if they fall.",
    tier: 1,
    effective_value: 0,
    tags: ["curse", "poison", "contagion", "debuff"],
    effect: ({ level, arcane }) => PoisonEquations.viralBite(level, arcane),
  });

  insertSkill(db, "Poison", "Toxin Sense", {
    description:
      "Expand your awareness of toxic threats. Detect poisons in the area and identify vulnerable foes.",
    tier: 1,
    effective_value: 0,
    tags: ["detection", "utility", "poison"],
    effect: ({ level }) => PoisonEquations.toxinSense(level),
  });

  insertSkill(db, "Poison", "Paralytic Spores", {
    description:
      "Unleash invisible spores that slow and eventually paralyze nearby enemies who fail repeated saves.",
    tier: 1,
    effective_value: 0,
    tags: ["area", "poison", "paralysis", "debuff"],
    effect: ({ level }) => PoisonEquations.paralyticSpores(level),
  });

  insertSkill(db, "Poison", "Drowsing Needle", {
    description:
      "Inject a mild sedative into the target, gradually putting them to sleep if the poison builds up.",
    tier: 1,
    effective_value: 0,
    tags: ["projectile", "poison", "sleep", "debuff"],
    effect: ({ level, arcane }) =>
      PoisonEquations.drowsingNeedle(level, arcane),
  });
}
