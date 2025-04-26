// Firebase initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "infinity-e0f55.firebaseapp.com",
    databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
    projectId: "infinity-e0f55",
    storageBucket: "infinity-e0f55.appspot.com",
    messagingSenderId: "120929977477",
    appId: "1:120929977477:web:45dc9989f834f69a9195ec",
    measurementId: "G-PFFQDN2MHX"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Load template for preview
  function loadTemplate() {
    db.ref("template").once("value").then(snapshot => {
      document.getElementById("template-output").textContent = JSON.stringify(snapshot.val(), null, 2);
    });
  }
  
  // Load characters into the sidebar
  function loadCharacters() {
    db.ref("characters").once("value").then(snapshot => {
      const characters = snapshot.val();
      const list = document.getElementById("character-list");
      list.innerHTML = "";
  
      if (!characters) {
        list.innerHTML = "<li>No characters found.</li>";
        return;
      }
  
      Object.entries(characters).forEach(([name, data]) => {
        const li = document.createElement("li");
        li.textContent = name;
        li.style.cursor = "pointer";
  
        // Expand/collapse skills
        li.addEventListener("click", () => {
          const existing = li.querySelector("ul");
          if (existing) {
            existing.remove();
          } else {
            const skills = data.skills || {};
            const skillList = document.createElement("ul");
  
            const stats = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
            stats.forEach(stat => {
              const skillGroup = skills[stat]?.skills || {};
              const found = Object.entries(skillGroup).find(([, info]) => info.effective_value > 0);
              const chosen = found ? `${found[0]} (Level ${found[1].effective_value})` : "empty";
  
              const skillLine = document.createElement("li");
              skillLine.className = "skill-detail";
              skillLine.textContent = `${stat}: ${chosen}`;
              skillList.appendChild(skillLine);
            });
  
            li.appendChild(skillList);
          }
        });
  
        list.appendChild(li);
      });
    });
  }
  
  window.onload = () => {
    loadTemplate();
    loadCharacters();
  };
  