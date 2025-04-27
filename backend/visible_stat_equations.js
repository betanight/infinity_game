const { coreAbbreviations, skillAbbreviations } = require("./abbreviations");

const visibleStatEquations = {

    dexterityAccuracy: function (scores, skills) {
        let accuracy = (scores[coreAbbreviations.D] || 0);

        accuracy += (scores[coreAbbreviations.D] || 0) * 2;
        accuracy += (skills.bp || 0) * 2;
        accuracy += (skills.as2 || 0) * 2;
        accuracy += (skills.pt || 0) * 2;
        accuracy += (skills.vp || 0) * 2;
        accuracy += (skills.ra || 0) * 1;
        accuracy += (skills.ac || 0) * 1;
        accuracy += (skills.ev || 0) * 1;
        accuracy += (skills.wf || 0) * 2;
        accuracy += (skills.td || 0) * 2;
        accuracy += (skills.qc || 0) * 1;

        return accuracy;
    },

    strengthAccuracy: function (scores, skills) {
        let accuracy = (scores[coreAbbreviations.S] || 0);

        accuracy += (skills.wpn || 0) * 3;
        accuracy += (skills.chg || 0) * 2;

        return accuracy;
    },

    intelligenceAccuracy: function (scores, skills) {
        let accuracy = (scores[coreAbbreviations.I] || 0);

        accuracy += (skills.tp || 0) * 2;
        accuracy += (skills.sf || 0) * 2;

        return accuracy;
    },

    wisdomAccuracy: function (scores, skills) {
        let accuracy = (scores[coreAbbreviations.W] || 0);

        accuracy += (skills.sa || 0) * 2;
        accuracy += (skills.ins || 0) * 1;
        accuracy += (skills.ol || 0) * 1;

        return accuracy;
    },

    charismaAccuracy: function (scores, skills) {
        let accuracy = (scores[coreAbbreviations.Ch] || 0);

        accuracy += (skills.lead || 0) * 1;

        return accuracy;
    },

    totalAttackAccuracy: function (scores, skills) {
        let total = 0;

        total += visibleStatEquations.dexterityAccuracy(scores, skills);
        total += visibleStatEquations.strengthAccuracy(scores, skills);
        total += visibleStatEquations.intelligenceAccuracy(scores, skills);
        total += visibleStatEquations.wisdomAccuracy(scores, skills);
        total += visibleStatEquations.charismaAccuracy(scores, skills);

        return total;
    }

};

module.exports = visibleStatEquations;
