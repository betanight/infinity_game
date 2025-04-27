const { coreAbbreviations, skillAbbreviations } = require("./abbreviations");

const visibleStatEquations = {

    meleeAttackAccuracy: function (scores, skills) {
        let accuracy = 0;

        accuracy += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity bonus

        accuracy += (skills.bp || 0) * 2; // Blade Precision
        accuracy += (skills.vp || 0) * 2; // Vital Point Targeting
        accuracy += (skills.ra || 0) * 1; // Reflex Training
        accuracy += (skills.ac || 0) * 1; // Acrobatics
        accuracy += (skills.ev || 0) * 1; // Evasion
        accuracy += (skills.wf || 0) * 2; // Weapon Finesse
        accuracy += (skills.qc || 0) * 1; // Quick Draw

        accuracy += (scores[coreAbbreviations.S] || 0) * 1; // Strength bonus
        accuracy += (skills.wpn || 0) * 3; // Weapon Mastery
        accuracy += (skills.chg || 0) * 2; // Charge

        accuracy += (scores[coreAbbreviations.I] || 0) * 1; // Intelligence bonus
        accuracy += (skills.tp || 0) * 2; // Tactical Planning
        accuracy += (skills.sf || 0) * 2; // Strategic Foresight

        accuracy += (scores[coreAbbreviations.W] || 0) * 1; // Wisdom bonus
        accuracy += (skills.sa || 0) * 2; // Situational Awareness
        accuracy += (skills.ins || 0) * 1; // Insight
        accuracy += (skills.ol || 0) * 1; // Observation Logging

        return accuracy;
    },

    rangedAttackAccuracy: function (scores, skills) {
        let accuracy = 0;

        accuracy += (scores[coreAbbreviations.D] || 0) * 2; // Dexterity bonus

        accuracy += (skills.as2 || 0) * 2; // Aimed Shot
        accuracy += (skills.pt || 0) * 2; // Precision Throwing
        accuracy += (skills.td || 0) * 2; // Trigger Discipline
        accuracy += (skills.qc || 0) * 1; // Quick Draw

        accuracy += (scores[coreAbbreviations.I] || 0) * 1; // Intelligence bonus
        accuracy += (skills.tp || 0) * 2; // Tactical Planning
        accuracy += (skills.sf || 0) * 2; // Strategic Foresight

        accuracy += (scores[coreAbbreviations.W] || 0) * 1; // Wisdom bonus
        accuracy += (skills.sa || 0) * 2; // Situational Awareness
        accuracy += (skills.ol || 0) * 1; // Observation Logging
        accuracy += (skills.ins || 0) * 1; // Insight (optional)

        return accuracy;
    },

    energyAttackAccuracy: function (scores, skills, energyType) {
        let accuracy = 0;

        if (energyType === "Intelligence") {
            accuracy += (scores[coreAbbreviations.I] || 0) * 3; // Intelligence
            accuracy += (skills.arc || 0) * 3; // Arcana
            accuracy += (skills.mt || 0) * 3; // Magical Theory
            accuracy += (skills.sf || 0) * 2; // Strategic Foresight
            accuracy += (skills.tp || 0) * 2; // Tactical Planning
            accuracy += (skills.ok || 0) * 2; // Occult Knowledge

            accuracy += (skills.ins || 0) * 1; // Insight

        } else if (energyType === "Wisdom") {
            accuracy += (scores[coreAbbreviations.W] || 0) * 3; // Wisdom
            accuracy += (skills.sa || 0) * 3; // Situational Awareness
            accuracy += (skills.ins || 0) * 2; // Insight
            accuracy += (skills.sf || 0) * 2; // Strategic Foresight

            accuracy += (skills.sp || 0) * 2; // Spiritual Perception
            accuracy += (skills.rm || 0) * 2; // Ritual Mastery

        } else if (energyType === "Spirit") {
            accuracy += (scores[coreAbbreviations.SP] || 0) * 3; // Spirit
            accuracy += (scores[coreAbbreviations.I] || 0) * 0.5; // Intelligence
            accuracy += (skills.ef || 0) * 3; // Energy Flow
            accuracy += (skills.rm || 0) * 3; // Ritual Mastery
            accuracy += (skills.sc || 0) * 2; // Spirit Communication

            accuracy += (skills.sp || 0) * 2; // Spiritual Perception
            accuracy += (skills.sa || 0) * 1; // Situational Awareness

        } else if (energyType === "Willpower") {
            accuracy += (scores[coreAbbreviations.WP] || 0) * 3; // Willpower
            accuracy += (scores[coreAbbreviations.W] || 0) * 0.5; // Wisdom
            accuracy += (skills.sd || 0) * 3; // Sheer Determination
            accuracy += (skills.sf || 0) * 3; // Steadfast Focus

            accuracy += (skills.sa || 0) * 1; // Situational Awareness
            accuracy += (skills.arc || 0) * 1; // Arcana
        }

        return accuracy;
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
