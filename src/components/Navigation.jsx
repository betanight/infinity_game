import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  HStack,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { auth } from '../firebase/firebase';

export const Navigation = () => {
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.300');

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Box 
      as="nav" 
      bg={bgColor} 
      py={4} 
      px={8} 
      borderBottom="1px" 
      borderColor={borderColor}
    >
      <HStack justify="space-between" align="center">
        <Link to="/">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            bgGradient="linear(to-r, brand.200, brand.400)"
            bgClip="text"
            _hover={{
              transform: 'translateY(-2px)',
              textShadow: '0 0 20px rgba(124, 77, 255, 0.2)',
            }}
            transition="all 0.2s"
          >
            Infinity Game
          </Text>
        </Link>
        
        <Button 
          onClick={handleLogout}
          colorScheme="brand"
          variant="solid"
          size="md"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(124, 77, 255, 0.2)',
          }}
          _active={{
            transform: 'translateY(0)',
          }}
          transition="all 0.2s"
        >
          Logout
        </Button>
      </HStack>
    </Box>
  );
}; 