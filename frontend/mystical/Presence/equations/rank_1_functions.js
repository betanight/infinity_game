export const RankOneEquations = {
  // Champion Auras (Passive Effects)
  // Grants Constitution boost and poison resistance to nearby allies
  auraFortitude(level) {
    return {
      passive: true,
      constitutionBoost: 2 + Math.floor(level / 2),
      poisonResistance: 10 + level,
    };
  },

  // Increases initiative and mental focus for nearby allies
  auraClarity(level) {
    return {
      passive: true,
      initiativeBonus: 1 + Math.floor(level / 3),
      focusBonus: 5 + level,
    };
  },

  // Provides resistance to fire and cold damage
  auraEndurance(level) {
    return {
      passive: true,
      fireResist: 5 + level,
      coldResist: 5 + level,
    };
  },

  // Boosts physical armor of allies within range
  auraProtection(level) {
    return {
      passive: true,
      armorBonus: 3 + Math.floor(level / 2),
    };
  },

  // Strengthens the user, increasing their strength passively
  auraPresence(level) {
    return {
      passive: true,
      selfStrengthBoost: 2 + Math.floor(level / 2),
    };
  },

  // Reduces magical damage taken and provides elemental harmony
  auraBalance(level) {
    return {
      passive: true,
      magicResistance: 10 + Math.floor(level / 2),
      elementalBalance: true,
    };
  },

  // Improves allies' skill checks and saving throws
  auraInspiration(level) {
    return {
      passive: true,
      skillCheckBonus: 2 + Math.floor(level / 2),
      saveBonus: 1 + Math.floor(level / 4),
    };
  },

  // Makes enemies less likely to target injured allies nearby
  auraSanctuary(level) {
    return {
      passive: true,
      enemyTargetingPenalty: 5 + Math.floor(level / 2),
    };
  },

  // Behemoth Skills (Active Abilities)
  // Heavy strike that damages, ruptures terrain, and weakens armor
  pulverize(level) {
    return {
      damage: 10 + level * 1.5,
      groundRupture: true,
      armorShred: 2 + Math.floor(level / 3),
    };
  },

  // Area effect that knocks enemies back and slows them
  titanSlam(level) {
    return {
      knockbackRadius: 5 + Math.floor(level / 2),
      slowDuration: 2 + Math.floor(level / 4),
    };
  },

  // Infuses user with lightning while raging; damages and alters terrain
  stormbornWrath(level) {
    return {
      lightningDamage: 3 + Math.floor(level / 2),
      rageSynergy: true,
      hazardousGround: true,
    };
  },

  // Defensive stance that increases resistance and prevents knockback
  seismicGuard(level) {
    return {
      knockbackImmunity: true,
      physicalResist: 5 + level,
      rootedDefense: true,
    };
  },

  // Movement leaves behind slowing effects and destabilizes enemies
  echoingStride(level) {
    return {
      movementTrailSlow: 10 + level,
      staggerChance: Math.floor(level / 3),
    };
  },

  // Grabs a target, deals damage over time, and reduces their damage output
  bonebreakerGrip(level) {
    return {
      damagePerTurn: 2 + Math.floor(level / 2),
      enemyDamageReduction: 5 + Math.floor(level / 2),
      gripDuration: 2 + Math.floor(level / 4),
    };
  },

  // Roar that breaks terrain and slows enemies, may deafen
  earthenRoar(level) {
    return {
      terrainFracture: true,
      enemySlow: 10 + level,
      deafeningEffect: level >= 5,
    };
  },

  // Dash forward with crowd control immunity for a short time
  unstoppableSurge(level) {
    return {
      dashDistance: 5 + Math.floor(level / 2),
      crowdControlImmunity: true,
      duration: 1 + Math.floor(level / 5),
    };
  },
};
