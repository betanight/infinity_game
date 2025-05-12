export const WaterEquations = {
  getSoakEffect(level) {
    if (level < 10) return null;

    const tier = Math.floor(level / 10);

    return {
      tag: "soaked",
      fireDamageMultiplier: 0.5, // takes half damage from fire
      lightningMultiplier: 1.5 + (tier - 1) * 0.2, // increased lightning damage
      frostMultiplier: 1.5 + (tier - 1) * 0.2, // increased frost damage
      duration: 2 + tier, // for living targets

      // --- Environmental effect rules ---
      appliesToEnvironment: true, // when terrain or objects are soaked
      persistentUntilDried: true, // soaked terrain stays soaked until removed
      enhancesSpells: ["hydroSlip", "currentSense"], // standing on soaked terrain boosts these
      // hydroSlip: longer slide + ignore terrain
      // currentSense: wider range + improved wall detection
      // these will we be added in once we figure out how combat and battlegrounds will look for this game
    };
  },

  surgeJet(level, arcane) {
    const base = (5 + level) * 1.8; // damage
    const scaling = arcane * (1.1 + level * 0.035); // damage
    return {
      piercing: Math.round(base + scaling), // damage
      range: 80, // utility
      ...(level >= 10 && {
        soakEffect: WaterEquations.getSoakEffect(level), // utility
      }),
    };
  },

  hydroSlip(level) {
    return {
      slideDistance: 10 + level * 1.5, // utility
      evasionBonus: 8 + level * 1.8, // utility
      terrainIgnore: true, // utility
      duration: 1 + Math.floor(level / 5), // utility
    };
  },

  tideguard(level) {
    return {
      fireResistance: 20 + level * 5, // utility
      projectileDeflection: 5 + level * 2, // utility
      duration: 2 + Math.floor(level / 3), // utility
    };
  },

  pressureBloom(level, arcane) {
    const base = (6 + level) * 1.6; // damage
    const scaling = arcane * (1.0 + level * 0.03); // damage
    const rawRadius = 10 + level; // utility
    const radius = Math.floor(rawRadius / 5) * 5; // utility
    return {
      bludgeoning: Math.round(base + scaling), // damage
      radius, // utility
      knockback: 5 + level * 0.5, // utility
      range: 0, // utility
      ...(level >= 10 && {
        soakEffect: WaterEquations.getSoakEffect(level), // utility
      }),
    };
  },

  aqueousBind(level) {
    return {
      movementReduction: 15 + level * 2, // utility
      reactionSlow: 5 + level, // utility
      duration: 2 + Math.floor(level / 4), // utility
      ...(level >= 10 && {
        soakEffect: WaterEquations.getSoakEffect(level), // utility
      }),
    };
  },

  geyserShot(level, arcane) {
    const base = (4 + level) * 1.7; // damage
    const scaling = arcane * (1.0 + level * 0.04); // damage
    return {
      bludgeoning: Math.round(base + scaling), // damage
      launchChance: 10 + level * 3, // utility
      heightLifted: 5 + level * 0.5, // utility
      range: 60, // utility
      ...(level >= 10 && {
        soakEffect: WaterEquations.getSoakEffect(level), // utility
      }),
    };
  },

  granulate(level, arcane) {
    const base = ((5 + level) * 1.5) / 2; // damage
    const scaling = arcane * (1.1 + level * 0.03); // damage
    return {
      slashing: Math.round(base + scaling), // damage
      armorShred: 2 + level * 0.5, // utility
      range: 40, // utility
      ...(level >= 10 && {
        soakEffect: WaterEquations.getSoakEffect(level), // utility
      }),
    };
  },

  currentSense(level) {
    return {
      detectionRange: 10 + level * 3, // utility
      waterSignalSensitivity: 5 + level * 2, // utility
      canSenseThroughWalls: level >= 7, // utility
    };
  },

  tideLimbs(level, arcane) {
    const base = (3 + level) * 1.4; // damage
    const scaling = arcane * (0.9 + level * 0.025); // damage
    return {
      meleeRangeBonus: 5, // utility
      slashing: Math.round(base + scaling), // damage
      duration: 1 + Math.floor(level / 5), // utility
    };
  },

  undertowGrasp(level, arcane) {
    const base = (4 + level) * 1.5; // damage
    const scaling = arcane * (1.0 + level * 0.03); // damage
    return {
      pullStrength: 10 + level * 2, // utility
      slashing: Math.round(base + scaling), // damage
      destabilizeChance: 10 + level * 2, // utility
      range: 30, // utility
      ...(level >= 10 && {
        soakEffect: WaterEquations.getSoakEffect(level), // utility
      }),
    };
  },
};
