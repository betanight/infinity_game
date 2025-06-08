const jwt = require("jsonwebtoken");
const fs = require("fs");
import("node-fetch").then(({ default: fetch }) => {
  // Read the service account file
  const serviceAccount = require("./credentials/firebaseKey.json");

  // Create a JWT token
  const createToken = async () => {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600, // Token expires in 1 hour
      scope:
        "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
    };

    const token = jwt.sign(payload, serviceAccount.private_key, {
      algorithm: "RS256",
    });

    // Now get an access token
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: token,
      }),
    };

    try {
      const response = await fetch(
        "https://oauth2.googleapis.com/token",
        options
      );
      const data = await response.json();
      console.log(data.access_token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  createToken();
});
