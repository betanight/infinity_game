const { db } = require("./firebase");

async function listAdmins() {
  try {
    const adminRef = db.ref("admins");
    const snapshot = await adminRef.once("value");
    const admins = snapshot.val();

    if (!admins) {
      console.log("No admin users found");
      return;
    }

    console.log("\nCurrent Admin Users:");
    console.log("-------------------");
    Object.entries(admins).forEach(([uid, isAdmin]) => {
      if (isAdmin === true) {
        console.log(`UID: ${uid}`);
        console.log("-------------------");
      }
    });
  } catch (error) {
    console.error("❌ Error listing admins:", error.message);
    process.exit(1);
  }
}

listAdmins(); 