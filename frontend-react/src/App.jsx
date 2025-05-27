import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import CharacterList from './components/CharacterList';
import CharacterCreator from './components/CharacterCreator';
import TemplateViewer from './components/TemplateViewer';
import EquipmentCreator from './components/EquipmentCreator';
import SkillTree from './components/SkillTree';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const adminSnapshot = await get(ref(db, `admins/${user.uid}`));
          const isAdmin = adminSnapshot.val() === true;
          const isSpecialUser = user.uid === 'ch1yWOwbx7h2QUXQsSjj0pqVw8d2';
          setIsAdmin(isAdmin || isSpecialUser);
        } catch (err) {
          console.error("Error checking admin status:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Infinity Game</h1>
          <button className="sign-out-btn" onClick={() => auth.signOut()}>
            Sign Out
          </button>
        </header>
        <Routes>
          <Route path="/" element={
            <>
              <TemplateViewer />
              <CharacterList />
              <CharacterCreator />
              {isAdmin && <EquipmentCreator />}
            </>
          } />
          <Route path="/skilltree/:characterName" element={<SkillTree />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
