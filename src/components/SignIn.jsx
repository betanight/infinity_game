import React, { useState } from 'react';
import {
  VStack,
  Button,
  Text,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Box,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const SignIn = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "You have been signed in successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.800" p={6} borderRadius="xl" boxShadow="xl">
      <form onSubmit={handleEmailSignIn}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" color="brand.200" fontWeight="bold">Sign In</Text>
          
          <FormControl>
            <FormLabel color="gray.300">Email</FormLabel>
            <Input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="gray.700"
              border="1px"
              borderColor="gray.600"
              _hover={{ borderColor: "brand.200" }}
              _focus={{ borderColor: "brand.200", boxShadow: "none" }}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel color="gray.300">Password</FormLabel>
            <Input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.700"
              border="1px"
              borderColor="gray.600"
              _hover={{ borderColor: "brand.200" }}
              _focus={{ borderColor: "brand.200", boxShadow: "none" }}
              required
            />
          </FormControl>

          <Button 
            type="submit"
            colorScheme="brand"
            size="lg"
            width="100%"
            isLoading={loading}
            loadingText="Signing In"
          >
            Sign In
          </Button>
        </VStack>
      </form>
    </Box>
  );
}; 