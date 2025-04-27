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

    energyAttackAccuracy: function (scores, skills) {
        let accuracy = 0;

        accuracy += (scores[coreAbbreviations.I] || 0) * 2; // Intelligence bonus
        accuracy += (scores[coreAbbreviations.W] || 0) * 2; // Wisdom bonus
        accuracy += (scores[coreAbbreviations.SP] || 0) * 2; // Spirit bonus
        accuracy += (scores[coreAbbreviations.WP] || 0) * 2; // Willpower bonus

        // Intelligence-based magical skills
        accuracy += (skills.arc || 0) * 2; // Arcana
        accuracy += (skills.mt || 0) * 2; // Magical Theory
        accuracy += (skills.sf || 0) * 2; // Strategic Foresight
        accuracy += (skills.tp || 0) * 2; // Tactical Planning
        accuracy += (skills.ok || 0) * 2; // Arcana

        // Wisdom-based sensing skills
        accuracy += (skills.sa || 0) * 2; // Situational Awareness
        accuracy += (skills.ins || 0) * 1; // Insight

        // Spirit-based control skills
        accuracy += (skills.ef || 0) * 2; // Energy Flow
        accuracy += (skills.rm || 0) * 2; // Ritual Mastery
        accuracy += (skills.sc || 0) * 1; // Spirit Communication

        // Willpower-based focus skills
        accuracy += (skills.sd || 0) * 2; // Sheer Determination
        accuracy += (skills.sf || 0) * 2; // Steadfast Focus

        return accuracy;
    },

    meleeDamage: function (scores, skills) {
        let damage = (scores[coreAbbreviations.S] || 0) * 2;

        damage += (skills.wpn || 0) * 3; // Weapon Mastery
        damage += (skills.bf || 0) * 2;  // Brute Force
        damage += (skills.bwf || 0) * 2; // Bodyweight Force
        damage += (skills.chg || 0) * 2; // Charge
        damage += (skills.gp || 0) * 1;  // Grappling
        damage += (skills.he || 0) * 1;  // Heavy Endurance
        damage += (skills.lf || 0) * 1;  // Lifting Form

        damage += (skills.bp || 0) * 2;  // Blade Precision
        damage += (skills.vp || 0) * 2;  // Vital Point Targeting
        damage += (skills.wf || 0) * 2;  // Weapon Finesse
        damage += (skills.cd || 0) * 2;  // Critical Damage
        damage += (skills.cc || 0) * 1;  // Critical Chance

        damage += (skills.tp || 0) * 2;  // Tactical Planning
        damage += (skills.sf || 0) * 2;  // Strategic Foresight
        damage += (skills.inv || 0) * 1; // Investigation

        damage += (skills.sa || 0) * 2;  // Situational Awareness
        damage += (skills.ins || 0) * 1; // Insight
        damage += (skills.ol || 0) * 1;  // Observation Logging

        damage += (skills.ic || 0) * 2;  // Inspire Courage
        damage += (skills.lead || 0) * 1; // Leadership
        damage += (skills.ps || 0) * 1;  // Public Speaking
        damage += (skills.rr || 0) * 1;  // Read the Room

        damage += (skills.ds || 0) * 2;  // Danger Sense
        damage += (skills.sr5 || 0) * 2; // Spatial Reflexes
        damage += (skills.hd || 0) * 2;  // Hunting Drive
        damage += (skills.pa || 0) * 1;  // Pack Awareness

        damage += (skills.pm2 || 0) * 1; // Presence Manifestation
        damage += (skills.fa || 0) * 1;  // Fear Aura
        damage += (skills.sg || 0) * 1;  // Social Gravity

        return damage;
    }

};

module.exports = visibleStatEquations;
