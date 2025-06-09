import { insertSkill } from "../../../scripts/skilltree_functions.js";
import { youngEquations } from "../equations/young-functions.js";

export function defineSpiritSkills(db) {
  insertSkill(db, "Spirit", "Spectre", "Soul Channel", {
    description:
      "Channel a fragment of divine or natural power to enhance healing or damage based on intent.",
    tier: "young",
    effective_value: 0,
    tags: ["buff", "healing", "drain"],
    effect: ({ level }) => youngEquations.soulChannel(level),
  });

  insertSkill(db, "Spirit", "Guardian", "Ancestral Warning", {
    description:
      "Gain passive insight that helps you avoid ambushes, granting bonus evasion or initiative.",
    tier: "young",
    effective_value: 0,
    tags: ["Utility", "foresight"],
    effect: ({ level }) => youngEquations.ancestralWarning(level),
  });

  insertSkill(db, "Spirit", "Hex Warrior", "Wither Grasp", {
    description:
      "Tap a creature's life essence to deal minor damage and reduce their vitality for a short duration.",
    tier: "young",
    effective_value: 0,
    tags: ["debuff", "soul", "drain"],
    effect: ({ level }) => youngEquations.witherGrasp(level),
  });

  insertSkill(db, "Spirit", "Spectre", "Eclipse Veil", {
    description:
      "Shroud yourself in ghostly energy, gaining partial invisibility in darkness or while still.",
    tier: "young",
    effective_value: 0,
    tags: ["disguise", "stealth"],
    effect: ({ level }) => youngEquations.eclipseVeil(level),
  });

  insertSkill(db, "Spirit", "Spectre", "Spirit Lash", {
    description:
      "Strike with spectral force; deals damage that partially ignores physical armor.",
    tier: "young",
    effective_value: 0,
    tags: ["reach", "melee", "spectral"],
    effect: ({ level }) => youngEquations.spiritLash(level),
  });

  insertSkill(db, "Spirit", "Guardian", "Guiding Light", {
    description:
      "Illuminate an allys path — they gain increased accuracy or resistance to fear effects.",
    tier: "young",
    effective_value: 0,
    tags: ["buff", "accuracy", "support"],
    effect: ({ level }) => youngEquations.guidingLight(level),
  });

  insertSkill(db, "Spirit", "Hex Warrior", "Hex Brand", {
    description:
      "Place a spiritual brand on a target; their resistances are lowered for a short time.",
    tier: "young",
    effective_value: 0,
    tags: ["debuff", "hexed", "hunted"],
    effect: ({ level }) => youngEquations.hexBrand(level),
  });

  insertSkill(db, "Spirit", "Spectre", "Last Breath", {
    description:
      "If reduced to 0 HP once day, you can stand back up with 1 HP by sacrificing a point in spirit",
    tier: "young",
    effective_value: 0,
    tags: ["sacrifice", "resurrection", "soul"],
    effect: ({ level }) => youngEquations.lastBreath(level),
  });

  insertSkill(db, "Spirit", "Hex Warrior", "Mark of Death", {
    description:
      "Mark a creature for death, increasing damage dealt to targeted creature",
    tier: "young",
    effective_value: 0,
    tags: ["mark", "hunted", "hexed"],
    effect: ({ level }) => youngEquations.markDeath(level),
  });

  insertSkill(db, "Spirit", "Guardian", "Feral Form", {
    description:
      "Go into a fit of rage, temporarily increasing strength and constitution, but lose some intelligence.",
    tier: "young",
    effective_value: 0,
    tags: ["sacrifice", "resurrection", "soul"],
    effect: ({ level }) => youngEquations.feralForm(level),
  });

  insertSkill(db, "Spirit", "Spectre", "Armor of Spectre", {
    description:
      "Your body starts leaving less and less of your physical form, and more of your soul, reducing physical damage",
    tier: "young",
    effective_value: 0,
    tags: ["sacrifice", "resurrection", "soul"],
    effect: ({ level }) => youngEquations.armorSpectre(level),
  });
}
