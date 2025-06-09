import React from 'react';
import { Handle } from 'reactflow';

export const PrimaryNode = ({ data }) => {
  return (
    <div style={{
      background: data.style?.background || 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      padding: '20px',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      width: 120,
      height: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    }}>
      <Handle type="source" position="bottom" style={{ visibility: 'hidden' }} />
      <div>{data.label}</div>
      <Handle type="target" position="top" style={{ visibility: 'hidden' }} />
    </div>
  );
};

export const SkillNode = ({ data }) => {
  return (
    <div style={{
      background: data.style?.background || 'rgba(100, 100, 100, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      padding: '10px',
      color: 'white',
      fontSize: '11px',
      width: 70,
      height: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      backdropFilter: 'blur(3px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}>
      <Handle type="source" position="bottom" style={{ visibility: 'hidden' }} />
      <div>{data.label}</div>
      <Handle type="target" position="top" style={{ visibility: 'hidden' }} />
    </div>
  );
};

export const CategoryNode = ({ data }) => {
  return (
    <div style={{
      background: 'rgba(150, 150, 150, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      padding: '15px',
      color: 'white',
      fontSize: '13px',
      width: 90,
      height: 90,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}>
      <Handle type="source" position="bottom" style={{ visibility: 'hidden' }} />
      <div>{data.label}</div>
      <Handle type="target" position="top" style={{ visibility: 'hidden' }} />
    </div>
  );
}; 