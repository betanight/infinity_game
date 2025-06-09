// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock Firebase
jest.mock("./__mocks__/firebase", () => ({
  db: {
    ref: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue({
      exists: () => true,
      val: () => ({
        meta: {
          character_id: "test-character-1",
          level: 1,
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
      }),
    }),
  },
}));
