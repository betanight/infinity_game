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

    meleeDamage: function (scores, skills, attackType) {
        let damage = 0;

        if (attackType === "Strength") {
            damage += (scores[coreAbbreviations.S] || 0) * 2;
        } else if (attackType === "Dexterity") {
            damage += (scores[coreAbbreviations.D] || 0) * 2;
        }

        damage += (skills.wpn || 0) * 3; // Weapon Mastery (applies to both types)

        if (attackType === "Strength") {
            damage += ((skills.bf || 0) * (scores[coreAbbreviations.S] || 0)) * 0.5;
            damage += ((skills.bwf || 0) * (scores[coreAbbreviations.S] || 0)) * 0.4;
            damage += ((skills.chg || 0) * (scores[coreAbbreviations.S] || 0)) * 0.1;
            damage += ((skills.gp || 0) * (scores[coreAbbreviations.S] || 0)) * 0.2;
            damage += ((skills.he || 0) * (scores[coreAbbreviations.S] || 0)) * 0.3;
            damage += ((skills.lf || 0) * (scores[coreAbbreviations.S] || 0)) * 0.3;
        } else if (attackType === "Dexterity") {
            // Weapon Finesse is enhanced for dexterity based attacks
            damage += ((skills.wf || 0) * (scores[coreAbbreviations.D] || 0)) * 1.5;
        }

        // Intelligence and Wisdom skills apply to both
        damage += (skills.tp || 0) * 0.5;
        damage += (skills.sf || 0) * 0.5;
        damage += (skills.inv || 0) * 0.2;
        damage += (skills.sa || 0) * 0.01;
        damage += (skills.ins || 0) * 0.5;
        damage += (skills.ol || 0) * 0.5;
        damage += (skills.sr5 || 0) * 0.5;
        damage += (skills.hd || 0) * 0.3;
        damage += (skills.pa || 0) * 0.1;
        damage += (skills.pm2 || 0) * 3;

        return damage;
    }


};

module.exports = visibleStatEquations;
