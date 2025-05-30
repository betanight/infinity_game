import { coreAbbreviations } from "./abbreviations.js";

export default class VisibleStatEquations {
  static meleeAttackAccuracy(scores, skills, meleeStyle) {
    let accuracy = 7;
    let primaryStatUsed = "";

    if (meleeStyle === "Brutish Melee") {
      accuracy += (scores[coreAbbreviations.S] || 0) * 4; // Strength
      accuracy += (skills.wpn || 0) * 5; // Weapon Mastery
      accuracy += (skills.bf || 0) * 4; // Brute Force
      accuracy += (skills.bwf || 0) * 3; // Bodyweight Force
      accuracy += (skills.chg || 0) * 2; // Charge
      accuracy += (skills.gp || 0) * 2; // Grappling
      accuracy += (skills.tp || 0) * 3; // Tactical Planning
      primaryStatUsed = "S"; // Strength
    } else if (meleeStyle === "Finesse Melee") {
      accuracy += (scores[coreAbbreviations.D] || 0) * 5; // Dexterity
      accuracy += (skills.bp || 0) * 4; // Blade Precision
      accuracy += (skills.vp || 0) * 4; // Vital Point Targeting
      accuracy += (skills.wf || 0) * 3; // Weapon Finesse
      accuracy += (skills.ra || 0) * 3; // Reflex Training
      accuracy += (skills.ac || 0) * 3; // Acrobatics
      accuracy += (skills.ev || 0) * 2; // Evasion
      accuracy += (skills.qc || 0) * 2; // Quick Draw
      accuracy += (skills.tp || 0) * 2; // Tactical Planning
      primaryStatUsed = "D"; // Dexterity
    }

    accuracy += (scores[coreAbbreviations.I] || 0) * 2; // Intelligence
    accuracy += (scores[coreAbbreviations.W] || 0) * 1; // Wisdom
    accuracy += (skills.sf || 0) * 2; // Strategic Foresight
    accuracy += (skills.sa || 0) * 2; // Situational Awareness
    accuracy += (skills.ins || 0) * 1; // Insight
    accuracy += (skills.ol || 0) * 1; // Observation Logging

    return {
      totalAccuracy: accuracy,
      primaryStatUsed: primaryStatUsed,
    };
  }

  static rangedAttackAccuracy(scores, skills, rangedStyle) {
    let accuracy = 5;
    let primaryStatUsed = "";

    if (rangedStyle === "Brutish Throw") {
      accuracy += (scores[coreAbbreviations.S] || 0) * 4; // Strength
      accuracy += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity
      accuracy += (skills.pt || 0) * 5; // Precision Throwing
      accuracy += (skills.vp || 0) * 3; // Vital Point Targeting
      accuracy += (skills.tp || 0) * 3; // Tactical Planning
      accuracy += (skills.wpn || 0) * 2; // Weapon Mastery
      primaryStatUsed = "S"; // Strength
    } else if (rangedStyle === "Light Weapon" || rangedStyle === "Bow Type") {
      accuracy += (scores[coreAbbreviations.D] || 0) * 4; // Dexterity
      accuracy += (scores[coreAbbreviations.W] || 0) * 2; // Wisdom
      accuracy += (skills.as2 || 0) * 5; // Aimed Shot
      accuracy += (skills.qc || 0) * 2; // Quick Draw
      accuracy += (skills.pt || 0) * 4; // Precision Throwing
      accuracy += (skills.vp || 0) * 2; // Vital Point Targeting
      accuracy += (skills.td || 0) * 2; // Trigger Discipline
      accuracy += (skills.wpn || 0) * 2; // Weapon Mastery
      accuracy += (skills.amb || 0) * 2; // Ambidexterity
      primaryStatUsed = "D"; // Dexterity
    } else if (rangedStyle === "Firearm") {
      accuracy += (scores[coreAbbreviations.I] || 0) * 3; // Intelligence
      accuracy += (scores[coreAbbreviations.W] || 0) * 2; // Wisdom
      accuracy += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity
      accuracy += (skills.td || 0) * 5; // Trigger Discipline
      accuracy += (skills.as2 || 0) * 6; // Aimed Shot
      accuracy += (skills.tp || 0) * 4; // Tactical Planning
      accuracy += (skills.sf || 0) * 3; // Strategic Foresight
      accuracy += (skills.sa || 0) * 2; // Situational Awareness
      accuracy += (skills.ins || 0) * 2; // Insight
      accuracy += (skills.amb || 0) * 2; // Ambidexterity
      primaryStatUsed = "I"; // Intelligence
    }

    return {
      totalAccuracy: accuracy,
      primaryStatUsed: primaryStatUsed,
    };
  }

  static rollingFunction(totalAccuracy, primaryScore, cc, D, armorThreshold) {
    const minRoll = Math.max(1, Math.floor(Math.sqrt(totalAccuracy)));
    const maxRoll = totalAccuracy;

    const roll = Math.random() * (maxRoll - minRoll) + minRoll;

    let baseCriticalChance = 1; // Base 1%
    let skillBonus = D * 0.05; // Each point of Dex adds 5% per skill level
    let totalCriticalChance = cc * skillBonus;

    // Cap critical chance at 50%
    if (totalCriticalChance > 50) totalCriticalChance = 50;

    const criticalMargin =
      maxRoll - (totalCriticalChance / 100) * (maxRoll - minRoll);

    const isHit = roll >= armorThreshold;
    const isCriticalHit = isHit && roll >= criticalMargin;

    return {
      roll: Math.floor(roll),
      minRoll: Math.floor(minRoll),
      maxRoll: Math.floor(maxRoll),
      isCriticalHit,
      criticalChance: totalCriticalChance,
      isHit,
    };
  }

  static rawMeleeAccuracy(scores, skills) {
    let accuracy = 5;

    const strength = scores[coreAbbreviations.S] || 0;
    const dexterity = scores[coreAbbreviations.D] || 0;

    if (dexterity > strength) {
      // Dexterity-focused accuracy (finesse strikes)
      accuracy += dexterity * 4;
      accuracy += (skills.ac || 0) * 2; // Acrobatics
      accuracy += (skills.vp || 0) * 3; // Vital Point Targeting
      accuracy += (skills.ra || 0) * 2; // Reflex Training
      accuracy += (skills.amb || 0) * 2; // Ambidexterity
      accuracy += (skills.sh || 0) * 1; // Sleight of Hand
      accuracy += (skills.bl || 0) * 1; // Balance
      accuracy += (skills.qc || 0) * 1; // Quick Draw
    } else {
      // Strength-focused accuracy (brute strikes)
      accuracy += strength * 4;
      accuracy += (skills.bf || 0) * 4; // Brute Force
      accuracy += (skills.bwf || 0) * 3; // Bodyweight Force
      accuracy += (skills.gp || 0) * 2; // Grappling
      accuracy += (skills.chg || 0) * 2; // Charge
      accuracy += (skills.fc || 0) * 2; // Fist Conditioning
      accuracy += (skills.ig || 0) * 2; // Iron Grip
      accuracy += (skills.ss || 0) * 1; // Shoulder Strength
      accuracy += (skills.mc || 0) * 1; // Muscle Control
    }

    // Global accuracy helpers (universal)
    accuracy += (scores[coreAbbreviations.I] || 0) * 1;
    accuracy += (scores[coreAbbreviations.W] || 0) * 1;
    accuracy += (skills.sf || 0) * 2; // Strategic Foresight
    accuracy += (skills.tp || 0) * 1; // Tactical Planning
    accuracy += (skills.sa || 0) * 1; // Situational Awareness
    accuracy += (skills.ins || 0) * 1; // Insight
    accuracy += (skills.ol || 0) * 1; // Observation Logging

    return accuracy;
  }

  static meleeWeaponDamage(scores, skills, meleeStyle, elementType) {
    let damage = 0;

    if (meleeStyle === "Brutish Melee") {
      damage += (scores[coreAbbreviations.S] || 0) * 3; // Strength

      if (elementType === "Spirit") {
        damage += (scores[coreAbbreviations.SP] || 0) * 3; // Spirit
      } else if (elementType === "Arcane") {
        damage += (scores[coreAbbreviations.A] || 0) * 3; // Arcane
      } else if (elementType === "Willpower") {
        damage += (scores[coreAbbreviations.WP] || 0) * 3; // Willpower
      } else if (elementType === "Presence") {
        damage += (scores[coreAbbreviations.PR] || 0) * 4; // Presence
      }

      damage += (skills.wpn || 0) * 3; // Weapon Mastery
      damage += (skills.bf || 0) * 5; // Brute Force
      damage += (skills.bwf || 0) * 5; // Bodyweight Force
      damage += (skills.wt || 0) * 5; // Weight Toss
      damage += (skills.chg || 0) * 2; // Charge
      damage += (skills.tp || 0) * 1; // Tactical Planning
      damage += (skills.mm || 0) * 2; // Momentum Management
      damage += (skills.mc || 0) * 2; // Muscle Control
      damage += (skills.ss || 0) * 2; // Shoulder Strength
    } else if (meleeStyle === "Finesse Melee") {
      damage += (scores[coreAbbreviations.D] || 0) * 0.8; // Dexterity

      if (elementType === "Spirit") {
        damage += (scores[coreAbbreviations.SP] || 0) * 3; // Spirit
      } else if (elementType === "Arcane") {
        damage += (scores[coreAbbreviations.A] || 0) * 2; // Arcane
      } else if (elementType === "Willpower") {
        damage += (scores[coreAbbreviations.WP] || 0) * 3; // Willpower
      } else if (elementType === "Presence") {
        damage += (scores[coreAbbreviations.PR] || 0) * 2; // Presence
      }

      damage += (skills.wf || 0) * 3; // Weapon Finesse
      damage += (skills.bp || 0) * 3; // Blade Precision
      damage += (skills.ra || 0) * 2; // Reflex Training
      damage += (skills.tp || 0) * 1; // Tactical Planning
      damage += (skills.mm || 0) * 1; // Momentum Management
      damage += (skills.mc || 0) * 1; // Muscle Control
      damage += (skills.ss || 0) * 1; // Shoulder Strength
    }

    // Global Bonuses (same for both styles)
    damage += (scores[coreAbbreviations.I] || 0) * 1; // Intelligence
    damage += (scores[coreAbbreviations.W] || 0) * 1; // Wisdom
    damage += (skills.sf || 0) * 2; // Strategic Foresight
    damage += (skills.sa || 0) * 2; // Situational Awareness
    damage += (skills.ins || 0) * 1; // Insight
    damage += (skills.ol || 0) * 1; // Observation Logging

    return damage;
  }

  static rangedWeaponDamage(scores, skills, rangedStyle, elementType) {
    let damage = 0;

    if (rangedStyle === "Brutish Ranged") {
      damage += (scores[coreAbbreviations.S] || 0) * 2.25; // Strength

      if (elementType === "Spirit") {
        damage += (scores[coreAbbreviations.SP] || 0) * 1.5; // Spirit
      } else if (elementType === "Arcane") {
        damage += (scores[coreAbbreviations.A] || 0) * 1.5; // Arcane
      } else if (elementType === "Willpower") {
        damage += (scores[coreAbbreviations.WP] || 0) * 1.5; // Willpower
      } else if (elementType === "Presence") {
        damage += (scores[coreAbbreviations.PR] || 0) * 1.5; // Presence
      }

      damage += (skills.wpn || 0) * 3; // Weapon Mastery
      damage += (skills.bf || 0) * 5; // Brute Force
      damage += (skills.bwf || 0) * 5; // Bodyweight Force
      damage += (skills.wt || 0) * 5; // Weight Toss
      damage += (skills.chg || 0) * 3; // Charge

      // utility strength skills that can slightly benefit throwing objects
      damage += (skills.ls || 0) * 1.5; // Load Stabilization
      damage += (skills.mc || 0) * 1.5; // Muscle Control
      damage += (skills.os || 0) * 1.5; // Overhead Strength
      damage += (skills.pl || 0) * 1.5; // Power Life
      damage += (skills.ss || 0) * 1.5; // Shoulder Strength
    } else if (rangedStyle === "Finesse Ranged") {
      damage += (scores[coreAbbreviations.D] || 0) * 0.6; // Dexterity

      if (elementType === "Spirit") {
        damage += (scores[coreAbbreviations.SP] || 0) * 1.5; // Spirit
      } else if (elementType === "Arcane") {
        damage += (scores[coreAbbreviations.A] || 0) * 1.5; // Arcane
      } else if (elementType === "Willpower") {
        damage += (scores[coreAbbreviations.WP] || 0) * 1.5; // Willpower
      } else if (elementType === "Presence") {
        damage += (scores[coreAbbreviations.PR] || 0) * 1.5; // Presence
      }

      damage += (skills.wf || 0) * 3; // Weapon Finesse
      damage += (skills.bp || 0) * 3; // Blade Precision
      damage += (skills.as || 0) * 3; // Aimed Shot
      damage += (skills.pt || 0) * 3; // Precision Throwing
      damage += (skills.ra || 0) * 2; // Reflex Training
    }

    damage += (scores[coreAbbreviations.I] || 0) * 1; // Intelligence
    damage += (scores[coreAbbreviations.W] || 0) * 1; // Wisdom
    damage += (skills.sf || 0) * 2; // Strategic Foresight
    damage += (skills.tp || 0) * 1; // Tactical Planning
    damage += (skills.sa || 0) * 2; // Situational Awareness
    damage += (skills.ins || 0) * 1; // Insight
    damage += (skills.ol || 0) * 1; // Observation Logging

    return damage;
  }

  static rawPhysicalDamage(scores, skills, elementType) {
    let damage = 0;

    damage += (scores[coreAbbreviations.S] || 0) * 3; // Strength

    if (elementType === "Spirit") {
      damage += (scores[coreAbbreviations.SP] || 0) * 1.5; // Spirit
    } else if (elementType === "Arcane") {
      damage += (scores[coreAbbreviations.A] || 0) * 1.5; // Arcane
      damage += (skills.arc || 0) * 2; // Arcana
      damage += (skills.mt || 0) * 2; // Magical Theory
    } else if (elementType === "Willpower") {
      damage += (scores[coreAbbreviations.WP] || 0) * 1.5; // Willpower
    } else if (elementType === "Presence") {
      damage += (scores[coreAbbreviations.PR] || 0) * 1.5; // Presence
    }

    damage += (skills.bf || 0) * 3; // Brute Force
    damage += (skills.bwf || 0) * 4; // Bodyweight Force
    damage += (skills.ss || 0) * 2; // Shoulder Strength
    damage += (skills.mc || 0) * 2; // Muscle Control
    damage += (skills.os || 0) * 2; // Overhead Strength
    damage += (skills.pl || 0) * 2; // Power Life
    damage += (skills.gs || 0) * 2; // Grip Strength
    damage += (skills.fc || 0) * 2; // Fist Conditioning
    damage += (skills.ig || 0) * 2; // Iron Grip
    damage += (skills.lb || 0) * 2; // Load Bearing
    damage += (skills.ls || 0) * 2; // Load Stabilization
    damage += (skills.mm || 0) * 2; // Momentum Management
    damage += (skills.ps || 0) * 2; // Postural Strength
    damage += (skills.amb || 0) * 2; // Ambidexterity

    damage += (skills.tp || 0) * 1; // Tactical Planning
    damage += (skills.sf || 0) * 2; // Strategic Foresight
    damage += (skills.sa || 0) * 2; // Situational Awareness
    damage += (skills.ins || 0) * 1; // Insight

    return damage;
  }

  static criticalDamage(damage, isCriticalHit) {
    let criticalMultiplier = 1.1;

    criticalMultiplier += (scores[coreAbbreviations.D] || 0) * 0.1;

    criticalMultiplier += (skills.cd || 0) * 0.33; // Critical Damage
    criticalMultiplier += (skills.vp || 0) * 0.1; // Vital Point Targeting

    if (isCriticalHit) {
      return damage * criticalMultiplier;
    } else {
      return damage;
    }
  }

  static characterHealth(currentHealth, scores, skills) {
    let maxHealth = 0;

    maxHealth += (scores[coreAbbreviations.C] || 0) * 10;

    maxHealth += (skills.bc || 0) * 2; // Blood Circulation
    maxHealth += (skills.cs || 0) * 3; // Core Strength
    maxHealth += (skills.end || 0) * 4; // Endurance
    maxHealth += (skills.fs || 0) * 5; // Fat Storage
    maxHealth += (skills.lon || 0) * 3; // Longevity
    maxHealth += (skills.nh || 0) * 2; // Natural Healing
    maxHealth += (skills.pt2 || 0) * 4; // Pain Tolerance
    maxHealth += (skills.pp || 0) * 5; // Physical Perseverance
    maxHealth += (skills.togh || 0) * 7; // Toughness
    maxHealth += (skills.vit || 0) * 10; // Vitality

    const damageTaken = maxHealth - currentHealth;
    const healthPercent = Math.max(0, currentHealth / maxHealth); // from 0 to 1

    return {
      maxHealth,
      damageTaken,
      healthPercent: Math.round(healthPercent * 100),
    };
  }

  static characterArmor(scores, skills, armorType) {
    let armor = 0;

    armor += (scores[coreAbbreviations.C] || 0) * 1;

    armor += (skills.cs || 0) * 2; // Core Strength
    armor += (skills.pp || 0) * 1; // Physical Perseverance
    armor += (skills.he || 0) * 2; // Heavy Endurance
    armor += (skills.togh || 0) * 3; // Toughness
    armor += (skills.ir || 0) * 4; // Impact Resistance
    armor += (skills.ad || 0) * 1; // Adaptability
    armor += (skills.blr || 0) * 1; // Bludgeoning Resistance
    armor += (skills.pier || 0) * 1; // Piercing Resistance
    armor += (skills.slr || 0) * 1; // Slashing Resistance

    if (armorType === "Unarmored" || armorType === "Light") {
      armor += (scores[coreAbbreviations.D] || 0) * 3; // Dexterity

      armor += (skills.ev || 0) * 5; // Evasion
      armor += (skills.ra || 0) * 3; // Reflex Training
      armor += (skills.ac || 0) * 3; // Acrobatics
      armor += (skills.bl || 0) * 2; // Balance
      armor += (skills.ms || 0) * 1; // Missile Snaring
      armor += (skills.qc || 0) * 1; // Quick Draw
      armor += (skills.wf || 0) * 1; // Weapon Finesse
      armor += (skills.sa || 0) * 2; // Shock Absorption
    }

    if (armorType === "Heavy") {
      armor += (scores[coreAbbreviations.S] || 0) * 3; // Strength

      armor += (skills.pl || 0) * 3; // Power Lift
      armor += (skills.mc || 0) * 2; // Muscle Control
      armor += (skills.mm || 0) * 2; // Momentum Management
      armor += (skills.ps || 0) * 2; // Postural Strength
      armor += (skills.sts || 0) * 3; // Stone Stance
      armor += (skills.as || 0) * 2; // Anchor Stance
      armor += (skills.ig || 0) * 1; // Iron Grip
      armor += (skills.wpn || 0) * 1; // Weapon Mastery
    }

    return armor;
  }

  static characterMovement(scores, skills) {
    let speed = 30;

    speed += (scores[coreAbbreviations.D] || 0) * 0.1; // Dexterity

    speed += (scores[coreAbbreviations.C] || 0) * 1; // Constitution

    speed += (skills.ac || 0) * 2; // Acrobatics
    speed += (skills.bl || 0) * 2; // Balance
    speed += (skills.ev || 0) * 1; // Evasion
    speed += (skills.ra || 0) * 1; // Reflex Training

    speed += (skills.pp || 0) * 2; // Physical Perseverance

    // Round down to nearest multiple of 5
    speed = Math.floor(speed / 5) * 5;

    return speed;
  }

  static characterStealth(scores, skills) {
    let stealth = 10;

    stealth += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity

    stealth += (skills.ev || 0) * 2; // Evasion
    stealth += (skills.ac || 0) * 1; // Acrobatics
    stealth += (skills.bl || 0) * 1; // Balance
    stealth += (skills.ra || 0) * 1; // Reflex Training
    stealth += (skills.sh || 0) * 1; // Sleight of Hand

    stealth += (skills.st || 0) * 5; // Stealth

    stealth += (skills.sf || 0) * 1; // Strategic Foresight
    stealth += (skills.tp || 0) * 1; // Tactical Planning
    stealth += (skills.caw || 0) * 1; // Caution Awareness
    stealth += (skills.sa || 0) * 2; // Situational Awareness
    stealth += (skills.ar || 0) * 1; // Audience Reading
    stealth += (skills.dec || 0) * 3; // Deception
    stealth += (skills.dd || 0) * 2; // Disguise Demeanor
    stealth += (skills.perf || 0) * 2; // Performance
    stealth += (skills.rr || 0) * 2; // Read the Room
    stealth += (skills.log || 0) * 2; // Logic

    return stealth;
  }

  static characterEvasion(scores, skills) {
    // AOE Armor Class
    let evasion = 10;

    evasion += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity

    evasion += (skills.ev || 0) * 6; // Evasion
    evasion += (skills.amb || 0) * 2; // Ambidexterity
    evasion += (skills.ms || 0) * 2; // Missile Snaring
    evasion += (skills.ea || 0) * 4; // Escape Artist
    evasion += (skills.ra || 0) * 3; // Reflex Training

    evasion += (skills.mc || 0) * 3; // Muscle Control
    evasion += (skills.mm || 0) * 3; // Momentum Management
    evasion += (skills.ofa || 0) * 4; // Opposing Force Application

    evasion += (skills.ca || 0) * 1; // Cognitive Ability
    evasion += (skills.log || 0) * 2; // Logic

    evasion += (skills.sf || 0) * 1; // Strategic Foresigh
    evasion += (skills.tp || 0) * 1; // Tactical Planning

    evasion += (skills.pr || 0) * 2; // Pattern Recognitiion
    evasion += (skills.pj || 0) * 2; // Practical Judgement
    evasion += (skills.sa || 0) * 2; // Situational Awareness

    evasion += (skills.perf || 0) * 2; // Performance
  }
}
