const { coreAbbreviations, skillAbbreviations } = require("./abbreviations");

const visibleStatEquations = {

  dexterityAccuracy: function(scores, skills) {
    let accuracy = (scores.D || 0);

    accuracy += (scores.D || 0) * 2;
    accuracy += (skills.bp || 0) * 2;
    accuracy += (skills.as || 0) * 2;
    accuracy += (skills.pt || 0) * 2;
    accuracy += (skills.vp || 0) * 2;
    accuracy += (skills.ra || 0) * 1;
    accuracy += (skills.ac || 0) * 1;
    accuracy += (skills.ev || 0) * 1;
    accuracy += (skills.wd || 0) * 2;
    accuracy += (skills.td || 0) * 2;
    accuracy += (skills.qc || 0) * 1;

    return accuracy;
  },

  strengthAccuracy: function(scores, skills) {
    let accuracy = 0;

    accuracy += (scores.S || 0) * 1;
    accuracy += (skills.wpn || 0) * 3;
    accuracy += (skills.chg || 0) * 2;

    return accuracy;
  },

  intelligenceAccuracy: function(scores, skills) {
    let accuracy = 0;

    accuracy += (scores.I || 0) * 1;
    accuracy += (skills.tp || 0) * 2;
    accuracy += (skills.sf || 0) * 2;

    return accuracy;
  },

  wisdomAccuracy: function(scores, skills) {
    let accuracy = 0;

    accuracy += (scores.W || 0) * 1;
    accuracy += (skills.sa || 0) * 2;
    accuracy += (skills.ins || 0) * 1;
    accuracy += (skills.ol || 0) * 1;

    return accuracy;
  },

  charismaAccuracy: function(scores, skills) {
    let accuracy = 0;

    accuracy += (scores.Ch || 0) * 1;
    accuracy += (skills.lead || 0) * 1;

    return accuracy;
  }

};

module.exports = visibleStatEquations;
