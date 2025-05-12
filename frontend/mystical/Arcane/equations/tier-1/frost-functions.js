export const ColdEquations = {
  getFrostbiteEffect(level, frostSkillTotal = 0) {
    if (level < 10) return null;

    const stacks = 1 + Math.floor(frostSkillTotal / 10);

    return {
      tag: "frostbite",
      stacks, // movement speed reduced per application
      onFreeze: {
        duration: 3,
        vulnerability: ["bludgeoning", "force", "thunder"],
        resistance: ["piercing", "slashing", "cold"],
        resetSpeed: true,
      },
    };
  },

  frostShard(level, arcane, frostSkillTotal = 0) {
    const frostBase = 4 + level * 1.5;
    const frostScaling = arcane * (1.1 + level * 0.03);
    const frostDamage = Math.round(frostBase + frostScaling);

    const piercingBase = 2 + level;
    const piercingDamage = Math.round(piercingBase);

    const frostbite = ColdEquations.getFrostbiteEffect(level, frostSkillTotal);

    return {
      frostDamage,
      piercingDamage,
      totalDamage: frostDamage + piercingDamage,
      damageTypes: ["frost", "piercing"],
      ...(frostbite && { frostbite }),
    };
  },

  chillSkin(level) {
    return {
      fireResistance: 10 + level * 5,
      coldArmor: level * 1.5,
      duration: 2 + Math.floor(level / 3),
      tags: ["resistance", "frost", "fire"],
    };
  },

  frozenFooting(level) {
    return {
      slipResistance: 100,
      balanceBonus: level * 3,
      movementPenaltyReduction: Math.min(100, level * 10),
      tags: ["frost", "terrain", "stability"],
    };
  },

  icyVeins(level) {
    return {
      fireResistance: 15 + level * 5,
      poisonResistance: 10 + level * 4,
      bloodResistance: 10 + level * 4,
      focusBoost: 5 + level * 2,
      duration: 2 + Math.floor(level / 3),
      tags: ["resistance", "frost", "fire", "poison", "blood"],
    };
  },

  frostbiteAura(level, coldSkillTotal = 0) {
    // Aura logic will be implemented later
    const frostbite = ColdEquations.getFrostbiteEffect(level, coldSkillTotal);

    return {
      auraDamage: Math.round(level + coldSkillTotal * 0.4),
      radius: Math.floor((3 + level * 0.5) / 5) * 5,
      duration: 2 + Math.floor(level / 4),
      ...(frostbite && { frostbite }),
    };
  },

  snowstep(level) {
    return {
      stealthBonus: 3 + level * 2,
      noiseSuppression: true,
      ignoreTracks: true,
      snowMovementBonus: Math.floor(level / 2) * 5,
      tags: ["stealth", "frost", "mobility", "snow-enhanced"],
    };
  },
};
