export const FireEquations = {
  getBurnEffect(level, fireSkillTotal = 0) {
    if (level < 10) return null;

    const burnLevelBonus = Math.floor(fireSkillTotal / 10); // +1 per 10 fire levels

    return {
      tag: "burn",
      duration: 2 + burnLevelBonus,
      damagePerTurn: Math.round(level + burnLevelBonus * 2),
    };
  },

  cinderbolt(level, arcane, fireSkillTotal = 0) {
    const base = 6 + level * 2;
    const scaling = arcane * (1.25 + level * 0.05);

    return {
      damage: Math.round(base + scaling),
      burnChance: Math.min(100, 25 + level * 5),
      ...(level >= 10 && {
        burn: FireEquations.getBurnEffect(level, fireSkillTotal),
      }),
    };
  },

  ignitionSpark(level) {
    return {
      ignitionChance: Math.min(100, 75 + level * 5),
      range: 4 + level * 1.5,
    };
  },

  searingTouch(level, fireSkillTotal = 0) {
    return {
      bonusFireDamage: 1 + level * 2,
      burnDuration: 1 + Math.floor(level / 2),
      ...(level >= 10 && {
        burn: FireEquations.getBurnEffect(level, fireSkillTotal),
      }),
    };
  },

  blazingStep(level, fireSkillTotal) {
    return {
      movementBonus: 5 + level * 2,
      fireTrailDamage: Math.round(level * (fireSkillTotal * 0.8 + 2)),
      ...(level >= 10 && {
        burn: FireEquations.getBurnEffect(level, fireSkillTotal),
      }),
    };
  },

  heatVision(level) {
    return {
      detectionRange: 12 + level * 4,
      throughWalls: level >= 3,
    };
  },

  fireArc(level, fireSkillTotal = 0) {
    return {
      damage: 4 + level * 2,
      coneRange: Math.floor((5 + level) / 5) * 5,
      ...(level >= 10 && {
        burn: FireEquations.getBurnEffect(level, fireSkillTotal),
      }),
    };
  },

  flameWard(level, fireSkillTotal = 0) {
    return {
      reactiveDamage: 2 + level * 1.5,
      intimidation: level >= 4,
      ...(level >= 10 && {
        burn: FireEquations.getBurnEffect(level, fireSkillTotal),
      }),
    };
  },
};
