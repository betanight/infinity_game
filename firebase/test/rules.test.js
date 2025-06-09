const { assertFails, assertSucceeds } = require("@firebase/rules-unit-testing");
const {
  initializeTestEnvironment,
  RulesTestEnvironment,
} = require("@firebase/rules-unit-testing");
const { readFileSync } = require("fs");

let testEnv;

describe("Database Rules Tests", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "demo-" + Date.now(),
      database: {
        rules: readFileSync("firebase/rules.json", "utf8"),
        host: "localhost",
        port: 9001,
      },
    });
  });

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  beforeEach(async () => {
    await testEnv?.clearDatabase();
  });

  // Test Admin Access
  describe("Admin Access", () => {
    it("admin can read any character", async () => {
      const adminAuth = { uid: "admin", role: "ADMIN" };
      const adminDb = testEnv
        .authenticatedContext("admin", adminAuth)
        .database();

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.database();
        await db.ref("characters/char1").set({
          name: "Test Character",
          gameServer: "server1",
        });
      });

      // Test read access
      await assertSucceeds(adminDb.ref("characters/char1").once("value"));
    });

    it("admin can write to any character", async () => {
      const adminAuth = { uid: "admin", role: "ADMIN" };
      const adminDb = testEnv
        .authenticatedContext("admin", adminAuth)
        .database();

      await assertSucceeds(
        adminDb.ref("characters/newChar").set({
          name: "New Character",
          gameServer: "server1",
        })
      );
    });
  });

  // Test Game Master Access
  describe("Game Master Access", () => {
    it("GM can only read characters in their server", async () => {
      const gmAuth = {
        uid: "gm1",
        role: "GAME_MASTER",
        assignedServer: "server1",
      };
      const gmDb = testEnv.authenticatedContext("gm1", gmAuth).database();

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.database();
        await db.ref("characters/char1").set({
          name: "Server 1 Character",
          gameServer: "server1",
        });
        await db.ref("characters/char2").set({
          name: "Server 2 Character",
          gameServer: "server2",
        });
      });

      // Should succeed for their server
      await assertSucceeds(gmDb.ref("characters/char1").once("value"));
      // Should fail for other server
      await assertFails(gmDb.ref("characters/char2").once("value"));
    });
  });

  // Test Player Access
  describe("Player Access", () => {
    it("player can only read/write their own character", async () => {
      const playerAuth = { uid: "player1" };
      const playerDb = testEnv
        .authenticatedContext("player1", playerAuth)
        .database();

      // Set up test data
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.database();
        await db.ref("characters/player1").set({
          name: "Player 1 Character",
          gameServer: "server1",
        });
        await db.ref("characters/player2").set({
          name: "Player 2 Character",
          gameServer: "server1",
        });
      });

      // Should succeed for own character
      await assertSucceeds(playerDb.ref("characters/player1").once("value"));
      // Should fail for other player's character
      await assertFails(playerDb.ref("characters/player2").once("value"));
    });

    it("player can read equipment but not modify it", async () => {
      const playerAuth = { uid: "player1" };
      const playerDb = testEnv
        .authenticatedContext("player1", playerAuth)
        .database();

      // Should succeed for reading equipment
      await assertSucceeds(playerDb.ref("equipment").once("value"));
      // Should fail for writing equipment
      await assertFails(
        playerDb.ref("equipment").set({
          name: "New Equipment",
          gameServer: "server1",
        })
      );
    });
  });
});
