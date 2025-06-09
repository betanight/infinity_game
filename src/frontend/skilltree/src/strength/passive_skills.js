// Passive strength skills organized in tiers
export const strengthPassiveSkills = {
  "Tier 1": {
    "Physical Conditioning": {
      description:
        "Basic physical training enhances your body's natural capabilities.",
      prerequisites: [],
      boost: ["health:minor", "damage:minor", "armor:minor"],
      passive: true,
      effective_value: 0,
    },
  },
  "Tier 2": {
    "Hardened Body": {
      description:
        "Your body has adapted to physical stress, becoming naturally tougher.",
      prerequisites: [
        { skill: "Physical Conditioning", minLevel: 3, requiredRank: "E" },
      ],
      boost: ["health:moderate", "damage:moderate", "armor:moderate"],
      passive: true,
      effective_value: 0,
    },
  },
  "Tier 3": {
    "Warrior's Constitution": {
      description:
        "Combat experience has forged your body into a natural weapon.",
      prerequisites: [
        { skill: "Hardened Body", minLevel: 3, requiredRank: "D" },
      ],
      boost: ["health:significant", "damage:significant", "armor:significant"],
      passive: true,
      effective_value: 0,
    },
  },
  "Tier 4": {
    "Titan's Blood": {
      description:
        "Your body exhibits supernatural levels of strength and resilience.",
      prerequisites: [
        { skill: "Warrior's Constitution", minLevel: 3, requiredRank: "B" },
      ],
      boost: ["health:major", "damage:major", "armor:major"],
      passive: true,
      effective_value: 0,
    },
  },
  "Tier 5": {
    "Giant's Might": {
      description: "Your mere presence exudes overwhelming physical power.",
      prerequisites: [
        { skill: "Titan's Blood", minLevel: 3, requiredRank: "A" },
      ],
      boost: ["health:massive", "damage:massive", "armor:massive"],
      passive: true,
      effective_value: 0,
    },
  },
  "Final Tier": {
    "Legendary Physique": {
      description: "Your body has transcended normal physical limitations.",
      prerequisites: [
        { skill: "Giant's Might", minLevel: 3, requiredRank: "S" },
      ],
      boost: ["health:legendary", "damage:legendary", "armor:legendary"],
      passive: true,
      effective_value: 0,
    },
  },
};
