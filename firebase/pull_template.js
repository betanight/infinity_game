const { db } = require("./firebase");
const fs = require("fs");
const path = require("path");

async function pullTemplate() {
  try {
    const snapshot = await db.ref("template").once("value");
    const templateData = snapshot.val();

    if (!templateData) {
      console.error("❌ No template found in Firebase.");
      return;
    }

    // Make sure the logs folder exists
    const logsDir = path.join(__dirname, "..", "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    // Get month and day
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const filename = `template_${month}-${day}.json`;
    const outputPath = path.join(logsDir, filename);

    // Save into logs folder
    fs.writeFileSync(outputPath, JSON.stringify(templateData, null, 2));

    console.log(`✅ Template pulled and saved to ${outputPath}`);
  } catch (error) {
    console.error("❌ Error pulling template:", error);
  }
}

pullTemplate();
