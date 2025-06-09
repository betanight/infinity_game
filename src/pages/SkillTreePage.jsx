import React, { useEffect, useCallback, useState } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, useToken } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getCharacterData } from '../frontend/skilltree/levelUp/levelingFunctions.js';
import { getDatabase, ref, get } from "firebase/database";
import { PrimaryNode, SkillNode, CategoryNode } from '../components/nodes/CustomNodes';

// Helper function to generate unique IDs for edges
const generateUniqueId = (base) => `${base}-${Date.now()}-${Math.random()}`;

const brightColors = {
  Arcane: "#c18cff",
  Willpower: "#ff2e2e",
  Spirit: "#8fe8ff",
  Presence: "#ffec88",
  Strength: "#66ffff",
  Dexterity: "#ff6b6b",
  Constitution: "#5f8dff",
  Intelligence: "#5cf87b",
  Wisdom: "#ffd94a",
  Charisma: "#ffb566",
};

const dullColors = {
  Arcane: "#2f2044",
  Willpower: "#3a1010",
  Spirit: "#1e3a44",
  Presence: "#5e5023",
  Strength: "#1a4f4f",
  Dexterity: "#4d1e1e",
  Constitution: "#1a2a66",
  Intelligence: "#1d4c29",
  Wisdom: "#665b23",
  Charisma: "#4c2f1a",
};

const mysticalStats = ["Presence", "Spirit", "Willpower", "Arcane"];
const primaryStats = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

// Custom node styles with glassmorphism
const nodeStyles = {
  primary: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    padding: '20px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    width: 90,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      transform: 'translateY(-2px)',
    }
  },
  skill: {
    background: 'rgba(100, 100, 100, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    padding: '8px',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(3px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    }
  },
  category: {
    background: 'rgba(100, 100, 100, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    padding: '10px',
    color: 'white',
    fontSize: '16px',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backdropFilter: 'blur(3px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    }
  }
};

// Custom edge styles with animation
const edgeStyles = {
  stroke: 'rgba(255, 255, 255, 0.2)',
  strokeWidth: 2,
  animated: true,
};

// Node types registration
const nodeTypes = {
  primary: PrimaryNode,
  skill: SkillNode,
  category: CategoryNode
};

function getTierVisibility(rank) {
  // Simple mapping of ranks to visible tiers
  switch(rank[0]) { // Get first character of rank (ignoring +/-)
    case 'S':
    case 'A':
      return {
        tier1: true,
        tier2: true,
        tier3: true,
        tier4: true,
        tier5: true,
        finalTier: rank === 'SS+' // Only SS+ can see final tier
      };
    case 'B':
      return {
        tier1: true,
        tier2: true,
        tier3: true,
        tier4: false,
        tier5: false,
        finalTier: false
      };
    case 'C':
      return {
        tier1: true,
        tier2: true,
        tier3: false,
        tier4: false,
        tier5: false,
        finalTier: false
      };
    case 'D':
    case 'E':
      return {
        tier1: true,
        tier2: true,
        tier3: false,
        tier4: false,
        tier5: false,
        finalTier: false
      };
    default: // F, G or no rank
      return {
        tier1: true,
        tier2: false,
        tier3: false,
        tier4: false,
        tier5: false,
        finalTier: false
      };
  }
}

// Add a deterministic random number generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const SkillTreePage = () => {
  const { statType } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [brand200] = useToken('colors', ['brand.200']);
  const [selectedTab, setSelectedTab] = useState(0);
  const db = getDatabase();

  // Add zoom settings at component level
  const [minZoom, setMinZoom] = useState(0.01);
  const [maxZoom, setMaxZoom] = useState(3);

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const calculateNodeColor = (stat, value, maxValue = 100) => {
    const bright = brightColors[stat];
    const dull = dullColors[stat];
    
    if (value === 0) return dull;
    
    // Create color gradient based on value
    const ratio = value / maxValue;
    const brightRGB = hexToRGB(bright);
    const dullRGB = hexToRGB(dull);
    
    const r = Math.round(dullRGB.r + (brightRGB.r - dullRGB.r) * ratio);
    const g = Math.round(dullRGB.g + (brightRGB.g - dullRGB.g) * ratio);
    const b = Math.round(dullRGB.b + (brightRGB.b - dullRGB.b) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const loadPrimarySkillTree = async (characterData) => {
    try {
      const templateSnapshot = await get(ref(db, "template/skills"));
      const template = templateSnapshot.val();
      
      if (!template) {
        console.error("No template data found");
        return;
      }

      // Get visible tiers based on character rank
      console.log("🎯 Character rank:", characterData.meta?.rank);
      const visibleTiers = getTierVisibility(characterData.meta?.rank || "G-");
      console.log("🎯 Visible tiers:", visibleTiers);

      const width = 8000; // Match new SVG viewBox width
      const height = 8000; // Match new SVG viewBox height
      const newNodes = [];
      const newEdges = [];
      const baseRadius = 800;
      const statSpacing = (2 * Math.PI) / primaryStats.length;
      
      // Position primary stats in a circle
      primaryStats.forEach((stat, index) => {
        const statAngle = index * statSpacing - Math.PI / 2; // Start from top
        const position = {
          x: Math.cos(statAngle) * baseRadius + width/2,
          y: Math.sin(statAngle) * baseRadius + height/2
        };
        
        const value = characterData.primary_scores[stat] || 0;
        
        newNodes.push({
          id: stat,
          data: { 
            label: `${stat}\n${value}`,
            value: value
          },
          position,
          style: {
            ...nodeStyles.primary,
            background: calculateNodeColor(stat, value)
          },
          type: 'primary'
        });

        if (!template[stat]) return;

        // Get visible tiers for this stat
        const visibleTiersList = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Final Tier"].filter(tier => {
          const tierNum = tier === "Final Tier" ? "finalTier" : `tier${tier.split(" ")[1]}`;
          return visibleTiers[tierNum];
        });

        // Add tier nodes branching outward in the stat's direction
        visibleTiersList.forEach((tier, tierIndex) => {
          // Calculate tier position with exponential growth
          const tierSpacing = 600 * Math.pow(1.5, tierIndex); // Much larger base spacing (was 400)
          const tierRadius = baseRadius + tierSpacing;
          
          const tierNode = {
            id: `${stat}-${tier}`,
            data: {
              label: `Tier ${tier.split(" ")[1]}`
            },
            position: {
              x: Math.cos(statAngle) * tierRadius + width/2,
              y: Math.sin(statAngle) * tierRadius + height/2
            },
            style: {
              ...nodeStyles.category,
              background: `linear-gradient(135deg, ${brightColors[stat]}, ${dullColors[stat]})`,
              opacity: 0.4 + (tierIndex * 0.2),
              boxShadow: `0 0 ${10 + (tierIndex * 5)}px ${brightColors[stat]}40`
            },
            type: 'category'
          };
          newNodes.push(tierNode);

          // Add skills for this tier in a mini-constellation
          if (template[stat]?.[tier]) {
            const skills = Object.entries(template[stat][tier]);
            const skillSpacing = (2 * Math.PI) / skills.length;
            
            skills.forEach(([skill, skillData], skillIndex) => {
              // Position skills in a complete circle around the tier node
              const skillAngle = skillIndex * skillSpacing;
              const skillRadius = 300 * Math.pow(1.5, tierIndex); // Increased from 200 for wider skill orbits
              
              const skillPosition = {
                x: Math.cos(skillAngle) * skillRadius + tierNode.position.x,
                y: Math.sin(skillAngle) * skillRadius + tierNode.position.y
              };

              const skillValue = characterData.skills?.[stat]?.[tier]?.[skill] || 0;
              const tierBrightness = 0.4 + (tierIndex * 0.2); // Same brightness factor as tier node

              newNodes.push({
                id: `${stat}-${tier}-${skill}`,
                data: { 
                  tooltip: skill,
                  value: skillValue,
                  description: skillData.description || "",
                  tier: tier
                },
                position: skillPosition,
                style: {
                  ...nodeStyles.skill,
                  background: `linear-gradient(135deg, ${brightColors[stat]}, ${dullColors[stat]})`,
                  opacity: tierBrightness,
                  boxShadow: `0 0 ${5 + (tierIndex * 3)}px ${brightColors[stat]}40`
                },
                type: 'skill'
              });

              // Connect skill to its tier with nearly invisible lines
              newEdges.push({
                id: generateUniqueId(`${stat}-${tier}-${skill}-edge`),
                source: `${stat}-${tier}`,
                target: `${stat}-${tier}-${skill}`,
                style: {
                  ...edgeStyles,
                  stroke: brightColors[stat],
                  opacity: 0.08 + (tierIndex * 0.04)
                },
                type: 'default'
              });

              // Add connection between tiers with minimal visibility
              if (tierIndex > 0) {
                const prevTier = visibleTiersList[tierIndex - 1];
                newEdges.push({
                  id: generateUniqueId(`${stat}-${prevTier}-to-${tier}`),
                  source: `${stat}-${prevTier}`,
                  target: `${stat}-${tier}`,
                  style: {
                    ...edgeStyles,
                    stroke: brightColors[stat],
                    opacity: 0.12 + (tierIndex * 0.06),
                    strokeWidth: 1.5
                  },
                  type: 'default'
                });
              }

              // Remove prerequisite connections
              // Commenting out the prerequisite section entirely
              /*
              if (skillData.prerequisites?.length > 0) {
                skillData.prerequisites.forEach(prereq => {
                  const prereqTier = findPrereqTier(template[stat], prereq.skill);
                  const prereqTierNum = prereqTier === "Final Tier" ? "finalTier" : `tier${prereqTier.split(" ")[1]}`;
                  
                  if (visibleTiers[prereqTierNum]) {
                    newEdges.push({
                      id: `${stat}-${prereqTier}-${prereq.skill}-${tier}-${skill}-prereq`,
                      source: `${stat}-${prereqTier}-${prereq.skill}`,
                      target: `${stat}-${tier}-${skill}`,
                      style: {
                        ...edgeStyles,
                        stroke: 'rgba(255, 82, 82, 0.3)',
                        strokeDasharray: '3,7'
                      },
                      type: 'default'
                    });
                  }
                });
              }
              */
            });
          }
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error('Error loading primary skill tree:', error);
    }
  };

  // Helper function to find which tier a skill belongs to
  function findPrereqTier(statTemplate, skillName) {
    for (const tier in statTemplate) {
      if (statTemplate[tier]?.[skillName]) {
        return tier;
      }
    }
    return "Tier 1"; // Default to Tier 1 if not found
  }

  const loadMysticalSkillTree = async (characterData, statType) => {
    try {
      // Get visible tiers based on character rank
      console.log("🎯 Character rank:", characterData.meta?.rank);
      const visibleTiers = getTierVisibility(characterData.meta?.rank || "G-");
      console.log("🎯 Visible tiers:", visibleTiers);

      // Get all tiers that should be visible
      const visibleTiersList = ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Final Tier"].filter(tier => {
        const tierNum = tier === "Final Tier" ? "finalTier" : `tier${tier.split(" ")[1]}`;
        return visibleTiers[tierNum];
      });

      console.log("🎯 Visible tiers list:", visibleTiersList);

      const newNodes = [];
      const newEdges = [];
      
      // Add central stat node
      const value = characterData.secondary_scores[statType] || 0;
      newNodes.push({
        id: statType,
        data: { 
          label: `${statType}\n${value}`,
          value: value
        },
        position: { x: 500, y: 500 },
        style: {
          ...nodeStyles.primary,
          background: calculateNodeColor(statType, value)
        },
        type: 'primary'
      });

      // Process each visible tier
      let yOffset = 400;
      for (const tier of visibleTiersList) {
        try {
          const templateSnapshot = await get(ref(db, `template/skills/${statType}/${tier}`));
          const skillData = templateSnapshot.val();
          
          if (!skillData) {
            console.log(`No skill data found for ${statType} ${tier}`);
            continue;
          }

          // Add tier node
          const tierNode = {
            id: `${statType}-${tier}`,
            data: {
              label: tier
            },
            position: { x: 500, y: yOffset },
            style: {
              ...nodeStyles.category,
              background: calculateNodeColor(statType, value)
            },
            type: 'category'
          };
          newNodes.push(tierNode);

          // Connect tier to stat or previous tier
          const prevTier = visibleTiersList[visibleTiersList.indexOf(tier) - 1];
          const source = prevTier ? `${statType}-${prevTier}` : statType;
          newEdges.push({
            id: generateUniqueId(`${statType}-${tier}-edge`),
            source: source,
            target: `${statType}-${tier}`,
            style: {
              ...edgeStyles,
              stroke: calculateNodeColor(statType, value)
            },
            type: 'smoothstep'
          });

          // Add category nodes in a circle
          const categories = Object.keys(skillData);
          const categoryRadius = 250;
          
          categories.forEach((category, categoryIndex) => {
            const categoryAngle = (categoryIndex * 2 * Math.PI) / categories.length;
            const categoryX = 500 + Math.cos(categoryAngle) * categoryRadius;
            const categoryY = yOffset + Math.sin(categoryAngle) * categoryRadius;

            // Add category node
            const categoryNode = {
              id: `${statType}-${tier}-${category}`,
              data: {
                label: category
              },
              position: { x: categoryX, y: categoryY },
              style: {
                ...nodeStyles.category,
                background: calculateNodeColor(statType, value)
              },
              type: 'category'
            };
            newNodes.push(categoryNode);

            // Connect category to tier
            newEdges.push({
              id: generateUniqueId(`${statType}-${tier}-${category}-edge`),
              source: `${statType}-${tier}`,
              target: `${statType}-${tier}-${category}`,
              style: {
                ...edgeStyles,
                stroke: calculateNodeColor(statType, value)
              },
              type: 'smoothstep'
            });

            // Add skills for this category
            const skills = Object.entries(skillData[category]);
            const skillRadius = 150;
            const skillSpacing = (Math.PI / 2) / Math.max(skills.length, 1);
            const startAngle = categoryAngle - Math.PI / 4;

            skills.forEach(([skillName, skillData], skillIndex) => {
              const skillAngle = startAngle + (skillIndex * skillSpacing);
              const skillX = categoryX + Math.cos(skillAngle) * skillRadius;
              const skillY = categoryY + Math.sin(skillAngle) * skillRadius;

              // Get skill level from character data if it exists
              const skillValue = characterData.skills?.[statType]?.[tier]?.[category]?.[skillName] || 0;

              const skillNode = {
                id: `${statType}-${tier}-${category}-${skillName}`,
                data: {
                  label: skillName,
                  value: skillValue,
                  description: skillData.description || "",
                  tier: tier
                },
                position: { x: skillX, y: skillY },
                style: {
                  ...nodeStyles.skill,
                  background: calculateNodeColor(statType, skillValue)
                },
                type: 'skill'
              };
              newNodes.push(skillNode);

              // Connect skill to category
              newEdges.push({
                id: generateUniqueId(`${category}-${skillName}-edge`),
                source: `${statType}-${tier}-${category}`,
                target: `${statType}-${tier}-${category}-${skillName}`,
                style: {
                  ...edgeStyles,
                  stroke: calculateNodeColor(statType, skillValue)
                },
                type: 'smoothstep'
              });
            });
          });

          yOffset += 300; // Increase vertical spacing between tiers
        } catch (error) {
          console.error(`Error loading tier ${tier}:`, error);
        }
      }

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error('Error loading mystical skill tree:', error);
    }
  };

  // Add the useEffect hook before the return statement
  useEffect(() => {
    const loadCharacter = async () => {
      const params = new URLSearchParams(window.location.search);
      const charId = params.get('char');
      
      if (!charId) {
        console.error('No character ID provided');
        return;
      }

      try {
        const characterData = await getCharacterData(charId);
        
        if (selectedTab === 0) {
          await loadPrimarySkillTree(characterData);
        } else {
          const statType = mysticalStats[selectedTab - 1];
          await loadMysticalSkillTree(characterData, statType);
        }

      } catch (error) {
        console.error('Error loading character data:', error);
      }
    };

    loadCharacter();
  }, [selectedTab, db]);

  return (
    <Box position="relative" width="100vw" height="100vh">
      <Tabs 
        position="absolute" 
        left={4} 
        top={4} 
        zIndex={1} 
        orientation="vertical"
        onChange={setSelectedTab}
        variant="solid-rounded"
        colorScheme="brand"
      >
        <TabList>
          <Tab>Primary Skills</Tab>
          <Tab _selected={{ bg: dullColors.Presence }}>Presence</Tab>
          <Tab _selected={{ bg: dullColors.Spirit }}>Spirit</Tab>
          <Tab _selected={{ bg: dullColors.Willpower }}>Willpower</Tab>
          <Tab _selected={{ bg: dullColors.Arcane }}>Arcane</Tab>
        </TabList>
      </Tabs>
      
      <Box width="100%" height="100%" style={{ position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={minZoom}
          maxZoom={maxZoom}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          attributionPosition="bottom-left"
          style={{
            backgroundColor: '#111',
            width: '100%',
            height: '100%'
          }}
        >
          <Background 
            variant="dots"
            gap={16} 
            size={1}
            color={brand200}
            style={{ opacity: 0.05 }}
          />
          <Controls />
          <MiniMap 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            nodeColor={(node) => {
              switch (node.type) {
                case 'primary':
                  return node.style.background;
                case 'category':
                  return 'rgba(150, 150, 150, 0.3)';
                case 'skill':
                  return node.style.background;
                default:
                  return '#fff';
              }
            }}
          />
        </ReactFlow>
      </Box>
    </Box>
  );
};
