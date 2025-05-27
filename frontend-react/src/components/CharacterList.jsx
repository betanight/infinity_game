import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { ref, get, set } from 'firebase/database';

function CharacterList() {
  const [characters, setCharacters] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const snapshot = await get(ref(db, 'characters'));
      const data = snapshot.val();
      setCharacters(data || {});
      setError(null);
    } catch (err) {
      console.error('Error loading characters:', err);
      setError('Failed to load characters. Please try again.');
    }
  };

  const flattenSkills = (skills) => {
    const flat = {};
    function dive(obj, path = '') {
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'number') {
          flat[path + key] = val;
        } else if (typeof val === 'object' && val !== null) {
          dive(val, path + key + '/');
        }
      }
    }
    dive(skills);
    return flat;
  };

  const updateSkillPoints = async (name, newTotal) => {
    try {
      const character = characters[name];
      const skills = character.skills || {};
      const flatSkills = flattenSkills(skills);
      const totalUsedPoints = Object.values(flatSkills).reduce((sum, val) => sum + val, 0);
      const newAvailable = newTotal - totalUsedPoints;
      
      await set(ref(db, `characters/${name}/meta/available_skill_points`), newAvailable);
      await loadCharacters();
    } catch (err) {
      console.error('Error updating skill points:', err);
      setError('Failed to update skill points. Please try again.');
    }
  };

  const handleAscension = async (name, choice) => {
    if (!["Willpower", "Presence", "Spirit", "Arcane"].includes(choice)) {
      alert("Invalid choice.");
      return;
    }

    const capitalized = choice.charAt(0).toUpperCase() + choice.slice(1);

    try {
      const tierSnap = await get(ref(db, `template/skills/${capitalized}/Tier 1`));
      const tierData = tierSnap.val();

      if (!tierData) {
        alert(`No Tier 1 skills found for ${capitalized}`);
        return;
      }

      const categories = Object.keys(tierData);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const skillList = Object.keys(tierData[randomCategory]);
      const randomSkill = skillList[Math.floor(Math.random() * skillList.length)];

      const charKey = name.toLowerCase();
      const skillPath = `characters/${charKey}/skills/${capitalized}/Tier 1/${randomCategory}/${randomSkill}`;
      const scorePath = `characters/${charKey}/secondary_scores/${capitalized}`;
      const unlockPath = `characters/${charKey}/meta/unlocked_trees/${capitalized}`;

      await set(ref(db, unlockPath), true);
      await set(ref(db, scorePath), 1);
      await set(ref(db, skillPath), 1);

      alert(`${capitalized} tree unlocked. 1 point added to "${randomSkill}" under ${randomCategory}.`);
      await loadCharacters();
    } catch (err) {
      console.error("Ascension error:", err);
      alert("Something went wrong during ascension.");
    }
  };

  const renderSkillLevel = (skillData) => {
    if (typeof skillData === 'number') {
      return skillData;
    }
    if (typeof skillData === 'object' && skillData !== null) {
      return Object.entries(skillData)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return '0';
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!characters) {
    return <div className="loading">Loading characters...</div>;
  }

  return (
    <div className="character-list">
      <h2>Characters</h2>
      {Object.entries(characters).map(([name, data]) => {
        const skills = data.skills || {};
        const flatSkills = flattenSkills(skills);
        const totalUsedPoints = Object.values(flatSkills).reduce((sum, val) => sum + val, 0);
        const available = data.meta?.available_skill_points || 0;
        const totalAvailable = available + totalUsedPoints;

        return (
          <div key={name} className="character-card">
            <div className="character-header">
              <h3>{name}</h3>
              <div className="skill-points">
                <button onClick={() => updateSkillPoints(name, totalAvailable - 1)} disabled={totalAvailable <= totalUsedPoints}>−</button>
                <span>{totalAvailable}</span>
                <button onClick={() => updateSkillPoints(name, totalAvailable + 1)}>+</button>
                <button 
                  className="skilltree-btn"
                  onClick={() => navigate(`/skilltree/${encodeURIComponent(name)}`)}
                >
                  Skill Tree
                </button>
              </div>
              <button
                onClick={() => {
                  const choice = prompt(
                    "Choose an ascension path:\n- Willpower\n- Presence\n- Spirit\n- Arcane"
                  )?.trim();
                  if (choice) handleAscension(name, choice);
                }}
              >
                Ascension
              </button>
            </div>
            <details>
              <summary>Skills</summary>
              <ul>
                {Object.entries(skills).map(([stat, skillMap]) => {
                  if (!skillMap) return null;
                  return Object.entries(skillMap)
                    .filter(([, val]) => {
                      if (typeof val === 'number') return val > 0;
                      if (typeof val === 'object' && val !== null) {
                        return Object.values(val).some(v => v > 0);
                      }
                      return false;
                    })
                    .map(([skill, val]) => (
                      <li key={`${stat}-${skill}`}>
                        <em>{stat}</em>: {skill} (level {renderSkillLevel(val)})
                      </li>
                    ));
                })}
              </ul>
            </details>
          </div>
        );
      })}
    </div>
  );
}

export default CharacterList; 