// Strength skill tree tiers and dependencies - using rank-based progression
export const strengthSkills = {
  "Tier 1": {
    // Available at start
    "Grip Strength": {
      description:
        "Hold and carry heavy objects with powerful hand and forearm muscles.",
      prerequisites: [],
      boost: ["damage:raw"],
      effective_value: 0,
    },
    "Muscle Control": {
      description:
        "Fine-tune muscle activation for precise strength application.",
      prerequisites: [{ skill: "Grip Strength", minLevel: 3 }],
      boost: ["melee:accuracy"],
      effective_value: 0,
    },
    "Bodyweight Force": {
      description:
        "Utilize your own body weight to maximize pushing or pulling power.",
      prerequisites: [{ skill: "Muscle Control", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
    "Core Foundation": {
      description:
        "Develop core stability for improved power transfer and balance.",
      prerequisites: [{ skill: "Bodyweight Force", minLevel: 3 }],
      boost: ["armor:heavy", "melee:accuracy"],
      effective_value: 0,
    },
    "Fist Conditioning": {
      description:
        "Condition your fists to withstand impact and deliver more powerful strikes.",
      prerequisites: [{ skill: "Core Foundation", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
  },
  "Tier 2": {
    // Rank E required
    "Brute Force": {
      description: "Apply overwhelming strength to break through obstacles.",
      prerequisites: [
        { skill: "Fist Conditioning", minLevel: 3, requiredRank: "E" },
      ],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
    "Power Transfer": {
      description:
        "Channel strength from your core through your limbs for maximum impact.",
      prerequisites: [{ skill: "Brute Force", minLevel: 3 }],
      boost: ["damage:raw"],
      effective_value: 0,
    },
    "Heavy Endurance": {
      description: "Carry heavy loads or wear heavy armor without fatigue.",
      prerequisites: [{ skill: "Power Transfer", minLevel: 3 }],
      boost: ["armor:heavy"],
      effective_value: 0,
    },
    "Ground Force": {
      description:
        "Generate power from the ground up through proper stance and leverage.",
      prerequisites: [{ skill: "Heavy Endurance", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
    "Impact Resistance": {
      description: "Withstand physical impacts with minimal damage.",
      prerequisites: [{ skill: "Ground Force", minLevel: 3 }],
      boost: ["armor:heavy"],
      effective_value: 0,
    },
  },
  "Tier 3": {
    // Rank D required
    "Anchor Stance": {
      description:
        "Plant yourself solidly to resist being pushed or knocked down.",
      prerequisites: [
        { skill: "Impact Resistance", minLevel: 3, requiredRank: "D" },
      ],
      boost: ["armor:heavy"],
      effective_value: 0,
    },
    "Force Amplification": {
      description:
        "Multiply your striking power through perfect body mechanics.",
      prerequisites: [{ skill: "Anchor Stance", minLevel: 3 }],
      boost: ["damage:raw"],
      effective_value: 0,
    },
    Grappling: {
      description:
        "Engage in hand-to-hand combat focusing on holds, throws, and immobilization.",
      prerequisites: [{ skill: "Force Amplification", minLevel: 3 }],
      boost: ["melee:accuracy"],
      effective_value: 0,
    },
    "Crushing Grip": {
      description:
        "Apply devastating pressure with your enhanced grip strength.",
      prerequisites: [{ skill: "Grappling", minLevel: 3 }],
      boost: ["damage:raw"],
      effective_value: 0,
    },
  },
  "Tier 4": {
    // Rank B required
    Climb: {
      description:
        "Ascend difficult surfaces using sheer physical force and endurance.",
      prerequisites: [
        { skill: "Crushing Grip", minLevel: 3, requiredRank: "B" },
      ],
      boost: ["Skill: Climb"],
      effective_value: 0,
    },
    "Seismic Impact": {
      description: "Strike with such force that it creates minor tremors.",
      prerequisites: [{ skill: "Climb", minLevel: 3 }],
      boost: ["damage:raw"],
      effective_value: 0,
    },
    Charge: {
      description: "Dash with great momentum to knock over foes or barriers.",
      prerequisites: [{ skill: "Seismic Impact", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
    "Titan's Might": {
      description: "Channel raw strength into devastating attacks.",
      prerequisites: [{ skill: "Charge", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
  },
  "Tier 5": {
    // Rank A required
    "Mountain's Strength": {
      description: "Become an immovable object and an unstoppable force.",
      prerequisites: [
        { skill: "Titan's Might", minLevel: 3, requiredRank: "A" },
      ],
      boost: ["damage:raw", "armor:heavy"],
      effective_value: 0,
    },
    "Earth Shaker": {
      description:
        "Your powerful strikes can create shockwaves through the ground.",
      prerequisites: [{ skill: "Mountain's Strength", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy"],
      effective_value: 0,
    },
    "Colossal Might": {
      description:
        "The pinnacle of physical strength, capable of legendary feats.",
      prerequisites: [{ skill: "Earth Shaker", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy", "armor:heavy"],
      effective_value: 0,
    },
  },
  "Final Tier": {
    // Rank S required
    "Titan's Legacy": {
      description:
        "Your strength reaches mythical proportions, inspiring legends.",
      prerequisites: [
        { skill: "Colossal Might", minLevel: 3, requiredRank: "S" },
      ],
      boost: ["damage:raw", "melee:accuracy", "armor:heavy"],
      effective_value: 0,
    },
    "World Breaker": {
      description: "Your strikes can reshape the battlefield itself.",
      prerequisites: [{ skill: "Titan's Legacy", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy", "armor:heavy"],
      effective_value: 0,
    },
    "Strength Incarnate": {
      description: "You become a living embodiment of pure physical might.",
      prerequisites: [{ skill: "World Breaker", minLevel: 3 }],
      boost: ["damage:raw", "melee:accuracy", "armor:heavy"],
      effective_value: 0,
    },
  },
};
