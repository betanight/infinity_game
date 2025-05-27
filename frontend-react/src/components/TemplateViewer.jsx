import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { ref, get } from 'firebase/database';

function TemplateViewer() {
  const [template, setTemplate] = useState(null);
  const [skills, setSkills] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const templateSnapshot = await get(ref(db, "template"));
        const templateData = templateSnapshot.val();
        
        if (!templateData || !templateData.primary_scores) {
          setError("Template missing or malformed.");
          return;
        }

        setTemplate(templateData);

        const skillsSnapshot = await get(ref(db, "template/skills"));
        const skillsData = skillsSnapshot.val();
        
        if (!skillsData) {
          setError("No skill data found in template.");
          return;
        }

        setSkills(skillsData);
      } catch (err) {
        console.error("Error loading template:", err);
        setError(err.message);
      }
    };

    loadTemplate();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!template || !skills) {
    return <div className="loading">Loading template...</div>;
  }

  return (
    <div className="template-viewer">
      <h2>Template</h2>
      <div className="primary-scores">
        <h3>Primary Scores</h3>
        {Object.entries(template.primary_scores).map(([stat, value]) => (
          <div key={stat} className="stat">
            <strong>{stat}:</strong> {value}
          </div>
        ))}
      </div>
      <div className="skills">
        <h3>Skills</h3>
        {Object.entries(skills).map(([stat, statSkills]) => (
          <details key={stat}>
            <summary>{stat}</summary>
            <ul>
              {Object.entries(statSkills).map(([skill, data]) => (
                <li key={skill}>
                  <strong>{skill}:</strong> {data.description || "No description"}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}

export default TemplateViewer; 