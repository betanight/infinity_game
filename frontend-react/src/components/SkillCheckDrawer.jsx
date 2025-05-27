import React, { useState } from 'react';

function getSkillList(characterData, templateSkills) {
  const output = [];
  function dive(stat, skills, path = []) {
    for (const skillName in skills) {
      const meta = skills[skillName];
      const charVal = characterData.skills?.[stat]?.[skillName];
      if (typeof meta === 'object' && meta !== null && !Array.isArray(meta) && meta.description === undefined) {
        // Nested object (e.g., Ability, Passive, etc.)
        dive(stat, meta, path.concat(skillName));
      } else {
        // Leaf skill
        let level = 0;
        if (Array.isArray(meta)) continue; // skip arrays
        if (typeof charVal === 'number') {
          level = charVal;
        } else if (typeof charVal === 'object' && charVal !== null) {
          // If the value is an object, sum its numeric children
          level = Object.values(charVal).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
        }
        output.push({
          stat,
          name: path.concat(skillName).join(' / '),
          level,
          desc: meta?.description || 'No description.',
        });
      }
    }
  }
  for (const stat in templateSkills) {
    dive(stat, templateSkills[stat]);
  }
  return output;
}

const SkillCheckDrawer = ({ open, onClose, characterData, templateSkills }) => {
  const [rollResult, setRollResult] = useState({});
  const skillList = getSkillList(characterData, templateSkills);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : '-260px',
          width: 240,
          height: '100vh',
          background: '#1e1e1e',
          color: 'white',
          zIndex: 9998,
          padding: '60px 16px 16px',
          transition: 'left 0.3s ease-in-out',
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0,0,0,0.7)',
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Skills</h2>
        {skillList.map(({ stat, name, level, desc }) => {
          const min = Math.floor(Math.sqrt(level));
          const max = level;
          const canRoll = level > 0 && max >= min;
          return (
            <div key={stat + name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>{name} ({level})</span>
                <button
                  style={{ marginLeft: 6, padding: '2px 8px', borderRadius: 6, border: 'none', background: canRoll ? '#0af' : '#555', color: 'white', cursor: canRoll ? 'pointer' : 'not-allowed' }}
                  onClick={() => {
                    if (canRoll) {
                      const roll = Math.floor(Math.random() * (max - min + 1)) + min;
                      setRollResult(r => ({ ...r, [stat + name]: roll }));
                    }
                  }}
                  disabled={!canRoll}
                >🎲</button>
              </div>
              <div style={{ fontSize: 12, color: '#ccc', marginLeft: 8, marginTop: 2 }}>
                {rollResult[stat + name] !== undefined && canRoll && (
                  <>🎲 <strong>{rollResult[stat + name]}</strong> (range {min}–{max})</>
                )}
                {!canRoll && <span style={{ color: '#888' }}>Not rollable</span>}
              </div>
            </div>
          );
        })}
        <button style={{ marginTop: 16, width: '100%' }} onClick={onClose}>Close</button>
      </div>
      <button
        style={{
          position: 'fixed',
          top: 16,
          left: 0,
          zIndex: 9999,
          padding: '10px 16px',
          borderRadius: '0 8px 8px 0',
          border: 'none',
          background: '#0af',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        {open ? 'Hide Checks' : 'Skill Checks'}
      </button>
    </>
  );
};

export default SkillCheckDrawer; 