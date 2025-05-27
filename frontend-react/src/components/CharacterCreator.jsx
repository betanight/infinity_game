import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { ref, get, set } from 'firebase/database';

function CharacterCreator() {
  const [template, setTemplate] = useState(null);
  const [skillsData, setSkillsData] = useState({});
  const [primaryStats, setPrimaryStats] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState({});
  const [characterName, setCharacterName] = useState('');

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const templateSnapshot = await get(ref(db, "template"));
      const templateData = templateSnapshot.val();
      
      if (!templateData || !templateData.primary_scores) {
        console.error("Template missing or malformed");
        return;
      }

      setTemplate(templateData);
      setPrimaryStats(Object.keys(templateData.primary_scores));

      const skillsSnapshot = await get(ref(db, "template/skills"));
      const skills = skillsSnapshot.val();
      if (!skills) {
        console.error("No skill data found in template");
        return;
      }

      setSkillsData(skills);
    } catch (err) {
      console.error("Error loading template:", err);
    }
  };

  const handleSkillChange = (stat, skill) => {
    setSelectedSkills(prev => ({
      ...prev,
      [stat]: skill
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!characterName.trim()) {
      alert("Please enter a character name.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in to create characters.");
      return;
    }

    // Check if all stats have a skill selected
    const allChosen = primaryStats.every(stat => selectedSkills[stat]);
    if (!allChosen) {
      alert("Please choose a skill for every primary stat.");
      return;
    }

    try {
      const newTemplate = { ...template };
      newTemplate.meta.character_id = characterName;
      newTemplate.skills = {};

      primaryStats.forEach(stat => {
        newTemplate.skills[stat] = {
          [selectedSkills[stat]]: 1
        };
      });

      await set(ref(db, `characters/${characterName.toLowerCase()}`), newTemplate);
      alert(`Character '${characterName}' created!`);
      
      // Reset form
      setCharacterName('');
      setSelectedSkills({});
    } catch (err) {
      console.error("Error creating character:", err);
      alert("Failed to create character. Please try again.");
    }
  };

  return (
    <div className="character-creator">
      <h2>Create New Character</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="character-name">Character Name:</label>
          <input
            id="character-name"
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            required
          />
        </div>

        {primaryStats.map(stat => (
          <div key={stat}>
            <label htmlFor={`skill-select-${stat}`}>{stat} Skill:</label>
            <select
              id={`skill-select-${stat}`}
              value={selectedSkills[stat] || ''}
              onChange={(e) => handleSkillChange(stat, e.target.value)}
              required
            >
              <option value="">-- Choose a {stat} skill --</option>
              {skillsData[stat] && Object.keys(skillsData[stat]).map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button type="submit">Create Character</button>
      </form>
    </div>
  );
}

export default CharacterCreator; 