import React from 'react';
import {
  Box,
  Grid,
  VStack,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Button,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';

export const Equipment = ({ character }) => {
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  
  if (!character || !character.equipment) {
    return (
      <Box
        bg={cardBg}
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="brand.500"
      >
        <Text color="gray.400">No equipment data available</Text>
      </Box>
    );
  }
  
  return (
    <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={6}>
      {/* Equipment Slots */}
      <Box
        bg={cardBg}
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="brand.500"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="brand.200">Equipment</Heading>
          
          {/* Weapon Slot */}
          <Box p={3} borderWidth="1px" borderRadius="lg" borderColor="whiteAlpha.300">
            <Text mb={2} color="gray.400">Weapon</Text>
            {character.equipment?.weapon ? (
              <Text>{character.equipment.weapon.name}</Text>
            ) : (
              <Text color="gray.600">Empty Slot</Text>
            )}
          </Box>

          {/* Armor Slot */}
          <Box p={3} borderWidth="1px" borderRadius="lg" borderColor="whiteAlpha.300">
            <Text mb={2} color="gray.400">Armor</Text>
            {character.equipment?.armor ? (
              <Text>{character.equipment.armor.name}</Text>
            ) : (
              <Text color="gray.600">Empty Slot</Text>
            )}
          </Box>

          {/* Accessories */}
          <Box p={3} borderWidth="1px" borderRadius="lg" borderColor="whiteAlpha.300">
            <Text mb={2} color="gray.400">Accessories</Text>
            <SimpleGrid columns={2} spacing={2}>
              {character.equipment?.accessories?.length > 0 ? (
                character.equipment.accessories.map((accessory, index) => (
                  <Box 
                    key={index}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="whiteAlpha.200"
                  >
                    <Text fontSize="sm">{accessory.name}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.600">No accessories equipped</Text>
              )}
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>

      {/* Inventory */}
      <Box
        bg={cardBg}
        p={4}
        borderRadius="xl"
        borderWidth="1px"
        borderColor="brand.500"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="brand.200">Inventory</Heading>
          
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
            {character.equipment?.inventory?.length > 0 ? (
              character.equipment.inventory.map((item, index) => (
                <Box
                  key={index}
                  p={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'brand.500' }}
                  cursor="pointer"
                >
                  <VStack spacing={2}>
                    <Text>{item.name}</Text>
                    <Badge colorScheme={getItemRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                  </VStack>
                </Box>
              ))
            ) : (
              <Text color="gray.600">Inventory is empty</Text>
            )}
          </SimpleGrid>
        </VStack>
      </Box>
    </Grid>
  );
};

function getItemRarityColor(rarity) {
  switch (rarity?.toLowerCase()) {
    case 'common': return 'gray';
    case 'uncommon': return 'green';
    case 'rare': return 'blue';
    case 'epic': return 'purple';
    case 'legendary': return 'orange';
    default: return 'gray';
  }
} 