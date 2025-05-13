import { insertSkill } from "../../../scripts/skilltree_functions.js";
import { RankOneEquations } from "../../Presence/equations/rank_1_functions.js";

export function defineRankOneSkills(db) {
  // Champion → self + ally aura buffs
  // Behemoth → physical and disruptive force, personal enhancements

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Fortitude", {
    description:
      "Allies within range gain a minor boost to Constitution and resistance to poison.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "buff", "champion"],
    effect: ({ level }) => RankOneEquations.auraFortitude(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Pulverize", {
    description:
      "Unleash a brutal strike that reduces the target's armor and shakes nearby ground.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["strike", "impact", "behemoth"],
    effect: ({ level }) => RankOneEquations.pulverize(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Clarity", {
    description:
      "Sharpen the minds of nearby allies, increasing initiative and focus.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "focus", "champion"],
    effect: ({ level }) => RankOneEquations.auraClarity(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Titan's Slam", {
    description: "Slam the ground and knock nearby enemies off balance.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["area", "control", "behemoth"],
    effect: ({ level }) => RankOneEquations.titanSlam(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Endurance", {
    description:
      "Grants minor fire and cold resistance to yourself and allies within range.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "resistance", "champion"],
    effect: ({ level }) => RankOneEquations.auraEndurance(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Stormborn Wrath", {
    description:
      "While raging, electrify your body and deal minor lightning damage on attacks.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["rage", "lightning", "behemoth"],
    effect: ({ level }) => RankOneEquations.stormbornWrath(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Protection", {
    description:
      "Nearby allies gain a slight bonus to physical armor while within range.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "defense", "champion"],
    effect: ({ level }) => RankOneEquations.auraProtection(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Seismic Guard", {
    description:
      "While standing still, gain resistance to knockback and increased physical defense.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["stance", "defense", "behemoth"],
    effect: ({ level }) => RankOneEquations.seismicGuard(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Presence", {
    description:
      "Strengthen your own body and resolve. You gain bonus Strength while active.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "self", "champion"],
    effect: ({ level }) => RankOneEquations.auraPresence(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Echoing Stride", {
    description: "As you move, you slow nearby enemies with each heavy step.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["movement", "debuff", "behemoth"],
    effect: ({ level }) => RankOneEquations.echoingStride(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Balance", {
    description:
      "Reduce magical and elemental damage you take while standing firm.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "resistance", "champion"],
    effect: ({ level }) => RankOneEquations.auraBalance(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Bonebreaker Grip", {
    description:
      "Grab a target and apply crushing force, reducing their attack damage.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["grapple", "debuff", "behemoth"],
    effect: ({ level }) => RankOneEquations.bonebreakerGrip(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Inspiration", {
    description:
      "Allies within range gain slight bonus to skill checks and saving throws.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "support", "champion"],
    effect: ({ level }) => RankOneEquations.auraInspiration(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Earthen Roar", {
    description:
      "Let out a guttural roar that slows enemies and breaks fragile ground nearby.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["shout", "control", "behemoth"],
    effect: ({ level }) => RankOneEquations.earthenRoar(level),
  });

  insertSkill(db, "Presence", "Champion-Passive", "Aura of Sanctuary", {
    description: "Enemies nearby have a harder time targeting wounded allies.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["aura", "protection", "champion"],
    effect: ({ level }) => RankOneEquations.auraSanctuary(level),
  });

  insertSkill(db, "Presence", "Behemoth", "Unstoppable Surge", {
    description:
      "Charge forward, becoming immune to crowd control for a short burst.",
    tier: "rank_1",
    effective_value: 0,
    tags: ["movement", "rage", "behemoth"],
    effect: ({ level }) => RankOneEquations.unstoppableSurge(level),
  });
}
