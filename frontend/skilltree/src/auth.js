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

// Optional: add this somewhere in your UI
const loginButton = document.createElement("button");
loginButton.textContent = "Sign in with Google";
loginButton.style.position = "fixed";
loginButton.style.top = "12px";
loginButton.style.right = "12px";
loginButton.style.padding = "10px 16px";
loginButton.style.borderRadius = "8px";
loginButton.style.background = "#0af";
loginButton.style.color = "white";
loginButton.style.border = "none";
loginButton.style.cursor = "pointer";
document.body.appendChild(loginButton);

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
  } else {
    console.log("🔒 Signed out");
  }
});
