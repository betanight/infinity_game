import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillModal } from '../SkillModal';

const mockSkill = {
  label: 'Test Skill',
  description: 'A test skill description',
  value: 1,
  tier: 'tier1',
  category: 'test',
  stat: 'Arcane'
};

describe('SkillModal', () => {
  const mockOnClose = jest.fn();
  const mockOnUpgrade = jest.fn();
  const mockOnDowngrade = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders skill information correctly', () => {
    render(
      <SkillModal
        skill={mockSkill}
        availablePoints={5}
        onClose={mockOnClose}
        onUpgrade={mockOnUpgrade}
        onDowngrade={mockOnDowngrade}
      />
    );

    expect(screen.getByText('Test Skill')).toBeInTheDocument();
    expect(screen.getByText('A test skill description')).toBeInTheDocument();
    expect(screen.getByText('Current Level:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Available Points:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles upgrade buttons correctly', () => {
    render(
      <SkillModal
        skill={mockSkill}
        availablePoints={10}
        onClose={mockOnClose}
        onUpgrade={mockOnUpgrade}
        onDowngrade={mockOnDowngrade}
      />
    );

    // Test +1 button
    fireEvent.click(screen.getByText('+1'));
    expect(mockOnUpgrade).toHaveBeenCalledWith('Arcane', 'tier1', 'test', 'Test Skill', 1);

    // Test +5 button
    fireEvent.click(screen.getByText('+5'));
    expect(mockOnUpgrade).toHaveBeenCalledWith('Arcane', 'tier1', 'test', 'Test Skill', 5);

    // Test Max button
    fireEvent.click(screen.getByText('Max'));
    expect(mockOnUpgrade).toHaveBeenCalledWith('Arcane', 'tier1', 'test', 'Test Skill', 10);
  });

  it('handles downgrade buttons correctly', () => {
    render(
      <SkillModal
        skill={mockSkill}
        availablePoints={5}
        onClose={mockOnClose}
        onUpgrade={mockOnUpgrade}
        onDowngrade={mockOnDowngrade}
      />
    );

    // Test -1 button
    fireEvent.click(screen.getByText('-1'));
    expect(mockOnDowngrade).toHaveBeenCalledWith('Arcane', 'tier1', 'test', 'Test Skill', 1);

    // Test -5 button
    fireEvent.click(screen.getByText('-5'));
    expect(mockOnDowngrade).toHaveBeenCalledWith('Arcane', 'tier1', 'test', 'Test Skill', 5);

    // Test Reset button
    fireEvent.click(screen.getByText('Reset'));
    expect(mockOnDowngrade).toHaveBeenCalledWith('Arcane', 'tier1', 'test', 'Test Skill', 'reset');
  });

  it('disables upgrade buttons when no points available', () => {
    render(
      <SkillModal
        skill={mockSkill}
        availablePoints={0}
        onClose={mockOnClose}
        onUpgrade={mockOnUpgrade}
        onDowngrade={mockOnDowngrade}
      />
    );

    const plusOneButton = screen.getByText('+1');
    const plusFiveButton = screen.getByText('+5');
    const maxButton = screen.getByText('Max');

    expect(plusOneButton).toBeDisabled();
    expect(plusFiveButton).toBeDisabled();
    expect(maxButton).toBeDisabled();
  });

  it('disables downgrade buttons when skill value is 0', () => {
    render(
      <SkillModal
        skill={{ ...mockSkill, value: 0 }}
        availablePoints={5}
        onClose={mockOnClose}
        onUpgrade={mockOnUpgrade}
        onDowngrade={mockOnDowngrade}
      />
    );

    const minusOneButton = screen.getByText('-1');
    const minusFiveButton = screen.getByText('-5');
    const resetButton = screen.getByText('Reset');

    expect(minusOneButton).toBeDisabled();
    expect(minusFiveButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <SkillModal
        skill={mockSkill}
        availablePoints={5}
        onClose={mockOnClose}
        onUpgrade={mockOnUpgrade}
        onDowngrade={mockOnDowngrade}
      />
    );

    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 