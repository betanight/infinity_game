import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CharacterTemplate } from '../components/CharacterTemplate';
import { SkillTree } from '../components/SkillTree';
import { SkillModal } from '../components/SkillModal';
import { useCharacter } from '../hooks/useCharacter';

export const CharacterPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { character, loading, error } = useCharacter(characterId);
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!character) return <div>Character not found</div>;

  return (
    <div>
      <CharacterTemplate 
        character={character} 
        onNavigate={navigate}
      />
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}; 