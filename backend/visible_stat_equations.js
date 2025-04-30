const { coreAbbreviations, skillAbbreviations } = require("./abbreviations");
window.visibleStatEquations = visibleStatEquations;

const visibleStatEquations = {

    meleeAttackAccuracy: function (scores, skills, meleeStyle) {
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
            primaryStatUsed: primaryStatUsed
        };
    },

    rangedAttackAccuracy: function (scores, skills, rangedStyle) {
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
            primaryStatUsed = "I"; // Intelligence
        }

        return {
            totalAccuracy: accuracy,
            primaryStatUsed: primaryStatUsed
        };
    },

    energyAttackAccuracy: function (scores, skills, energyType) {
        let accuracy = 6;
        let primaryStatUsed = "";

        if (energyType === "Intelligence") {
            accuracy += (scores[coreAbbreviations.I] || 0) * 4; // Intelligence
            accuracy += (skills.arc || 0) * 3; // Arcana
            accuracy += (skills.mt || 0) * 3; // Magical Theory
            accuracy += (skills.sf || 0) * 2; // Strategic Foresight
            accuracy += (skills.tp || 0) * 2; // Tactical Planning
            accuracy += (skills.ok || 0) * 2; // Occult Knowledge
            accuracy += (skills.ins || 0) * 1; // Insight
            primaryStatUsed = "I"; // Intelligence
        } else if (energyType === "Wisdom") {
            accuracy += (scores[coreAbbreviations.W] || 0) * 4; // Wisdom
            accuracy += (skills.sa || 0) * 3; // Situational Awareness
            accuracy += (skills.ins || 0) * 2; // Insight
            accuracy += (skills.sf || 0) * 2; // Strategic Foresight
            accuracy += (skills.sp || 0) * 2; // Spiritual Pulse
            accuracy += (skills.rm || 0) * 2; // Ritual Mastery
            primaryStatUsed = "W"; // Wisdom
        } else if (energyType === "Spirit") {
            accuracy += (scores[coreAbbreviations.SP] || 0) * 4; // Spirit
            accuracy += (scores[coreAbbreviations.I] || 0) * 0.5; // Intelligence
            accuracy += (skills.ef || 0) * 3; // Energy Flow
            accuracy += (skills.rm || 0) * 3; // Ritual Mastery
            accuracy += (skills.sc || 0) * 2; // Spirit Communication
            accuracy += (skills.sp || 0) * 2; // Spiritual Pulse
            accuracy += (skills.sa || 0) * 1; // Situational Awareness
            primaryStatUsed = "SP"; // Spirit
        } else if (energyType === "Willpower") {
            accuracy += (scores[coreAbbreviations.WP] || 0) * 4; // Willpower
            accuracy += (scores[coreAbbreviations.W] || 0) * 0.5; // Wisdom
            accuracy += (skills.sd || 0) * 3; // Sheer Determination
            accuracy += (skills.sf || 0) * 3; // Strategic Foresight
            accuracy += (skills.sa || 0) * 1; // Situational Awareness
            accuracy += (skills.arc || 0) * 1; // Arcana
            primaryStatUsed = "WP"; // Willpower
        }

        return {
            totalAccuracy: accuracy,
            primaryStatUsed: primaryStatUsed
        };
    },

    rollingFunction: function (totalAccuracy, primaryScore, cc, D, armorThreshold) {
        const minPercent = primaryScore * 1;
        const minRoll = (minPercent / 100) * totalAccuracy;
        const maxRoll = totalAccuracy;

        // Generate a roll within the accuracy range (minRoll to maxRoll)
        const roll = Math.random() * (maxRoll - minRoll) + minRoll;

        let baseCriticalChance = 1; // Base critical chance is 1%
        let skillBonus = D * 0.20; // Each skill point increases critical chance by 20% of Dexterity
        let totalCriticalChance = baseCriticalChance + (cc * skillBonus); // Total critical chance

        // Calculate the critical hit margin (top percentage based on totalCriticalChance)
        let criticalMargin = maxRoll - ((totalCriticalChance / 100) * (maxRoll - minRoll));

        // Check if the roll exceeds armor threshold for a hit
        let isHit = roll >= armorThreshold;

        // If it's a hit, check for a critical hit based on the critical margin
        let isCriticalHit = false;
        if (isHit) {
            if (roll >= criticalMargin) {
                isCriticalHit = true; // Critical hit if the roll is >= criticalMargin
            }
        }

        return {
            roll: Math.floor(roll),
            minRoll: Math.floor(minRoll),
            maxRoll: Math.floor(maxRoll),
            isCriticalHit: isCriticalHit,
            criticalChance: totalCriticalChance,
            isHit: isHit
        };
    },
    
    meleeWeaponDamage: function (scores, skills, meleeStyle, elementType) {
        let damage = 0;

        if (meleeStyle === "Brutish Melee") {
            damage += (scores[coreAbbreviations.S] || 0) * 3; // Strength

            if (elementType === "Spirit") {
                damage += (scores[coreAbbreviations.SP] || 0) * 3; // Spirit
            } else if (elementType === "Arcane") {
                damage += (scores[coreAbbreviations.I] || 0) * 3; // Intelligence
            } else if (elementType === "Willpower") {
                damage += (scores[coreAbbreviations.WP] || 0) * 3; // Willpower
            } else if (elementType === "Presence") {
                damage += (scores[coreAbbreviations.PR] || 0) * 3; // Presence
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
                damage += (scores[coreAbbreviations.SP] || 0) * 2; // Spirit
            } else if (elementType === "Arcane") {
                damage += (scores[coreAbbreviations.I] || 0) * 2; // Intelligence
            } else if (elementType === "Willpower") {
                damage += (scores[coreAbbreviations.WP] || 0) * 2; // Willpower
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
    },

    rangedWeaponDamage: function (scores, skills, rangedStyle, elementType) {
        let damage = 0;

        if (rangedStyle === "Brutish Ranged") {
            damage += (scores[coreAbbreviations.S] || 0) * 2.25; // Strength

            if (elementType === "Spirit") {
                damage += (scores[coreAbbreviations.SP] || 0) * 1.5; // Spirit
            } else if (elementType === "Arcane") {
                damage += (scores[coreAbbreviations.I] || 0) * 1.5; // Intelligence
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
                damage += (scores[coreAbbreviations.I] || 0) * 1.5; // Intelligence
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
    },

    rawPhysicalDamage: function (scores, skills, elementType) {
        let damage = 0;

        damage += (scores[coreAbbreviations.S] || 0) * 3; // Strength

        if (elementType === "Spirit") {
            damage += (scores[coreAbbreviations.SP] || 0) * 1.5; // Spirit
            damage += (skills.ef || 0) * 2; // Energy Flow
            damage += (skills.rm || 0) * 2; // Ritual Mastery
            damage += (skills.sc || 0) * 1; // Spirit Communication
        } else if (elementType === "Arcane") {
            damage += (scores[coreAbbreviations.I] || 0) * 1.5; // Intelligence (Arcane)
            damage += (skills.arc || 0) * 2; // Arcana
            damage += (skills.mt || 0) * 2; // Magical Theory
        } else if (elementType === "Willpower") {
            damage += (scores[coreAbbreviations.WP] || 0) * 1.5; // Willpower
            damage += (skills.sd || 0) * 2; // Sheer Determination
            damage += (skills.sf || 0) * 2; // Steadfast Focus
            damage += (skills.id || 0) * 1; // Iron Discipline
        } else if (elementType === "Presence") {
            damage += (scores[coreAbbreviations.PR] || 0) * 1.5; // Presence
            damage += (skills.da || 0) * 2; // Dominant Aura
            damage += (skills.pm2 || 0) * 3; // Presence Manifestation
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
        damage += (skills.ad || 0) * 2; // Ambidexterity

        damage += (skills.tp || 0) * 1; // Tactical Planning
        damage += (skills.sf || 0) * 2; // Strategic Foresight
        damage += (skills.sa || 0) * 2; // Situational Awareness
        damage += (skills.ins || 0) * 1; // Insight

        return damage;
    },
    
    criticalDamage: function (damage, isCriticalHit) {
        let criticalMultiplier = 1.1;

        criticalMultiplier += (scores[coreAbbreviations.D] || 0) * 0.1;

        criticalMultiplier += (skills.cd || 0) * 0.33; // Critical Damage
        criticalMultiplier += (skills.vp || 0) * 0.1; // Vital Point Targeting

        if (isCriticalHit) {
            return damage * criticalMultiplier;} 
            else {
                return damage;
            }
    },

    characterHealth: function (currentHealth, scores, skills) {
        let maxHealth = 0;

        maxHealth += (scores[coreAbbreviations.C] || 0) * 10;

        maxHealth += (skills.bc || 0) * 2;   // Blood Circulation
        maxHealth += (skills.cs || 0) * 3;   // Core Strength
        maxHealth += (skills.end || 0) * 4;  // Endurance
        maxHealth += (skills.fs || 0) * 5; // Fat Storage
        maxHealth += (skills.lon || 0) * 3;  // Longevity
        maxHealth += (skills.nh || 0) * 2;   // Natural Healing
        maxHealth += (skills.pt2 || 0) * 4;  // Pain Tolerance
        maxHealth += (skills.pp || 0) * 5;   // Physical Perseverance
        maxHealth += (skills.togh || 0) * 7; // Toughness
        maxHealth += (skills.vit || 0) * 10; // Vitality

        const damageTaken = maxHealth - currentHealth;
        const healthPercent = Math.max(0, currentHealth / maxHealth); // from 0 to 1

        return {
            maxHealth,
            damageTaken,
            healthPercent: Math.round(healthPercent * 100)
        };
    },
    
    characterArmor: function (scores, skills, armorType) {
        let armor = 0;

        armor += (scores[coreAbbreviations.C] || 0) * 1;

        armor += (skills.cs || 0) * 2;    // Core Strength
        armor += (skills.pp || 0) * 1;    // Physical Perseverance
        armor += (skills.he || 0) * 2;    // Heavy Endurance
        armor += (skills.togh || 0) * 3;  // Toughness
        armor += (skills.ir || 0) * 4;    // Impact Resistance
        armor += (skills.ad || 0) * 1;    // Adaptability
        armor += (skills.blr || 0) * 1;   // Bludgeoning Resistance
        armor += (skills.pier || 0) * 1;  // Piercing Resistance
        armor += (skills.slr || 0) * 1;   // Slashing Resistance

        if (armorType === "Unarmored" || armorType === "Light") {
            armor += (scores[coreAbbreviations.D] || 0) * 3; // Dexterity

            armor += (skills.ev || 0) * 5;  // Evasion
            armor += (skills.ra || 0) * 3;  // Reflex Training
            armor += (skills.ac || 0) * 3;  // Acrobatics
            armor += (skills.bl || 0) * 2;  // Balance
            armor += (skills.ms || 0) * 1;  // Missile Snaring
            armor += (skills.amb || 0) * 1; // Ambidexterity
            armor += (skills.qc || 0) * 1;  // Quick Draw
            armor += (skills.wf || 0) * 1;  // Weapon Finesse
        }

        if (armorType === "Heavy") {
            armor += (scores[coreAbbreviations.S] || 0) * 3; // Strength

            armor += (skills.pl || 0) * 3;  // Power Lift
            armor += (skills.mc || 0) * 2;  // Muscle Control
            armor += (skills.mm || 0) * 2;  // Momentum Management
            armor += (skills.ps || 0) * 2;  // Postural Strength
            armor += (skills.sts || 0) * 3; // Stone Stance
            armor += (skills.as || 0) * 2;  // Anchor Stance
            armor += (skills.ig || 0) * 1;  // Iron Grip
            armor += (skills.wpn || 0) * 1; // Weapon Mastery
        }

        return armor;
    },

    characterMovement: function (scores, skills) {
        let speed = 30;

        speed += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity

        speed += (scores[coreAbbreviations.C] || 0) * 1; // Constitution

        speed += (skills.ac || 0) * 2; // Acrobatics
        speed += (skills.bl || 0) * 2; // Balance
        speed += (skills.ev || 0) * 1; // Evasion
        speed += (skills.ra || 0) * 1; // Reflex Training

        speed += (skills.pp || 0) * 2;  // Physical Perseverance

        // Round down to nearest multiple of 5
        speed = Math.floor(speed / 5) * 5;

        return speed;
    }

};

module.exports = visibleStatEquations;
