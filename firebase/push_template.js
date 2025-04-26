const admin = require("firebase-admin");
const serviceAccount = require("../credentials/firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
});

const db = admin.database();

const template = {
  template: {
    level: 0,
    primary_scores: {
      Strength: 0,
      Dexterity: 0,
      Constitution: 0,
      Intelligence: 0,
      Wisdom: 0,
      Charisma: 0,
    },
    secondary_scores: {
      Willpower: 0,
      Spirit: 0,
      Instinct: 0,
      Presence: 0,
    },
    skills: {
      strength_skills: {},
      dexterity_skills: {},
      constitution_skills: {},
      intelligence_skills: {},
      wisdom_skills: {},
      charisma_skills: {},
      willpower_skills: {},
      spirit_skills: {},
      instinct_skills: {},
      presence_skills: {},
    },
  },
};

db.ref().set(template, (err) => {
  if (err) {
    console.error("❌ Failed to push template:", err);
  } else {
    console.log("✅ Template schema uploaded to Firebase.");
    process.exit();
  }
});
