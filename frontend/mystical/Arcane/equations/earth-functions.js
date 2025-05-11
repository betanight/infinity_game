export const EarthEquations = {
  getSplinterEffect(level) {
    if (level < 10) return null;

    const splinterLevel = Math.floor(level / 10);
    return {
      tag: "splinter",
      areaDamage: 3 + splinterLevel * 2,
      radius: splinterLevel * 5, // 5 feet radius per 10 levels
    };
  },

  getReactiveEarthDamage(level) {
    if (level < 10) return null;

    const reactiveLevel = Math.floor(level / 10);
    return {
      tag: "earth-reactive",
      bludgeoning: 4 + reactiveLevel * 2,
      duration: 2 + reactiveLevel,
    };
  },

  stoneBolt(level, arcane) {
    const base = 5 + level * 1.5;
    const scaling = arcane * (1 + level * 0.03);
    return {
      piercing: Math.round(base + scaling),
      ...(level >= 10 && {
        splinter: EarthEquations.getSplinterEffect(level),
      }),
    };
  },

  dustCloak(level) {
    return {
      enemyAccuracyReduction: 8 + level * 2.8,
      concealmentBoost: 10 + level * 2.5,
      duration: 2 + Math.floor(level / 2),
    };
  },

  earthenGrasp(level) {
    const baseStrength = level * 2.2;
    return {
      immobilizeStrength: baseStrength,
      duration: 1 + Math.floor(level / 2),
      ...(level >= 10 && {
        reactiveDamage: EarthEquations.getReactiveEarthDamage(level),
      }),
    };
  },

  tremorStep(level) {
    return {
      bludgeoning: Math.round(3 + level * 1.25),
      knockdownChance: 20 + level * 4,
      radius: 2 + Math.floor(level / 3),
      ...(level >= 10 && {
        reactiveDamage: EarthEquations.getReactiveEarthDamage(level),
      }),
    };
  },

  stoneSkin(level) {
    return {
      physicalResistance: 5 + level * 1.7,
      damageReductionFlat: level + 1,
      duration: 3 + Math.floor(level / 2),
      ...(level >= 10 && {
        reactiveDamage: EarthEquations.getReactiveEarthDamage(level),
      }),
    };
  },

  buriedSense(level) {
    return {
      detectionRadius: 14 + level * 2.8,
      tremorSensitivityBoost: 5 + level * 1.5,
      wallPenetrationDepth: level >= 6 ? 5 + level * 0.5 : 0,
    };
  },

  clayBindings(level) {
    return {
      movementPenalty: 12 + level * 3.2,
      slowDuration: 2 + Math.floor(level / 2),
      ...(level >= 10 && {
        reactiveDamage: EarthEquations.getReactiveEarthDamage(level),
      }),
    };
  },
};
