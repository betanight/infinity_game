function getGuardianEffect(level) {
  if (level < 10) return null;
  const tier = Math.floor(level / 10);
  return {
    guardianBuff: {
      armorBonus: 5 * tier,
    },
  };
}

function getHexWarriorEffect(level) {
  if (level < 10) return null;
  return {
    hexWarriorBonus: {
      extraDamageOnHexed: level,
    },
  };
}

function getSpectreEffect(level) {
  if (level < 10) return null;
  const turns = Math.floor(level / 10);
  return {
    spectreShift: {
      passThroughObjects: true,
      immunityToPhysical: true,
      duration: turns,
    },
  };
}

export const youngEquations = {
  soulChannel(level) {
    return {
      healOrDamage: Math.floor(level * 1.2),
      duration: 2 + Math.floor(level / 4),
      ...(getSpectreEffect(level) || {}),
    };
  },

  ancestralWarning(level) {
    return {
      initiativeBoost: 1 + Math.floor(level / 5),
      perceptionBoost: 2 + Math.floor(level / 2),
      passive: true,
      ...(getGuardianEffect(level) || {}),
    };
  },

  witherGrasp(level) {
    const damage = (4 + level) * 2;
    return {
      damage,
      healAmount: damage,
      ...(getHexWarriorEffect(level) || {}),
    };
  },

  eclipseVeil(level) {
    return {
      stealthBonus: (2 + level) * 2,
      concealmentInDarkness: true,
      duration: 5 + Math.floor(level / 2),
      ...(getSpectreEffect(level) || {}),
    };
  },

  spiritLash(level) {
    return {
      spectralDamage: 6 + level,
      armorBypass: true,
      ...(getSpectreEffect(level) || {}),
    };
  },

  guidingLight(level) {
    return {
      accuracyBonus: 2 + Math.floor(level / 2),
      fearResistance: 10 + level * 2,
      duration: 3,
      ...(getGuardianEffect(level) || {}),
    };
  },

  hexBrand(level) {
    return {
      resistanceReduction: 5 + level,
      duration: 2 + Math.floor(level / 3),
      ...(getHexWarriorEffect(level) || {}),
    };
  },

  lastBreath(level) {
    return {
      triggersOncePerDay: true,
      restoreHP: 1,
      description: "First time you would die each day, stay at 1 HP instead.",
      ...(getSpectreEffect(level) || {}),
    };
  },

  markDeath(level) {
    return {
      criticalChanceIncrease: 5 + Math.floor(level / 2),
      duration: 3 + Math.floor(level / 5),
      ...(getHexWarriorEffect(level) || {}),
    };
  },

  feralForm(level) {
    return {
      strengthBoost: 2 + Math.floor(level / 2),
      constitutionBoost: 1 + Math.floor(level / 3),
      intelligencePenalty: 1 + Math.floor(level / 4),
      duration: 3 + Math.floor(level / 5),
      ...(getGuardianEffect(level) || {}),
    };
  },

  armorSpectre(level) {
    return {
      physicalDamageReduction: 5 + Math.floor(level / 2),
      partialIncorporeal: level >= 8,
      ...(getSpectreEffect(level) || {}),
    };
  },
};
