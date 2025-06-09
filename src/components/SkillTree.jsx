import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Box,
  useColorModeValue,
  Tooltip,
  Text,
  VStack,
  Badge,
  useToken,
  Heading,
} from '@chakra-ui/react';

export const SkillTree = ({ 
  characterData,
  statType,
  onSkillClick,
  width = 800,
  height = 600 
}) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const gridColor = useColorModeValue('whiteAlpha.100', 'whiteAlpha.100');
  
  const [skillColor] = useToken('colors', [`skill.${statType?.toLowerCase?.() || ''}.base`]);
  const [skillColorDark] = useToken('colors', [`skill.${statType?.toLowerCase?.() || ''}.dark`]);

  useEffect(() => {
    if (!characterData || !statType || !characterData.skills[statType]) return;

    // Clear previous tree
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add a subtle grid pattern
    const defs = svg.append("defs");
    
    // Grid pattern
    const pattern = defs.append("pattern")
      .attr("id", "grid")
      .attr("width", 50)
      .attr("height", 50)
      .attr("patternUnits", "userSpaceOnUse");

    pattern.append("path")
      .attr("d", "M 50 0 L 0 0 0 50")
      .attr("fill", "none")
      .attr("stroke", gridColor)
      .attr("stroke-width", "0.5");

    // Radial gradient for nodes
    const radialGradient = defs.append("radialGradient")
      .attr("id", "nodeGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    radialGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", skillColor);

    radialGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", skillColorDark);

    // Background grid
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", `url(#grid)`);

    // Get skills for this stat type
    const skills = characterData.skills[statType];
    if (!skills) return;

    // Create nodes array from skills
    let nodes = [];
    if (statType === 'Arcane' || statType === 'Willpower' || statType === 'Spirit' || statType === 'Presence') {
      // Handle tiered skills
      Object.entries(skills).forEach(([tier, tierData]) => {
        Object.entries(tierData).forEach(([category, categoryData]) => {
          if (typeof categoryData === 'object') {
            Object.entries(categoryData).forEach(([skillName, skillData]) => {
              nodes.push({
                id: `${tier}/${category}/${skillName}`,
                name: skillName,
                value: skillData.effective_value || 0,
                description: skillData.description || '',
                tier: tier,
                category: category,
                tags: skillData.tags || [],
              });
            });
          }
        });
      });
    } else {
      // Handle regular skills
      nodes = Object.entries(skills).map(([name, data]) => ({
        id: name,
        name,
        value: data.effective_value || 0,
        description: data.description || '',
        boost: data.boost || [],
      }));
    }

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create links between nodes based on tiers/categories
    const links = [];
    if (statType === 'Arcane' || statType === 'Willpower' || statType === 'Spirit' || statType === 'Presence') {
      // Group nodes by tier and category
      const nodesByTier = {};
      nodes.forEach(node => {
        const [tier, category] = node.id.split('/');
        if (!nodesByTier[tier]) nodesByTier[tier] = {};
        if (!nodesByTier[tier][category]) nodesByTier[tier][category] = [];
        nodesByTier[tier][category].push(node);
      });

      // Create links within each tier and category
      Object.entries(nodesByTier).forEach(([tier, categories]) => {
        Object.entries(categories).forEach(([category, categoryNodes]) => {
          for (let i = 0; i < categoryNodes.length - 1; i++) {
            links.push({
              source: categoryNodes[i].id,
              target: categoryNodes[i + 1].id
            });
          }
        });
      });
    } else {
      // Create simple chain for regular skills
      for (let i = 0; i < nodes.length - 1; i++) {
        links.push({
          source: nodes[i].id,
          target: nodes[i + 1].id
        });
      }
    }

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", skillColorDark)
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);

    // Create node groups
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", `url(#nodeGradient)`)
      .attr("stroke", skillColor)
      .attr("stroke-width", 2)
      .attr("cursor", "pointer");

    // Add text labels
    nodeGroup.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .attr("fill", "white")
      .style("font-size", "12px");

    // Add level indicators
    nodeGroup.append("text")
      .text(d => d.value)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", "white")
      .style("font-size", "14px")
      .style("font-weight", "bold");

    // Handle node click
    nodeGroup.on("click", (event, d) => {
      event.stopPropagation();
      onSkillClick(d);
    });

    // Handle node hover
    nodeGroup
      .on("mouseenter", (event, d) => {
        setTooltip({
          visible: true,
          content: `${d.name}\n${d.description}\nLevel: ${d.value}${d.boost ? `\nBoosts: ${d.boost.join(', ')}` : ''}`,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on("mouseleave", () => {
        setTooltip({ visible: false, content: '', x: 0, y: 0 });
      });

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [characterData, statType, width, height, skillColor, skillColorDark, gridColor, onSkillClick]);

  return (
    <Box position="relative" width={width} height={height}>
      <Heading size="md" mb={4} color="brand.200">{statType} Skill Tree</Heading>
      <svg ref={svgRef} />
      {tooltip.visible && (
        <Box
          position="fixed"
          top={tooltip.y + 10}
          left={tooltip.x + 10}
          bg="gray.800"
          color="white"
          p={2}
          borderRadius="md"
          boxShadow="lg"
          maxW="300px"
          zIndex={1000}
        >
          <VStack align="start" spacing={1}>
            {tooltip.content.split('\n').map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
}; 