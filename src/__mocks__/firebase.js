// Mock Firebase implementation
const mockCharacterData = {
  meta: {
    character_id: "test-character-1",
    level: 1,
    available_skill_points: 10,
  },
  primary_scores: {
    Strength: 1,
    Dexterity: 1,
    Constitution: 1,
    Intelligence: 1,
    Wisdom: 1,
    Charisma: 1,
  },
  secondary_scores: {
    Willpower: 0,
    Spirit: 0,
    Arcane: 0,
    Presence: 0,
  },
  skills: {
    Strength: {
      "Anchor Stance": {
        description:
          "Plant yourself solidly to resist being pushed or knocked down.",
        boost: ["armor:heavy"],
        effective_value: 0,
      },
      "Grip Strength": {
        description:
          "Hold and carry heavy objects with powerful hand and forearm muscles.",
        boost: ["damage:raw"],
        effective_value: 0,
      },
    },
  },
};

const mockRef = jest.fn(() => ({
  get: jest.fn().mockResolvedValue({
    exists: () => true,
    val: () => mockCharacterData,
  }),
  set: jest.fn().mockResolvedValue(true),
}));

export const db = {
  ref: mockRef,
  get: jest.fn().mockResolvedValue({
    exists: () => true,
    val: () => mockCharacterData,
  }),
  set: jest.fn().mockResolvedValue(true),
};

export const mockCharacterRef = mockRef;
