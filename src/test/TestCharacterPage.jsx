import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  VStack,
  HStack,
  Text,
  Container,
  Badge,
  useColorModeValue,
  Spinner,
  Center,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { CharacterTemplate } from '../components/CharacterTemplate';
import { SkillTree } from '../components/SkillTree';
import { SkillModal } from '../components/SkillModal';
import { Equipment } from '../components/Equipment';
import { CharacterStats } from '../components/CharacterStats';
import { SignIn } from '../components/SignIn';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  getCharacterData, 
  upgradePrimarySkill, 
  downgradePrimarySkill,
  upgradeMysticalSkill,
  downgradeMysticalSkill,
  updateCoreStatTotals
} from '../frontend/skilltree/levelUp/levelingFunctions.js';

// Animation keyframes
const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(124, 77, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(124, 77, 255, 0.4); }
  100% { box-shadow: 0 0 10px rgba(124, 77, 255, 0.2); }
`;

const CharacterInfo = ({ character }) => {
  if (!character) return null;

  return (
    <VStack align="stretch" spacing={2}>
      <Heading size="md" color="brand.200">Character Info</Heading>
      <Text>Level: {character.meta?.level || 1}</Text>
      <Text>Rank: {character.meta?.rank || 'G-'}</Text>
      <Text>Experience: {character.meta?.experience || 0} / {character.meta?.experience_to_next || 1000}</Text>
      <Text>Available Points: {character.meta?.available_skill_points || 0}</Text>
    </VStack>
  );
};

export const TestCharacterPage = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Use the user's UID as the character ID if available, otherwise use 'test_character'
  const characterId = user?.uid || 'test_character';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!characterId) return;

    const loadCharacter = async () => {
      try {
        setLoading(true);
        const data = await getCharacterData(characterId);
        await updateCoreStatTotals(characterId);
        setCharacter(data);
      } catch (err) {
        console.error('Error loading character:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  const handleStatSelect = (stat) => {
    setSelectedStat(stat);
    setSelectedSkill(null);
  };

  const handleSkillClick = async (skill) => {
    if (!character || !selectedStat) return;

    try {
      if (selectedStat === "Arcane") {
        const [tier, element, spell] = skill.name.split("/");
        await upgradeMysticalSkill(characterId, selectedStat, tier, element, spell, 1);
      } else {
        await upgradePrimarySkill(characterId, selectedStat, skill.name, 1);
      }
      // Reload character data after upgrade
      const updatedChar = await getCharacterData(characterId);
      setCharacter(updatedChar);
    } catch (err) {
      console.error('Error upgrading skill:', err);
    }
  };

  const handleSkillDowngrade = async (skill) => {
    if (!character || !selectedStat) return;

    try {
      if (selectedStat === "Arcane") {
        const [tier, element, spell] = skill.name.split("/");
        await downgradeMysticalSkill(characterId, selectedStat, tier, element, spell, 1);
      } else {
        await downgradePrimarySkill(characterId, selectedStat, skill.name, 1);
      }
      // Reload character data after downgrade
      const updatedChar = await getCharacterData(characterId);
      setCharacter(updatedChar);
    } catch (err) {
      console.error('Error downgrading skill:', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const cardBg = useColorModeValue('gray.800', 'gray.800');

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.200" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.sm" py={10}>
        <VStack spacing={6}>
          <Heading color="brand.200">Welcome to Infinity Game</Heading>
          <Text color="gray.400" textAlign="center">
            Please sign in to access your character and skill tree.
          </Text>
          <SignIn />
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.sm" py={10}>
        <VStack spacing={4}>
          <Heading color="red.400">Error Loading Character</Heading>
          <Text color="gray.400">{error.message}</Text>
        </VStack>
      </Container>
    );
  }

  if (!character) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.200" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={4}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Left Column - Character Info */}
          <VStack spacing={8} align="stretch">
            <Box bg={cardBg} p={6} borderRadius="xl">
              <CharacterTemplate 
                character={character} 
                onNavigate={navigate}
              />
              <Divider my={4} />
              <CharacterStats 
                character={character} 
                onStatSelect={handleStatSelect}
              />
            </Box>
          </VStack>

          {/* Right Column - Skill Tree */}
          <Box 
            bg={cardBg} 
            p={6} 
            borderRadius="xl"
          >
            {selectedStat ? (
              <SkillTree
                characterData={character}
                statType={selectedStat}
                onSkillClick={handleSkillClick}
                width={600}
                height={500}
              />
            ) : (
              <Center h="500px">
                <Text color="gray.500">Select a stat to view its skill tree</Text>
              </Center>
            )}
          </Box>
        </SimpleGrid>
      </Container>

      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={handleCloseModal}
          onUpgrade={() => handleSkillClick(selectedSkill)}
          onDowngrade={() => handleSkillDowngrade(selectedSkill)}
        />
      )}
    </Box>
  );
}; 