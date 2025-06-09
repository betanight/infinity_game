import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { CharacterTemplate } from '../CharacterTemplate';
import { ref, get, set } from 'firebase/database';

// Mock Firebase modules
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  get: jest.fn(),
  set: jest.fn()
}));

jest.mock('../../../firebase/firebase', () => ({
  db: {}
}));

const mockCharacter = {
  meta: {
    character_id: 'test-id',
    level: 1,
    experience: 0,
    experience_to_next: 1000
  },
  primary_scores: {
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10
  },
  secondary_scores: {
    Willpower: 5,
    Spirit: 5,
    Arcane: 5,
    Presence: 5
  },
  skills: {
    Strength: {},
    Dexterity: {},
    Constitution: {},
    Intelligence: {},
    Wisdom: {},
    Charisma: {},
    Willpower: {},
    Spirit: {},
    Arcane: {},
    Presence: {}
  }
};

describe('CharacterTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ref.mockImplementation((db, path) => ({ path }));
    set.mockImplementation(() => Promise.resolve());
  });

  it('displays character data', () => {
    render(<CharacterTemplate character={mockCharacter} />);
    expect(screen.getByText('Character Info')).toBeInTheDocument();
    expect(screen.getByText('Level: 1')).toBeInTheDocument();
    expect(screen.getByText('0 / 1000 XP')).toBeInTheDocument();
  });

  it('handles score updates', async () => {
    render(<CharacterTemplate character={mockCharacter} />);

    // Find and click strength increment button
    const strengthRow = screen.getByText('Strength').closest('div');
    const buttons = strengthRow.querySelectorAll('button');
    const incrementButton = buttons[1]; // Second button should be increment

    await act(async () => {
      fireEvent.click(incrementButton);
    });

    // Verify Firebase update was called with updated strength value
    expect(set).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        primary_scores: expect.objectContaining({
          Strength: 11
        })
      })
    );
  });

  it('handles experience gain', async () => {
    render(<CharacterTemplate character={mockCharacter} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Add XP'));
    });

    // Verify Firebase update was called with updated experience
    expect(set).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        meta: expect.objectContaining({
          experience: 100,
          level: 1
        })
      })
    );
  });

  it('shows error state when update fails', async () => {
    const errorMessage = 'Failed to update';
    set.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    render(<CharacterTemplate character={mockCharacter} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Add XP'));
    });

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('shows no data message when character is null', () => {
    render(<CharacterTemplate character={null} />);
    expect(screen.getByText('No character data available')).toBeInTheDocument();
  });
}); 