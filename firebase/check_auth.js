const { db } = require("./firebase");

async function checkAuth(uid) {
  if (!uid) {
    console.error("❌ Please provide a user UID");
    console.log("Usage: node check_auth.js <uid>");
    process.exit(1);
  }

  try {
    // Check if user is in admins list
    const adminRef = db.ref("admins");
    const adminSnapshot = await adminRef.child(uid).once("value");
    const isAdmin = adminSnapshot.val();

    console.log("\nAuth Check Results:");
    console.log("-------------------");
    console.log(`UID: ${uid}`);
    console.log(`Is Admin: ${isAdmin === true ? "Yes" : "No"}`);
    console.log(`Special UID Match: ${uid === 'ch1yWOwbx7h2QUXQsSjj0pqVw8d2' ? "Yes" : "No"}`);
    
    // Check if user can write to a test path
    const testRef = db.ref("characters/monk/Equipment/Armor/test");
    try {
      await testRef.set({ test: true });
      console.log("Write Test: Success");
      // Clean up test data
      await testRef.remove();
    } catch (error) {
      console.log("Write Test: Failed");
      console.log(`Error: ${error.message}`);
    }

  } catch (error) {
    console.error("❌ Error checking auth:", error.message);
    process.exit(1);
  }
}

// Get UID from command line arguments
const uid = process.argv[2];
checkAuth(uid); 