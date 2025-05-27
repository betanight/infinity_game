import React, { useState } from 'react';

// Example: You can expand this with more abilities and logic as needed
function getAbilities(characterData) {
  // For now, just show Unarmed Strike as in the old hotbar
  const scores = {
    ...(characterData.primary_scores || {}),
    ...(characterData.secondary_scores || {}),
  };
  const skills = {};
  for (const stat in characterData.skills || {}) {
    const statBlock = characterData.skills[stat];
    if (typeof statBlock !== 'object') continue;
    for (const key in statBlock) {
      const val = statBlock[key];
      if (typeof val === 'number') {
        skills[key] = val;
      } else if (typeof val === 'object') {
        for (const subcat in val) {
          for (const skill in val[subcat]) {
            skills[skill] = val[subcat][skill];
          }
        }
      }
    }
  }
  // Unarmed Strike logic (simplified)
  const baseStat = 'Strength';
  const baseScore = scores[baseStat] || 0;
  const baseDamage = baseScore * 3 + (skills['Unarmed'] || 0);
  const minDmg = Math.floor(Math.sqrt(baseDamage));
  const maxDmg = Math.floor(baseDamage);
  const minRoll = Math.floor(Math.sqrt(baseScore * 3));
  const maxRoll = baseScore * 3;
  return [
    {
      name: 'Unarmed Strike',
      description: 'A basic physical attack using fists or body.',
      roll: { min: minRoll, max: maxRoll },
      damage: { min: minDmg, max: maxDmg },
      hp: characterData.meta?.currentHealth,
      armor: 0, // You can add armor logic if needed
    },
  ];
}

const AbilityDrawer = ({ open, onClose, characterData }) => {
  const [rollResult, setRollResult] = useState({});
  const abilities = getAbilities(characterData);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: 0,
          bottom: open ? 0 : '-100%',
          width: '100vw',
          background: '#222',
          color: 'white',
          zIndex: 9998,
          padding: '24px 16px 32px',
          transition: 'bottom 0.3s cubic-bezier(.4,2,.6,1)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.7)',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Abilities</h2>
        {abilities.map((ab, idx) => (
          <div key={ab.name} style={{ marginBottom: 18, background: '#2a2a2a', borderRadius: 8, padding: 16 }}>
            <h3 style={{ margin: 0 }}>{ab.name}</h3>
            <p style={{ margin: '8px 0' }}>{ab.description}</p>
            <p><strong>Roll Range:</strong> {ab.roll.min} – {ab.roll.max}</p>
            <p><strong>Damage Range:</strong> {ab.damage.min} – {ab.damage.max}</p>
            <button
              style={{ padding: '6px 12px', marginTop: 8, background: '#0af', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              onClick={() => {
                const roll = Math.floor(Math.random() * (ab.roll.max - ab.roll.min + 1)) + ab.roll.min;
                setRollResult(r => ({ ...r, [ab.name]: roll }));
              }}
            >Roll</button>
            {rollResult[ab.name] !== undefined && (
              <div style={{ marginTop: 8, color: '#ccc' }}>🎯 Roll: <strong>{rollResult[ab.name]}</strong></div>
            )}
          </div>
        ))}
        <button style={{ marginTop: 12, width: '100%' }} onClick={onClose}>Close</button>
      </div>
      <button
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 9999,
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          background: '#0af',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        {open ? 'Hide Abilities' : 'Show Abilities'}
      </button>
    </>
  );
};

export default AbilityDrawer; 