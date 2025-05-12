export const WoodEquations = {
  // Level 10 effect: Drains enemy stamina each turn
  getDrainEffect(level, arcane) {
    if (level < 10) return null;

    const tier = Math.floor(level / 10);
    return {
      tag: "drain",
      staminaLeech: 2 + tier + Math.floor(arcane / 10), // action points drained
      duration: 2 + tier,
    };
  },

  // Level 10 effect: Provides healing over time
  getEmpoweredEffect(level, arcane) {
    if (level < 10) return null;

    const tier = Math.floor(level / 10);
    return {
      tag: "empowered",
      healPerTurn: 3 + tier + Math.floor(arcane / 10),
      duration: 3 + tier,
    };
  },
  // physical attacks will be the highest resisted, so I will buff the damage of these physical nature spells
  graspingVines(level, arcane) {
    return {
      areaRadius: 10,
      rootDuration: 1 + Math.floor(level / 4), // increases every 4 levels
      movementPenalty: 10 + level, // effected every 5 levels
      dodgePenalty: 5 + Math.floor(level / 2),
      range: 30,
      ...(level >= 10 && {
        drainEffect: WoodEquations.getDrainEffect(level, arcane),
      }),
    };
  },

  livingArmor(level, arcane) {
    return {
      armorBoost: 10 + level * 2, // effect armor class
      bleedResistance: 20 + level, // grows over wounds
      duration: 3 + Math.floor(level / 3),
      targetRange: 20, // can target an aly within 20 feet or yourself
      ...(level >= 10 && {
        empowerEffect: WoodEquations.getEmpoweredEffect(level, arcane),
      }),
    };
  },

  seedshot(level, arcane) {
    return {
      range: 50,
      initialDamage: 10 + level * 2 + Math.floor(arcane * 0.3), // strong hit
      rootDuration: 1 + Math.floor(level / 4),
      weakenEffect: 5 + Math.floor(level / 2), // slight damage or defense reduction
      ...(level >= 10 && {
        drainEffect: WoodEquations.getDrainEffect(level, arcane),
      }),
    };
  },

  verdantBurst(level, arcane) {
    return {
      areaRadius: 10,
      allyRegen: 3 + Math.floor(level / 3) + Math.floor(arcane * 0.2), // slow heal
      enemySlow: 10 + Math.floor(level / 2), // slow enemies
      duration: 3 + Math.floor(level / 4),
      range: 30,
      ...(level >= 10 && {
        drainEffect: WoodEquations.getDrainEffect(level, arcane), // prioritizes the debuff over buff
      }),
    };
  },

  spineTrap(level, arcane) {
    return {
      triggerRadius: 5, // activates in a square
      initialDamage: 12 + level * 2 + Math.floor(arcane * 0.2), // high initial damage
      bleedPerTurn: 3 + Math.floor(level / 2), // low damage over time
      knockdownChance: 15 + Math.floor(level / 2), // prone
      trapRange: 20,
      ...(level >= 10 && {
        drainEffect: WoodEquations.getDrainEffect(level, arcane),
      }),
    };
  },

  naturesPulse(level, arcane) {
    return {
      detectionRadius: 5 + level, // detect any creature within the area unless targets stealth is higher than casters arcane
      revealsTraps: true,
      showsWeakGround: true,
      pulseDuration: 3 + Math.floor(level / 4),
      ...(level >= 10 && {
        empowerEffect: WoodEquations.getEmpoweredEffect(level, arcane),
      }),
    };
  },

  thornNet(level, arcane) {
    return {
      coneRange: 20, // 4 squares out
      initialDamage: 8 + level * 1.8 + Math.floor(arcane * 0.2),
      entangleDuration: 1 + Math.floor(level / 5), // increase every 5 levels
      movementReduction: 10 + level,
      ...(level >= 10 && {
        drainEffect: WoodEquations.getDrainEffect(level, arcane),
      }),
    };
  },

  photosyntheticBloom(level, arcane) {
    return {
      areaRadius: 20,
      regenPerTurn: 4 + Math.floor(level / 2) + Math.floor(arcane * 0.1),
      duration: 4 + Math.floor(level / 3),
      range: 25,
      ...(level >= 10 && {
        empowerEffect: WoodEquations.getEmpoweredEffect(level, arcane), // boost to healing
      }),
    };
  },

  overgrowthRing(level, arcane) {
    return {
      radius: 20,
      difficultTerrain: true,
      movementPenalty: 15 + Math.floor(level / 2),
      duration: 3 + Math.floor(level / 3),
      ...(level >= 10 && {
        drainEffect: WoodEquations.getDrainEffect(level, arcane), // similar to entangle
      }),
    };
  },
};
