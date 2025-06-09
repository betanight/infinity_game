import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2V2EUMC8YdoDeNEB2btla_NJLQ5bPWv0",
  authDomain: "infinity-e0f55.firebaseapp.com",
  databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
  projectId: "infinity-e0f55",
  storageBucket: "infinity-e0f55.appspot.com",
  messagingSenderId: "120929977477",
  appId: "1:120929977477:web:45dc9989f834f69a9195ec",
  measurementId: "G-PFFQDN2MHX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Configure auth to handle COOP warnings
auth.settings = {
  appVerificationDisabledForTesting: false, // Enable proper popup handling
};

// Helper function to check if user is admin
export const isUserAdmin = async (user) => {
  if (!user?.uid) return false;
  try {
    const adminSnapshot = await get(ref(db, `admins/${user.uid}`));
    return adminSnapshot.val() === true;
  } catch (err) {
    console.error("Error checking admin status:", err);
    return false;
  }
};

// Add auth state logging
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const isAdmin = await isUserAdmin(user);
    console.log("Auth State Changed - User logged in:", {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAdmin,
    });
  } else {
    console.log("Auth State Changed - User logged out");
  }
});

export { db, auth, app };
