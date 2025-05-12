import { FireEquations } from "./fire-functions";
import { FrostEquations } from "./frost-functions";
import { LightningEquations } from "./lightning-functions";
import { WaterEquations } from "./water-functions";
import { PoisonEquations } from "./poison-functions";

export const WindEquations = {
  // Elemental Infusion Logic: Automatically applies the highest unlocked effect to the Wind spell
  elementInfusion(level, windSpell, otherElementLevels) {
    // Only enhance Wind spells at level 5 or higher
    if (level < 5) return; // No enhancement before level 5

    // Check for elements with at least 10 levels in one spell
    const availableElements = [];
    if (otherElementLevels.fire >= 10) availableElements.push("fire");
    if (otherElementLevels.frost >= 10) availableElements.push("frost");
    if (otherElementLevels.lightning >= 10) availableElements.push("lightning");
    if (otherElementLevels.water >= 10) availableElements.push("water");
    if (otherElementLevels.poison >= 10) availableElements.push("poison");

    // If no element is available for infusion, do nothing
    if (availableElements.length === 0) return;

    // Select the first available element (for now, can be player-selected later)
    const selectedElement = availableElements[0];
    const highestSpellLevel =
      otherElementLevels[`${selectedElement}SpellLevel`];
    const effectLevel = Math.floor(highestSpellLevel / 10);

    // Apply the effect based on the element
    switch (selectedElement) {
      case "fire":
        windSpell.burn = FireEquations.getBurnEffect(effectLevel); // Apply Fire burn effect
        break;

      case "frost":
        windSpell.frostbite = FrostEquations.getFrostbiteEffect(effectLevel); // Apply Frost effect
        break;

      case "lightning":
        windSpell.numbEffect = LightningEquations.getNumbEffect(effectLevel); // Apply Lightning numb effect
        break;

      case "water":
        windSpell.soakEffect = WaterEquations.getSoakEffect(
          effectLevel,
          highestSpellLevel
        ); // Apply Water effect
        break;

      case "poison":
        windSpell.infectedEffect =
          PoisonEquations.getInfectedEffect(effectLevel); // Apply Poison infect effect
        break;

      default:
        break;
    }
  },

  // galeCutter: Wind damage + elemental infusion effect
  galeCutter(level, arcane, otherElementLevels) {
    const base = (6 + level) * 1.8; // damage
    const scaling = arcane * (1.1 + level * 0.035); // damage

    const enhancedSpell = { slashing: Math.round(base + scaling) }; // base wind spell damage

    // Apply element infusion to the enhanced spell
    this.elementInfusion(level, enhancedSpell, otherElementLevels);

    return {
      ...enhancedSpell,
      range: 80, // utility
      effect: 10, // elemental effects within 5 feet radius
      effectOnHit: true, // Apply effects only to targets hit by the spell
    };
  },

  // tailwindStep: Movement boost + evasion with no element infusion
  tailwindStep(level, otherElementLevels) {
    const enhancedSpell = {
      movementBoost: 10 + level * 1.5, // utility
      evasionBoost: 8 + level * 1.8, // utility
      duration: 1 + Math.floor(level / 5), // utility
    };

    // Apply element infusion to the spell for additional effects (burn, soak, etc.)
    this.elementInfusion(level, enhancedSpell, otherElementLevels);

    return {
      ...enhancedSpell,
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: false, // No onHit effect here (no need to apply it to those hit)
    };
  },

  // bufferZone: Projectile deflection + fall damage reduction, with elemental effects in the zone
  bufferZone(level, otherElementLevels) {
    const enhancedSpell = {
      projectileDeflection: 5 + level * 2, // utility
      fallDamageReduction: 10 + level * 2, // utility
      duration: 2 + Math.floor(level / 3), // utility
    };

    // Apply element infusion to the zone area effect
    this.elementInfusion(level, enhancedSpell, otherElementLevels);

    return {
      ...enhancedSpell,
      effect: 10, // Apply elemental effects within a 10 feet radius (larger zone)
      effectOnHit: false, // No onHit effect here (since it's an area effect)
    };
  },

  // cycloneBurst: Bludgeoning damage + elemental infusion
  cycloneBurst(level, arcane, otherElementLevels) {
    const base = (6 + level) * 1.6; // damage
    const scaling = arcane * (1.0 + level * 0.03); // damage
    const rawRadius = 10 + level;
    const radius = Math.floor(rawRadius / 5) * 5;

    const enhancedSpell = { bludgeoning: Math.round(base + scaling), radius }; // base wind spell damage

    // Apply element infusion to the enhanced spell for additional effects (burn, frostbite, etc.)
    this.elementInfusion(level, enhancedSpell, otherElementLevels);

    return {
      ...enhancedSpell,
      knockback: 5 + level * 0.5, // utility
      range: 0, // utility
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: true, // Only apply effects to those hit by the spell
    };
  },

  // windsnare: Trip chance + number of targets to trip
  windsnare(level) {
    const enhancedSpell = {
      tripChance: 20 + level * 1.5, // utility
      duration: 2 + Math.floor(level / 4), // utility
      maxTargets: Math.floor(level / 10) + 1, // number of targets to trip
    };

    // Apply element infusion to the spell for additional effects (burn, soak, etc.)
    this.elementInfusion(level, enhancedSpell, otherElementLevels);

    return {
      ...enhancedSpell,
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: true, // Only apply effects to those hit by the spell
    };
  },

  // skyhookLash: Melee range bonus + slashing damage
  skyhookLash(level, arcane) {
    const base = (3 + level) * 1.4; // damage
    const scaling = arcane * (0.9 + level * 0.025); // damage
    return {
      meleeRangeBonus: 5, // utility
      slashing: Math.round(base + scaling), // damage
      duration: 1 + Math.floor(level / 5), // utility
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: true, // Only apply effects to those hit by the spell
    };
  },

  // whisperSense: Detection range + air signal sensitivity
  whisperSense(level) {
    return {
      detectionRange: 10 + level * 3, // utility
      airSignalSensitivity: 5 + level * 2, // utility
      canSenseThroughWalls: level >= 7, // utility
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: false, // No onHit effect here (since it’s not a direct hit spell)
    };
  },

  // gust: Knockback distance + cone range
  gust(level) {
    return {
      knockbackDistance: 10 + level, // utility
      coneRange: 15 + level, // utility
      knockbackScale: 1 + Math.floor(level / 5), // utility
      effect: 10, // Apply elemental effects within a 10 feet radius
      effectOnHit: true, // Only apply effects to those hit by the spell
    };
  },

  // reactiveBoost: Fall damage reduction + range
  reactiveBoost(level) {
    return {
      fallDamageReduction: 10 + level * 2, // utility
      range: 30 + level, // utility
      duration: 1 + Math.floor(level / 5), // utility
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: false, // No onHit effect here (since it’s not a direct hit spell)
    };
  },

  // galeLift: Jump height increase + descent slowdown
  galeLift(level) {
    return {
      jumpHeightIncrease: 10 + level * 1.5, // utility
      descentSlowdown: 5 + Math.floor(level / 3), // utility
      effect: 10, // Apply elemental effects within a 5 feet radius
      effectOnHit: false, // No onHit effect here (since it’s not a direct hit spell)
    };
  },
};
