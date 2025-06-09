import React from 'react';
import {
  VStack,
  Button,
  Text,
  Badge,
  Heading,
  Divider,
} from '@chakra-ui/react';

export const CharacterStats = ({ character, onStatSelect }) => {
  if (!character) return null;

  const unlockedSecondaryStats = Object.entries(character.secondary_scores || {})
    .filter(([stat]) => character.meta?.unlocked_trees?.[stat]);

  return (
    <VStack align="stretch" spacing={4}>
      <Heading size="md" color="brand.200">Primary Stats</Heading>
      {Object.entries(character.primary_scores || {}).map(([stat, value]) => (
        <Button
          key={stat}
          onClick={() => onStatSelect(stat)}
          variant="outline"
          colorScheme="brand"
          justifyContent="space-between"
          width="100%"
        >
          <Text>{stat}</Text>
          <Badge variant="solid" colorScheme="brand">{value}</Badge>
        </Button>
      ))}

      {unlockedSecondaryStats.length > 0 && (
        <>
          <Divider />
          <Heading size="md" color="brand.200">Secondary Stats</Heading>
          {unlockedSecondaryStats.map(([stat, value]) => (
            <Button
              key={stat}
              onClick={() => onStatSelect(stat)}
              variant="outline"
              colorScheme="brand"
              justifyContent="space-between"
              width="100%"
            >
              <Text>{stat}</Text>
              <Badge variant="solid" colorScheme="brand">{value}</Badge>
            </Button>
          ))}
        </>
      )}
    </VStack>
  );
}; 