export const LightningEquations = {
  getNumbEffect(level) {
    if (level < 10) return null;

    const tier = Math.floor(level / 10);
    return {
      tag: "numb",
      physicalDamageReduction: 5 + tier * 5, // utility
      duration: 2 + tier, // utility
      stunnedCondition:
        level >= 25
          ? {
              requiresRoundsNumb: 3, // utility
              stunDuration: 1, // utility
              effect: "movement reduced to 0 for 1 round, then returns to numb", // utility
            }
          : null,
    };
  },

  arcSurge(level, arcane) {
    const base = (6 + level) * 2; // damage
    const scaling = arcane * (1.2 + level * 0.04); // damage
    return {
      shock: Math.round(base + scaling), // damage
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },

  staticField(level) {
    return {
      movementReduction: 10 + level * 2, // utility
      critVulnerability: 5 + level * 1.5, // utility
      radius: 5 + Math.floor(level / 2), // utility
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },

  chargedStep(level) {
    return {
      dashDistance: 10 + level, // utility
      evasionBoost: 10 + level * 2, // utility
      shockPulse: 5 + level * 1.2, // damage
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },

  lightningRod(level, arcane, chargeStacks = 0) {
    const base = (5 + level) * 1.8; // damage
    const scaling = arcane * (1.0 + level * 0.025); // damage
    const chargeMultiplier = 1 + chargeStacks;
    const rawRadius = 10 + level; // +1 ft per level
    const radius = Math.floor(rawRadius / 5) * 5; // snap to nearest 5 ft

    return {
      movementRestricted: true, // utility
      chargeStacks, // utility
      radius, // utility
      retaliatoryShock: Math.round((base + scaling) * chargeMultiplier), // damage
      damageAbsorbRate: 5 + level * 1.5, // utility
      duration: 2 + Math.floor(level / 3), // utility
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },

  chainZap(level, arcane) {
    const base = 4 + level * 1.2; // damage
    const jumps = 1 + Math.floor(level / 5); // utility
    return {
      shock: Math.round(base + arcane * 1.5), // damage
      jumpCount: jumps, // utility
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },

  pulseVision(level) {
    return {
      detectionRadius: 10 + level * 3, // utility
      hiddenDetection: level >= 5, // utility
      invisDetection: level >= 10, // utility
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },

  nerveDisruptor(level) {
    return {
      reactionDelay: 1 + Math.floor(level / 4), // utility
      coordinationPenalty: 5 + level * 1.5, // utility
      ...(level >= 10 && {
        numbEffect: LightningEquations.getNumbEffect(level), // utility
      }),
    };
  },
};
