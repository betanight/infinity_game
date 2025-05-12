export const PoisonEquations = {
  // Applies the infected tag at level 10+, granting a contagious aura
  getInfectedEffect(level, arcane) {
    if (level < 10) return null;

    const tier = Math.floor(level / 10);
    return {
      tag: "infected",
      auraRadius: 5 + tier * 5 + Math.floor(arcane / 10), // poison spreads in this radius
      contagionChance: 10 + tier * 10 + Math.floor(arcane / 6), // % chance each turn to spread
    };
  },

  // Single target ranged poison that deals weak initial damage but strong DoT
  venomDart(level, arcane) {
    const poisonDamagePerTurn = Math.round(arcane * 0.1 + level * 1); // low arcane scaling
    return {
      range: 60, // ranged attack range
      initialDamage: 1 + Math.floor(level * 0.3), // very weak up-front hit
      poisonDoT: poisonDamagePerTurn, // main source of damage over time
      duration: 3 + Math.floor(level / 5), // poison duration in turns
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },

  // A poisonous cloud that damages and weakens those inside
  toxicBloom(level, arcane) {
    return {
      areaRadius: 10, // static area
      damagePerTurn: Math.round(level * 0.5 + arcane * 0.05), // weak but consistent area damage
      duration: 4 + Math.floor(level / 4),
      staminaDrain: 2 + Math.floor(level / 3), // weakens action economy
      visionObscured: true, // causes concealment inside the cloud
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },

  // Dash-style move that leaves behind a toxic trail
  serpentStep(level, arcane) {
    return {
      movementBoost: 10 + level * 1.5,
      trailDuration: 2 + Math.floor(level / 5), // how long trail remains
      trailLength: 20 + level * 2, // distance covered in feet
      trailWidth: 5, // AoE width of trail
      debuff: {
        reactionPenalty: 5 + level, // lowers enemy action points
        coordinationDrop: 5 + Math.floor(level / 2), // reduces multi-action efficiency
      },
      effect: "Enemies in the trail take debuffs at the end of their turn.",
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },

  // Sets a proximity trap that bursts with poison
  coilingTrap(level, arcane) {
    return {
      triggerRadius: 3, // feet
      paralysisChance: 20 + level * 2 + Math.floor(arcane * 0.2),
      slowEffect: 10 + level, // movement or action speed penalty
      toxinStacks: 1 + Math.floor(level / 5),
      duration: 2 + Math.floor(level / 3), // how long effects persist
      range: 15, // throw/set distance
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },

  // Infects a target with a disease that can spread
  viralBite(level, arcane) {
    return {
      healingReduction: 25 + level * 2, // lowers incoming healing effectiveness
      spreadOnDeath: true, // infects nearby enemies on death
      duration: 5 + Math.floor(level / 2),
      contagionRadius: 5 + Math.floor(level / 2) + Math.floor(arcane * 0.1),
      range: 30, // biting or cursed spit distance
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },

  // Detects poisoned targets and vulnerable enemies
  toxinSense(level, arcane) {
    return {
      detectionRange: 10 + level * 2 + Math.floor(arcane * 0.2), // passive sense range
      revealsPoisonedTargets: true,
      highlightsWeakConstitution: true, // shows who’s vulnerable to poison
      duration: 3 + Math.floor(level / 4),
    };
  },

  // Releases spores that paralyze over time
  paralyticSpores(level, arcane) {
    return {
      areaRadius: 8 + Math.floor(arcane / 5),
      paralysisBuildUp: 10 + level * 2 + Math.floor(arcane * 0.1), // cumulative effect
      duration: 3 + Math.floor(level / 4),
      resistanceCheck: true, // targets can save each turn
      maxTargets: 3 + Math.floor(level / 5),
      effect: "Targets in the radius build up paralysis if they remain inside.",
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },

  // Applies sedative that can put target to sleep after buildup
  drowsingNeedle(level, arcane) {
    return {
      range: 40, // throwing dart
      sedationRate: 10 + level * 2 + Math.floor(arcane * 0.1), // sleep buildup per turn
      turnsUntilSleep: 5 - Math.floor(10 / (1 + level / 3)), // delay before sleep
      sleepDuration: 2 + Math.floor(level / 4) + Math.floor(arcane * 0.1),
      resistancePenalty: 5 + Math.floor(level / 3), // decreases effective poison resistance
      ...(level >= 10 && {
        infected: PoisonEquations.getInfectedEffect(level, arcane),
      }),
    };
  },
};
