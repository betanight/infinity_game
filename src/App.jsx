import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { TestCharacterPage } from './test/TestCharacterPage';
import { SkillTreePage } from './pages/SkillTreePage';
import { Navigation } from './components/Navigation';
import theme from './theme';

export const App = () => {
  return (
    <GoogleOAuthProvider clientId="120929977477-2vv2g8tco7f7b7d7q9q9q9q9q9q9q9q9.apps.googleusercontent.com">
      <ChakraProvider theme={theme}>
        <BrowserRouter basename="/betanight/infinity_gam">
          <Flex direction="column" minH="100vh">
            <Navigation />
            <Box flex="1" p={4}>
              <Routes>
                <Route path="/" element={<TestCharacterPage />} />
                <Route path="/skilltree" element={<SkillTreePage />} />
                <Route path="/skilltree/:statType" element={<SkillTreePage />} />
              </Routes>
            </Box>
          </Flex>
        </BrowserRouter>
      </ChakraProvider>
    </GoogleOAuthProvider>
  );
}; 