import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js"; // update path if needed

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Create and style the login button
const loginButton = document.createElement("button");
loginButton.textContent = "Sign in with Google";
loginButton.id = "google-signin";
loginButton.style.padding = "10px 16px";
loginButton.style.borderRadius = "8px";
loginButton.style.background = "#0af";
loginButton.style.color = "white";
loginButton.style.border = "none";
loginButton.style.cursor = "pointer";

// Add the button to the header-right container
const headerRight = document.querySelector('.header-right');
if (headerRight) {
  headerRight.appendChild(loginButton);
} else {
  console.error('Could not find header-right container');
}

loginButton.onclick = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("✅ Logged in as:", user.email);
      console.log("🆔 Your UID:", user.uid);

      alert(`Signed in as ${user.email}\nUID: ${user.uid}`);
    })
    .catch((error) => {
      console.error("❌ Login error:", error);
      alert("Login failed.");
    });
};

// Keep track of signed-in user
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("👤 Signed in:", user.email, "→ UID:", user.uid);
    loginButton.style.display = 'none';
  } else {
    console.log("🔒 Signed out");
    loginButton.style.display = 'block';
  }
});
