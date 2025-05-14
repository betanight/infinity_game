import { insertSkill } from "../../../scripts/skilltree_functions.js";
import { MonkEquations } from "../../Willpower/equations/monk-functions.js";

export function defineMonkSkills(db) {
  insertSkill(db, "Willpower", "Ability", "Empowered Strike", {
    description:
      "Channel inner energy into your next unarmed attack. Increases damage and can stagger at high levels.",
    tier: "Monk",
    effective_value: 0,
    tags: ["melee", "buff", "willpower"],
    effect: ({ level }) => MonkEquations.empoweredStrike(level),
  });

  insertSkill(db, "Willpower", "Ability", "Ki Guard", {
    description:
      "Raise a brief field of force to reduce incoming damage. Scales with level and reacts to ranged or melee attacks.",
    tier: "Monk",
    effective_value: 0,
    tags: ["defense", "reaction", "willpower"],
    effect: ({ level }) => MonkEquations.kiGuard(level),
  });

  insertSkill(db, "Willpower", "Ability", "Stunning Palm", {
    description:
      "Target pressure points with an unarmed strike. At higher levels, has a chance to stun or stagger the target.",
    tier: "Monk",
    effective_value: 0,
    tags: ["melee", "control", "willpower"],
    effect: ({ level }) => MonkEquations.stunningPalm(level),
  });

  insertSkill(db, "Willpower", "Ability", "Flow Step", {
    description:
      "Enhance your movement speed for a short time and ignore opportunity attacks while moving.",
    tier: "Monk",
    effective_value: 0,
    tags: ["movement", "buff", "willpower"],
    effect: ({ level }) => MonkEquations.flowStep(level),
  });

  insertSkill(db, "Willpower", "Ability", "Meditative Healing", {
    description:
      "Focus your inner energy to heal yourself over a few turns. Healing amount increases with level.",
    tier: "Monk",
    effective_value: 0,
    tags: ["healing", "willpower"],
    effect: ({ level }) => MonkEquations.meditativeHealing(level),
  });

  insertSkill(db, "Willpower", "Ability", "Disruptive Pulse", {
    description:
      "Release a wave of negative ki to unbalance nearby enemies. Applies debuffs or knockback at higher levels.",
    tier: "Monk",
    effective_value: 0,
    tags: ["area", "debuff", "willpower", "negative-ki"],
    effect: ({ level }) => MonkEquations.disruptivePulse(level),
  });

  insertSkill(db, "Willpower", "Ability", "Rebounding Kick", {
    description:
      "Leap at a target and knock them back with a powerful kick. Gains bonus damage when used with Empowered Strike.",
    tier: "Monk",
    effective_value: 0,
    tags: ["melee", "knockback", "Ability", "movement", "willpower"],
    effect: ({ level }) => MonkEquations.reboundingKick(level),
  });

  insertSkill(db, "Willpower", "Ability", "Inner Focus", {
    description:
      "Temporarily sharpen reflexes and awareness. Increases evasion and initiative. Stacks with Flow Step.",
    tier: "Monk",
    effective_value: 0,
    tags: ["buff", "willpower", "focus"],
    effect: ({ level }) => MonkEquations.innerFocus(level),
  });

  insertSkill(db, "Willpower", "Ability", "Palm Echo", {
    description:
      "Strike a target and imprint a delayed ki echo. The target takes additional damage after a short delay.",
    tier: "Monk",
    effective_value: 0,
    tags: ["melee", "delayed", "willpower"],
    effect: ({ level }) => MonkEquations.palmEcho(level),
  });

  insertSkill(db, "Willpower", "Ability", "Ki Drain", {
    description:
      "On a successful unarmed hit, siphon stamina from the target and recover a portion yourself.",
    tier: "Monk",
    effective_value: 0,
    tags: ["melee", "drain", "negative-ki", "willpower"],
    effect: ({ level }) => MonkEquations.kiDrain(level),
  });

  // Passive Skills
  insertSkill(db, "Willpower", "Passive", "Iron Body", {
    description:
      "Your constitution is fortified by continuous training. Gain minor damage resistance and reduced fatigue buildup.",
    tier: "Monk",
    effective_value: 0,
    tags: ["passive", "constitution", "resistance", "willpower"],
    effect: ({ level }) => MonkEquations.ironBody(level),
  });

  insertSkill(db, "Willpower", "Passive", "Reflex Discipline", {
    description:
      "Your honed awareness enhances physical reflexes. Gain a permanent evasion bonus based on Willpower and Dexterity.",
    tier: "Monk",
    effective_value: 0,
    tags: ["passive", "dexterity", "evasion", "willpower"],
    effect: ({ level }) => MonkEquations.reflexDiscipline(level),
  });

  insertSkill(db, "Willpower", "Passive", "Unshakable Stance", {
    description:
      "Strength and focus combine to make you difficult to knock down or move. Improves stability and resistance to forced movement.",
    tier: "Monk",
    effective_value: 0,
    tags: ["passive", "strength", "control", "willpower"],
    effect: ({ level }) => MonkEquations.unshakableStance(level),
  });

  insertSkill(db, "Willpower", "Passive", "Mental Resilience", {
    description:
      "Wisdom reinforced by Willpower protects your mind. Reduces chance of being stunned, charmed, or disoriented.",
    tier: "Monk",
    effective_value: 0,
    tags: ["passive", "wisdom", "resistance", "willpower"],
    effect: ({ level }) => MonkEquations.mentalResilience(level),
  });

  insertSkill(db, "Willpower", "Passive", "Spiritual Pulse", {
    description:
      "You emit a constant ripple of internal energy. Slightly enhances all physical core stats when Willpower is high.",
    tier: "Monk",
    effective_value: 0,
    tags: ["passive", "scaling", "willpower", "core"],
    effect: ({ level }) => MonkEquations.spiritualPulse(level),
  });

  insertSkill(db, "Willpower", "Passive", "Discipline of Motion", {
    description:
      "Your training improves physical performance over time. Movement speed and reaction time improve slightly each level.",
    tier: "Monk",
    effective_value: 0,
    tags: ["passive", "speed", "dexterity", "willpower"],
    effect: ({ level }) => MonkEquations.disciplineOfMotion(level),
  });
}
