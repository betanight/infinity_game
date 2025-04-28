const { coreAbbreviations, skillAbbreviations } = require("./abbreviations");

const visibleStatEquations = {

    meleeAttackAccuracy: function (scores, skills, meleeStyle) {
        let accuracy = 0;
        let primaryStatUsed = "";

        if (meleeStyle === "Brutish Melee") {
            accuracy += (scores[coreAbbreviations.S] || 0) * 3; // Strength
            accuracy += (skills.wpn || 0) * 3; // Weapon Mastery
            accuracy += (skills.bf || 0) * 3; // Brute Force
            accuracy += (skills.bwf || 0) * 2; // Bodyweight Force
            accuracy += (skills.chg || 0) * 2; // Charge
            accuracy += (skills.gp || 0) * 2; // Grappling
            accuracy += (skills.tp || 0) * 1; // Tactical Planning
            primaryStatUsed = "S"; // Strength
        } else if (meleeStyle === "Finesse Melee") {
            accuracy += (scores[coreAbbreviations.D] || 0) * 3; // Dexterity
            accuracy += (skills.bp || 0) * 3; // Blade Precision
            accuracy += (skills.vp || 0) * 2; // Vital Point Targeting
            accuracy += (skills.wf || 0) * 3; // Weapon Finesse
            accuracy += (skills.ra || 0) * 2; // Reflex Training
            accuracy += (skills.ac || 0) * 2; // Acrobatics
            accuracy += (skills.ev || 0) * 2; // Evasion
            accuracy += (skills.qc || 0) * 2; // Quick Draw
            accuracy += (skills.tp || 0) * 1; // Tactical Planning
            primaryStatUsed = "D"; // Dexterity
        }

        accuracy += (scores[coreAbbreviations.I] || 0) * 1; // Intelligence
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
        let accuracy = 0;
        let primaryStatUsed = "";

        if (rangedStyle === "Brutish Throw") {
            accuracy += (scores[coreAbbreviations.S] || 0) * 3; // Strength
            accuracy += (scores[coreAbbreviations.D] || 0) * 1; // Dexterity
            accuracy += (skills.pt || 0) * 3; // Precision Throwing
            accuracy += (skills.vp || 0) * 2; // Vital Point Targeting
            accuracy += (skills.tp || 0) * 2; // Tactical Planning
            accuracy += (skills.wpn || 0) * 2; // Weapon Mastery
            primaryStatUsed = "S"; // Strength
        } else if (rangedStyle === "Light Weapon" || rangedStyle === "Bow Type") {
            accuracy += (scores[coreAbbreviations.D] || 0) * 4; // Dexterity
            accuracy += (skills.as2 || 0) * 3; // Aimed Shot
            accuracy += (skills.qc || 0) * 2; // Quick Draw
            accuracy += (skills.pt || 0) * 3; // Precision Throwing
            accuracy += (skills.vp || 0) * 2; // Vital Point Targeting
            accuracy += (skills.td || 0) * 2; // Trigger Discipline
            accuracy += (skills.wpn || 0) * 2; // Weapon Mastery
            primaryStatUsed = "D"; // Dexterity
        } else if (rangedStyle === "Firearm") {
            accuracy += (scores[coreAbbreviations.I] || 0) * 2; // Intelligence
            accuracy += (scores[coreAbbreviations.W] || 0) * 1; // Wisdom
            accuracy += (scores[coreAbbreviations.D] || 0) * 1; // Dexterity
            accuracy += (skills.td || 0) * 3; // Trigger Discipline
            accuracy += (skills.as2 || 0) * 2; // Aimed Shot
            accuracy += (skills.tp || 0) * 2; // Tactical Planning
            accuracy += (skills.sf || 0) * 2; // Strategic Foresight
            accuracy += (skills.sa || 0) * 1; // Situational Awareness
            accuracy += (skills.ins || 0) * 1; // Insight
            primaryStatUsed = "I"; // Intelligence
        }

        return {
            totalAccuracy: accuracy,
            primaryStatUsed: primaryStatUsed
        };
    },

    energyAttackAccuracy: function (scores, skills, energyType) {
        let accuracy = 0;
        let primaryStatUsed = "";

        if (energyType === "Intelligence") {
            accuracy += (scores[coreAbbreviations.I] || 0) * 3;
            accuracy += (skills.arc || 0) * 3;
            accuracy += (skills.mt || 0) * 3;
            accuracy += (skills.sf || 0) * 2;
            accuracy += (skills.tp || 0) * 2;
            accuracy += (skills.ok || 0) * 2;
            accuracy += (skills.ins || 0) * 1;
            primaryStatUsed = "I"; // Intelligence
        } else if (energyType === "Wisdom") {
            accuracy += (scores[coreAbbreviations.W] || 0) * 3;
            accuracy += (skills.sa || 0) * 3;
            accuracy += (skills.ins || 0) * 2;
            accuracy += (skills.sf || 0) * 2;
            accuracy += (skills.sp || 0) * 2;
            accuracy += (skills.rm || 0) * 2;
            primaryStatUsed = "W"; // Wisdom
        } else if (energyType === "Spirit") {
            accuracy += (scores[coreAbbreviations.SP] || 0) * 3;
            accuracy += (scores[coreAbbreviations.I] || 0) * 0.5;
            accuracy += (skills.ef || 0) * 3;
            accuracy += (skills.rm || 0) * 3;
            accuracy += (skills.sc || 0) * 2;
            accuracy += (skills.sp || 0) * 2;
            accuracy += (skills.sa || 0) * 1;
            primaryStatUsed = "SP"; // Spirit
        } else if (energyType === "Willpower") {
            accuracy += (scores[coreAbbreviations.WP] || 0) * 3;
            accuracy += (scores[coreAbbreviations.W] || 0) * 0.5;
            accuracy += (skills.sd || 0) * 3;
            accuracy += (skills.sf || 0) * 3;
            accuracy += (skills.sa || 0) * 1;
            accuracy += (skills.arc || 0) * 1;
            primaryStatUsed = "WP"; // Willpower
        }

        return {
            totalAccuracy: accuracy,
            primaryStatUsed: primaryStatUsed
        };
    },

    rollingFunction: function (totalAccuracy, primaryScore) {
        const minPercent = primaryScore * 5;
        const minRoll = (minPercent / 100) * totalAccuracy;
        const maxRoll = totalAccuracy;

        const roll = Math.random() * (maxRoll - minRoll) + minRoll;

        return {
            roll: Math.floor(roll),
            minRoll: Math.floor(minRoll),
            maxRoll: Math.floor(maxRoll)
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

};

module.exports = visibleStatEquations;
