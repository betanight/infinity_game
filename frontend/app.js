// Your Firebase Config (replace placeholders if needed)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Fetch and display all characters
  function loadCharacters() {
    db.ref("characters").once("value")
      .then(snapshot => {
        const characters = snapshot.val();
        const list = document.getElementById("character-list");
        list.innerHTML = "";
  
        if (characters) {
          Object.keys(characters).forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            list.appendChild(li);
          });
        } else {
          list.innerHTML = "<li>No characters found.</li>";
        }
      })
      .catch(err => console.error("Error loading characters:", err));
  }
  
  // Fetch and display template
  function loadTemplate() {
    db.ref("template").once("value")
      .then(snapshot => {
        const template = snapshot.val();
        const output = document.getElementById("template-output");
        output.textContent = JSON.stringify(template, null, 2);
      })
      .catch(err => console.error("Error loading template:", err));
  }
  
  // Load everything when page opens
  window.onload = function() {
    loadCharacters();
    loadTemplate();
  };
  