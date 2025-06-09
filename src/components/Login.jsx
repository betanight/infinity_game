import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, isUserAdmin } from '../firebase/firebase';

export const Login = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    console.log('Google login success:', credentialResponse);
    
    try {
      // Create a credential from the Google ID token
      const credential = GoogleAuthProvider.credential(credentialResponse.credential);
      
      // Sign in with Firebase using the Google credential
      const result = await signInWithCredential(auth, credential);
      const isAdmin = await isUserAdmin(result.user);
      
      console.log('Firebase login success:', {
        user: result.user,
        isAdmin
      });
      
      toast({
        title: 'Login successful',
        description: `Welcome ${result.user.displayName}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
    toast({
      title: 'Login failed',
      description: 'Could not sign in with Google',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg="gray.900"
        borderColor="brand.500"
        borderWidth="1px"
        boxShadow="0 4px 20px rgba(124, 77, 255, 0.2)"
      >
        <ModalHeader
          bgGradient="linear(to-r, brand.200, brand.400)"
          bgClip="text"
        >
          Login to Infinity Game
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text align="center" color="whiteAlpha.700">
              Sign in with your Google account to continue
            </Text>
            <Box w="full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                size="large"
                width="100%"
                text="continue_with"
                context="signin"
                data-use_fedcm_for_prompt="true"
                data-use_fedcm_for_button="true"
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}; 