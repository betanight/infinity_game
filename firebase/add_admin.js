const { db } = require("./firebase");

async function addAdmin(uid) {
  if (!uid) {
    console.error("❌ Please provide a user UID");
    console.log("Usage: node add_admin.js <uid>");
    process.exit(1);
  }

  try {
    // Add user to admins node with boolean value
    const adminRef = db.ref("admins");
    await adminRef.child(uid).set(true);
    
    console.log(`✅ Successfully added user ${uid} to admin list`);
  } catch (error) {
    console.error("❌ Error adding admin:", error.message);
    process.exit(1);
  }
}

// Get UID from command line arguments
const uid = process.argv[2];
addAdmin(uid); 