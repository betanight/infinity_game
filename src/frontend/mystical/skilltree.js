import { renderSkillTree } from "../skilltree/src/dag.js";
import { getCharacterData } from "../skilltree/levelUp/levelingFunctions.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Get character ID from URL params
const params = new URLSearchParams(window.location.search);
const characterId = params.get("char");

if (!characterId) {
  document.body.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <h2>No Character Selected</h2>
      <p>Please select a character to view their skill tree.</p>
      <a href="/" style="color: #0af;">Return to Dashboard</a>
    </div>
  `;
} else {
  // Wait for auth state before loading character
  onAuthStateChanged(getAuth(), async (user) => {
    if (user) {
      try {
        const characterData = await getCharacterData(characterId);
        renderSkillTree(characterData);
      } catch (error) {
        console.error("Error loading character data:", error);
        document.body.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <h2>Error Loading Character</h2>
            <p>There was an error loading the character data. Please try again.</p>
            <a href="/" style="color: #0af;">Return to Dashboard</a>
          </div>
        `;
      }
    } else {
      document.body.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h2>Please Sign In</h2>
          <p>You need to be signed in to view this page.</p>
          <a href="/" style="color: #0af;">Return to Dashboard</a>
        </div>
      `;
    }
  });
}
