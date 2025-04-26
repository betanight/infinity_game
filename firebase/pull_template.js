const { db } = require("./firebase"); // ✅ Connect to Firebase
const fs = require("fs");

async function pullTemplate() {
  try {
    const snapshot = await db.ref("template").once("value");
    const templateData = snapshot.val();

    if (!templateData) {
      console.error("❌ No template found in Firebase.");
      return;
    }

    // Save it locally
    fs.writeFileSync("template_downloaded.json", JSON.stringify(templateData, null, 2));
    console.log("✅ Template pulled and saved to template_downloaded.json");
  } catch (error) {
    console.error("❌ Error pulling template:", error);
  }
}

pullTemplate();