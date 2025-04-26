// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyC2V2EUMC8YdoDeNEB2btla_NJLQ5bPWv0",
    authDomain: "infinity-e0f55.firebaseapp.com",
    databaseURL: "https://infinity-e0f55-default-rtdb.firebaseio.com",
    projectId: "infinity-e0f55",
    storageBucket: "infinity-e0f55.appspot.com", // ✅ fixed typo here!
    messagingSenderId: "120929977477",
    appId: "1:120929977477:web:45dc9989f834f69a9195ec",
    measurementId: "G-PFFQDN2MHX"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
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
  