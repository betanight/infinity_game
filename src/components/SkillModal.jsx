import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';

export const SkillModal = ({ skill, onClose, onUpgrade, onDowngrade }) => {
  if (!skill) return null;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>{skill.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text>{skill.description}</Text>
            
            <HStack>
              <Text fontWeight="bold">Level:</Text>
              <Badge colorScheme="brand">{skill.value}</Badge>
            </HStack>

            <Text fontWeight="bold">Boosts:</Text>
            <HStack wrap="wrap" spacing={2}>
              {skill.boost?.map((boost, index) => (
                <Badge key={index} colorScheme="brand" variant="outline">
                  {boost}
                </Badge>
              ))}
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onDowngrade}>
            Downgrade
          </Button>
          <Button colorScheme="brand" onClick={onUpgrade}>
            Upgrade
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 