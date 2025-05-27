import React, { useState } from 'react';

const coreStats = [
  'Strength',
  'Dexterity',
  'Constitution',
  'Intelligence',
  'Wisdom',
  'Charisma',
];

const CoreCheckDrawer = ({ open, onClose, characterData }) => {
  const [rollResult, setRollResult] = useState({});
  const primary = characterData.primary_scores || {};

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: open ? 0 : '-260px',
          width: 240,
          height: '100vh',
          background: '#1e1e1e',
          color: 'white',
          zIndex: 9998,
          padding: '60px 16px 16px',
          transition: 'right 0.3s ease-in-out',
          overflowY: 'auto',
          boxShadow: '-2px 0 10px rgba(0,0,0,0.7)',
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Core Stats</h2>
        {coreStats.map((stat) => {
          const score = primary[stat] || 0;
          const min = 10;
          const max = 10 + score;
          return (
            <div key={stat} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{stat} ({score})</span>
                <button
                  style={{ marginLeft: 6, padding: '2px 8px', borderRadius: 6, border: 'none', background: '#0af', color: 'white', cursor: 'pointer' }}
                  onClick={() => {
                    const roll = Math.floor(Math.random() * (max - min + 1)) + min;
                    setRollResult(r => ({ ...r, [stat]: roll }));
                  }}
                >🎲</button>
              </div>
              <div style={{ fontSize: 12, color: '#ccc', marginLeft: 8, marginTop: 2 }}>
                {rollResult[stat] !== undefined && (
                  <>🎲 <strong>{rollResult[stat]}</strong> (range {min}–{max})</>
                )}
              </div>
            </div>
          );
        })}
        <button style={{ marginTop: 16, width: '100%' }} onClick={onClose}>Close</button>
      </div>
      <button
        style={{
          position: 'fixed',
          top: 56,
          right: 0,
          zIndex: 9999,
          padding: '10px 16px',
          borderRadius: '8px 0 0 8px',
          border: 'none',
          background: '#0af',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        {open ? 'Hide Checks' : 'Core Checks'}
      </button>
    </>
  );
};

export default CoreCheckDrawer; 