export const MonkEquations = {
  empoweredStrike(level) {
    return {
      bonusDamage: 5 + level * 1.2,
      staggerChance: level >= 7 ? 15 + level : 0,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  kiGuard(level) {
    return {
      damageReduction: 10 + level * 0.8,
      reactiveBoost: level >= 5,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  stunningPalm(level) {
    return {
      stunChance: 10 + level * 1.5,
      duration: 1 + Math.floor(level / 5),
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  flowStep(level) {
    return {
      speedBoost: 10 + level,
      ignoreOpportunityAttacks: true,
      duration: 1 + Math.floor(level / 6),
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  meditativeHealing(level) {
    return {
      healPerTurn: 4 + Math.floor(level * 0.5),
      duration: 3 + Math.floor(level / 4),
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  disruptivePulse(level) {
    return {
      knockbackRadius: 5 + level * 0.5,
      debuffEffect: "reaction and coordination reduced",
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  reboundingKick(level) {
    return {
      knockbackDistance: 5 + Math.floor(level / 2),
      synergyWithEmpoweredStrike: true,
      bonusDamage: 6 + level * 0.8,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  innerFocus(level) {
    return {
      evasionBoost: 8 + level,
      initiativeBonus: 2 + Math.floor(level / 4),
      stacksWithFlowStep: true,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  palmEcho(level) {
    return {
      delayTurns: 2,
      bonusDamageAfterDelay: 10 + level,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  kiDrain(level) {
    return {
      staminaStolen: 2 + Math.floor(level / 3),
      selfRestored: 1 + Math.floor(level / 4),
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  // Passive Enhancers

  ironBody(level) {
    return {
      flatDamageReduction: 1 + Math.floor(level / 5),
      fatigueResistance: 5 + level,
      constitutionBonus: level,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  reflexDiscipline(level) {
    return {
      evasionBonus: 2 + Math.floor(level / 3),
      dodgeWindowExtension: level >= 7,
      dexterityBonus: level,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  unshakableStance(level) {
    return {
      resistPush: 5 + level,
      fallImmunityThreshold: level >= 10,
      strengthBonus: level,
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  mentalResilience(level) {
    return {
      statusResistance: {
        stun: 10 + level,
        charm: 10 + level,
        disorient: 10 + level,
        wisdomBonus: level,
      },
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  spiritualPulse(level) {
    return {
      coreStatBoost: {
        strength: Math.floor(level / 5),
        constitution: Math.floor(level / 5),
        dexterity: Math.floor(level / 5),
      },
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },

  disciplineOfMotion(level) {
    return {
      movementSpeed: 5 + Math.floor(level / 2),
      reactionTimeBonus: 1 + Math.floor(level / 4),
      dexterityBonus: Math.floor(level / 3),
      wisdomBonus: Math.floor(level / 10) * 3,
    };
  },
};
