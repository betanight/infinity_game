import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  Button, 
  useToast,
  Input,
  Select,
  Grid,
  Text,
  Flex,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { firebaseConfig } from "./skilltree/src/firebaseConfig.js"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get } from "firebase/database"
import { auth, provider, signInWithPopup, onAuthStateChanged } from "./skilltree/src/auth.js"
import { CharacterTemplate } from '../components/CharacterTemplate'
import { SkillTreePage } from '../pages/SkillTreePage'
import { TestCharacterPage } from '../test/TestCharacterPage'

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

function App() {
  const [user, setUser] = useState(null)
  const [primaryStats, setPrimaryStats] = useState([])
  const [skillsData, setSkillsData] = useState({})
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        checkAdminAndSetupEquipment(user)
        loadUserCharacters(user.uid)
      }
    })

    loadTemplate()
    return () => unsubscribe()
  }, [])

  async function handleSignIn() {
    try {
      const result = await signInWithPopup(auth, provider)
      toast({
        title: "Success",
        description: `Signed in as ${result.user.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  async function handleSignOut() {
    try {
      await auth.signOut()
      toast({
        title: "Success",
        description: "Signed out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  async function checkAdminAndSetupEquipment(user) {
    try {
      const adminSnapshot = await get(ref(db, `admins/${user.uid}`))
      const isAdmin = adminSnapshot.val() === true
      const isSpecialUser = user.uid === "ch1yWOwbx7h2QUXQsSjj0pqVw8d2"

      if (isAdmin || isSpecialUser) {
        // Setup equipment creator UI
      }
    } catch (err) {
      console.error("Error checking admin status:", err)
      toast({
        title: "Error",
        description: "Failed to check admin status",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  async function loadTemplate() {
    try {
      const templateSnapshot = await get(ref(db, "template"))
      const template = templateSnapshot.val()
      
      if (!template || !template.primary_scores) {
        throw new Error("Template missing or malformed")
      }

      setPrimaryStats(Object.keys(template.primary_scores))
      
      const skillsSnapshot = await get(ref(db, "template/skills"))
      const skills = skillsSnapshot.val()
      
      if (!skills) {
        throw new Error("No skill data found in template")
      }

      setSkillsData(skills)
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  async function loadUserCharacters(userId) {
    try {
      const charactersRef = ref(db, 'characters')
      const snapshot = await get(charactersRef)
      if (snapshot.exists()) {
        const allCharacters = snapshot.val()
        // Don't filter by userId for now since it's not in the data structure
        const userCharacters = Object.entries(allCharacters)
          .map(([id, data]) => ({
            id,
            ...data
          }))
        setCharacters(userCharacters)
        if (userCharacters.length > 0) {
          setSelectedCharacter(userCharacters[0])
        }
      }
    } catch (err) {
      console.error('Error loading characters:', err)
      toast({
        title: 'Error',
        description: 'Failed to load characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
        <Text color="white">Loading...</Text>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.900">
      <Box bg="gray.800" py={4} px={8} borderBottom="1px" borderColor="gray.700">
        <Flex align="center">
          <Heading color="white">Infinity Game Dashboard</Heading>
          <Spacer />
          {user ? (
            <Button colorScheme="red" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button colorScheme="blue" onClick={handleSignIn}>
              Sign in with Google
            </Button>
          )}
        </Flex>
      </Box>

      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/" element={
            user ? (
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={8}>
                <Box bg="gray.800" p={6} borderRadius="lg">
                  <Heading size="md" mb={4}>Create Character</Heading>
                  <VStack spacing={4} align="stretch">
                    <Input 
                      placeholder="Character Name"
                      bg="gray.700"
                      border="none"
                    />
                    {primaryStats.map(stat => (
                      <Select 
                        key={stat}
                        placeholder={`Choose ${stat} skill`}
                        bg="gray.700"
                        border="none"
                      >
                        {skillsData[stat] && Object.keys(skillsData[stat]).map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </Select>
                    ))}
                    <Button colorScheme="blue" size="lg">
                      Create Character
                    </Button>
                  </VStack>
                </Box>

                <Box bg="gray.800" p={6} borderRadius="lg">
                  <Heading size="md" mb={4}>Characters</Heading>
                  <VStack spacing={4} align="stretch">
                    {characters.map(char => (
                      <Box 
                        key={char.id} 
                        p={4} 
                        bg={selectedCharacter?.id === char.id ? "blue.800" : "gray.700"} 
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => setSelectedCharacter(char)}
                      >
                        <Text fontSize="lg">{char.meta?.character_id || 'Unnamed Character'}</Text>
                        <Text fontSize="sm" color="gray.400">Level {char.meta?.level || 1}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                <Box bg="gray.800" p={6} borderRadius="lg" gridColumn="1/-1">
                  <Heading size="md" mb={4}>Character Panel</Heading>
                  {selectedCharacter && (
                    <CharacterTemplate 
                      character={selectedCharacter} 
                      onNavigate={navigate}
                    />
                  )}
                </Box>
              </Grid>
            ) : (
              <Box textAlign="center" color="white">
                <Heading size="lg">Welcome to Infinity Game</Heading>
                <Text mt={4}>Please sign in to continue</Text>
              </Box>
            )
          } />
          <Route path="/skilltree" element={<SkillTreePage />} />
          <Route path="/skilltree/:statType" element={<SkillTreePage />} />
          <Route path="/test" element={<TestCharacterPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App 