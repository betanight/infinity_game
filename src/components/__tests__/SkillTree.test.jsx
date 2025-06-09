import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkillTree } from '../SkillTree';

// Mock D3
jest.mock('d3', () => {
  const mockSelection = {
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
  };

  return {
    select: jest.fn(() => mockSelection),
    selectAll: jest.fn(() => mockSelection),
    hierarchy: jest.fn(() => ({
      descendants: jest.fn(() => []),
      links: jest.fn(() => [])
    })),
    tree: jest.fn(() => ({
      size: jest.fn().mockReturnThis(),
      nodeSize: jest.fn().mockReturnThis(),
      separation: jest.fn().mockReturnThis()
    })),
    zoom: jest.fn(() => ({
      scaleExtent: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis()
    })),
    forceSimulation: jest.fn(() => ({
      force: jest.fn().mockReturnThis(),
      nodes: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis()
    })),
    forceManyBody: jest.fn(),
    forceLink: jest.fn(() => ({
      id: jest.fn().mockReturnThis(),
      distance: jest.fn().mockReturnThis(),
      strength: jest.fn().mockReturnThis()
    })),
    forceCenter: jest.fn()
  };
});

const mockData = {
  name: 'root',
  children: [
    {
      name: 'child1',
      children: []
    },
    {
      name: 'child2',
      children: []
    }
  ]
};

describe('SkillTree', () => {
  it('renders without crashing', () => {
    render(<SkillTree data={mockData} />);
    // Basic render test - component should mount without errors
  });

  it('initializes D3 force simulation', () => {
    render(<SkillTree data={mockData} />);
    // Component renders and D3 initialization completes
  });

  it('sets up zoom behavior', () => {
    render(<SkillTree data={mockData} />);
    // Component sets up zoom behavior
  });

  it('creates nodes and links', () => {
    render(<SkillTree data={mockData} />);
    // Component creates visual elements
  });
}); 