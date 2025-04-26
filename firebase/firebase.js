const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "..", "credentials", "firebaseKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase credentials not found at " + serviceAccountPath);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Save a new character (template)
function saveCharacter(name, data) {
  const ref = db.ref("characters").child(name.toLowerCase());
  return ref.set(data);
}

// Get character data
function getCharacter(name) {
  const ref = db.ref("characters").child(name.toLowerCase());
  return ref.once("value").then(snapshot => snapshot.val());
}

// Update a character's skill value
function updateSkill(name, statType, skillName, newValue) {
  const ref = db.ref(`characters/${name.toLowerCase()}/skills/${statType}/${skillName}`);
  return ref.set(newValue);
}

module.exports = {
  saveCharacter,
  getCharacter,
  updateSkill
};