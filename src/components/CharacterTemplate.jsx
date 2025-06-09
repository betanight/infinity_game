import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Progress,
  Grid,
  useColorModeValue,
  IconButton,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { db } from '../firebase/firebase.js';
import { ref, get, set } from 'firebase/database';
import { keyframes } from '@emotion/react';
import { calculateRank } from '../frontend/skilltree/levelUp/levelingFunctions.js';

const pulseKeyframes = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const initialTemplate = {
  meta: {
    character_id: "",
    level: 1,
    experience: 0,
    experience_to_next: 1000,
    available_skill_points: 6,
    rank: "G-",
    unlocked_trees: {
      Willpower: false,
      Spirit: false,
      Arcane: false,
      Presence: false,
    },
  },
  primary_scores: {
    Strength: 1,
    Dexterity: 1,
    Constitution: 1,
    Intelligence: 1,
    Wisdom: 1,
    Charisma: 1,
  },
  secondary_scores: {
    Willpower: 0,
    Spirit: 0,
    Arcane: 0,
    Presence: 0,
  },
  equipment: {
    weapon: null,
    armor: null,
    accessories: [],
    inventory: [],
  },
  skills: {
    Strength: {},
    Dexterity: {},
    Constitution: {},
    Intelligence: {},
    Wisdom: {},
    Charisma: {},
    Willpower: {},
    Spirit: {},
    Arcane: {},
    Presence: {},
  }
};

const MIN_SCORE = 1;

export const CharacterTemplate = ({ character, onNavigate }) => {
  const [template, setTemplate] = useState(character || initialTemplate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const bgColor = useColorModeValue('gray.700', 'gray.900');
  const borderColor = useColorModeValue('gray.600', 'gray.700');
  const sectionBg = useColorModeValue('gray.700', 'gray.700');
  const textColor = useColorModeValue('white', 'white');
  const statBg = useColorModeValue('gray.600', 'gray.800');

  useEffect(() => {
    if (character) {
      // Ensure all required structures exist
      const safeCharacter = {
        ...initialTemplate,
        ...character,
        meta: {
          ...initialTemplate.meta,
          ...character.meta,
        },
        equipment: {
          ...initialTemplate.equipment,
          ...character.equipment,
          accessories: character.equipment?.accessories || initialTemplate.equipment.accessories,
          inventory: character.equipment?.inventory || initialTemplate.equipment.inventory,
        },
        skills: {
          ...initialTemplate.skills,
          ...character.skills,
        }
      };
      setTemplate(safeCharacter);
    }
  }, [character]);

  const addExperience = async (amount) => {
    try {
      const newExperience = template.meta.experience + amount;
      const experienceToNext = template.meta.experience_to_next;
      let newLevel = template.meta.level;
      
      if (newExperience >= experienceToNext) {
        newLevel += 1;
      }

      const newTemplate = {
        ...template,
        meta: {
          ...template.meta,
          experience: newExperience,
          level: newLevel,
          experience_to_next: experienceToNext * (newLevel > template.meta.level ? 1.5 : 1)
        }
      };

      const templateRef = ref(db, `characters/${template.meta.character_id}`);
      await set(templateRef, newTemplate);
      setTemplate(newTemplate);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSkillTreeClick = () => {
    const charId = template.meta.character_id;
    if (onNavigate) {
      onNavigate(`/skilltree?char=${charId}`);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Loading character data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10} color="red.500">
        <Text>Error: {error}</Text>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No character data available</Text>
      </Box>
    );
  }

  const experienceProgress = Math.min(
    (template.meta.experience / template.meta.experience_to_next) * 100,
    100
  );

  return (
    <VStack 
      spacing={6} 
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
      w="full"
      align="stretch"
    >
      {/* Character Info Section */}
      <Box>
        <Heading size="md" color="brand.200" mb={4}>Character Info</Heading>
        <SimpleGrid columns={2} spacing={4}>
          <Stat bg={statBg} p={3} borderRadius="md">
            <StatLabel>Level</StatLabel>
            <StatNumber>{template.meta.level}</StatNumber>
          </Stat>
          <Stat bg={statBg} p={3} borderRadius="md">
            <StatLabel>Rank</StatLabel>
            <StatNumber>{template.meta.rank}</StatNumber>
          </Stat>
          <Box bg={statBg} p={3} borderRadius="md" gridColumn="1/-1">
            <HStack justify="space-between" align="center">
              <Stat>
                <StatLabel>Experience</StatLabel>
                <StatNumber>{template.meta.experience} / {template.meta.experience_to_next}</StatNumber>
                <Progress value={experienceProgress} colorScheme="purple" size="sm" mt={2} />
              </Stat>
              <Button
                size="sm"
                colorScheme="brand"
                onClick={handleSkillTreeClick}
              >
                Open Skill Tree
              </Button>
            </HStack>
          </Box>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Primary Stats Section */}
      <Box>
        <Heading size="md" color="brand.200" mb={4}>Primary Stats</Heading>
        <SimpleGrid columns={2} spacing={4}>
          {Object.entries(template.primary_scores).map(([stat, value]) => (
            <Stat key={stat} bg={statBg} p={3} borderRadius="md">
              <StatLabel>{stat}</StatLabel>
              <StatNumber>{value}</StatNumber>
            </Stat>
          ))}
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Secondary Stats Section */}
      <Box>
        <Heading size="md" color="brand.200" mb={4}>Secondary Stats</Heading>
        <SimpleGrid columns={2} spacing={4}>
          {Object.entries(template.secondary_scores).map(([stat, value]) => (
            <Stat key={stat} bg={statBg} p={3} borderRadius="md">
              <StatLabel>{stat}</StatLabel>
              <StatNumber>{value}</StatNumber>
              <StatHelpText>
                {template.meta.unlocked_trees[stat] ? 'Unlocked' : 'Locked'}
              </StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>
      </Box>

      <Divider />

      {/* Equipment Section */}
      <Box>
        <Heading size="md" color="brand.200" mb={4}>Equipment</Heading>
        <VStack spacing={4} align="stretch" bg={statBg} p={4} borderRadius="md">
          <HStack justify="space-between">
            <Text>Weapon:</Text>
            <Text>{template?.equipment?.weapon || 'None'}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text>Armor:</Text>
            <Text>{template?.equipment?.armor || 'None'}</Text>
          </HStack>
          <Box>
            <Text mb={2}>Accessories:</Text>
            {template?.equipment?.accessories?.length > 0 ? (
              <VStack align="stretch">
                {template.equipment.accessories.map((acc, idx) => (
                  <Text key={idx}>{acc}</Text>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">No accessories equipped</Text>
            )}
          </Box>
          <Box>
            <Text mb={2}>Inventory:</Text>
            {template?.equipment?.inventory?.length > 0 ? (
              <VStack align="stretch">
                {template.equipment.inventory.map((item, idx) => (
                  <Text key={idx}>{item}</Text>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">Inventory is empty</Text>
            )}
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}; 