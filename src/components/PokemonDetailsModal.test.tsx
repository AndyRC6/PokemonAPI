import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PokemonDetailsModal } from './PokemonDetailsModal';
import * as useGetPokemonsHook from '../hooks/useGetPokemons';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/useGetPokemons');

const mockUseGetPokemonDetails = useGetPokemonsHook.useGetPokemonDetails as jest.MockedFunction<
  typeof useGetPokemonsHook.useGetPokemonDetails
>;

const renderWithRouter = (component: React.ReactElement) =>
  render(
    <MemoryRouter initialEntries={['/list/pokemon/25']}>
      <Routes>
        <Route path="/list/pokemon/:id" element={component} />
      </Routes>
    </MemoryRouter>,
  );

describe('PokemonDetailsModal', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  const mockPokemonData = {
    id: '25',
    name: 'Pikachu',
    sprite: 'https://example.com/pikachu.png',
    types: ['electric'],
    captureRate: 190,
    weight: 60,
    height: 4,
    stats: [
      { baseStat: 35, statName: 'hp' },
      { baseStat: 55, statName: 'attack' },
    ],
  };

  it('should display loading state initially', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: null,
      loading: true,
      error: undefined,
    });

    renderWithRouter(<PokemonDetailsModal />);

    expect(screen.getByText('Loading Pokemon details...')).toBeInTheDocument();
  });

  it('should display pokemon details after loading', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
    });

    renderWithRouter(<PokemonDetailsModal />);

    screen.getAllByText('Pikachu').forEach((el: HTMLElement) => {
      expect(el).toBeInTheDocument();
    });
    expect(screen.getByText('#25')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText(/0.4 m/)).toBeInTheDocument();
    expect(screen.getByText(/6 kg/)).toBeInTheDocument();
    expect(screen.getByText('190')).toBeInTheDocument();
  });

  it('should display pokemon stats', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
    });

    renderWithRouter(<PokemonDetailsModal />);

    expect(screen.getByText('Stats:')).toBeInTheDocument();
    expect(screen.getByText('hp:')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('attack:')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('should display error message on error', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Network error') as any,
    });

    renderWithRouter(<PokemonDetailsModal />);

    expect(screen.getByText('Failed to load Pokemon details')).toBeInTheDocument();
    expect(screen.getByText('Please try again later.')).toBeInTheDocument();
  });

  it('should display not found message when pokemon does not exist', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: null,
      loading: false,
      error: undefined,
    });

    render(
      <MemoryRouter initialEntries={['/list/pokemon/999']}>
        <Routes>
          <Route path="/list/pokemon/:id" element={<PokemonDetailsModal />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Pokemon Not Found')).toBeInTheDocument();
    expect(screen.getByText('Could not find details for this Pokemon.')).toBeInTheDocument();
  });

  it('should call navigate when close button is clicked', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
    });

    renderWithRouter(<PokemonDetailsModal />);

    const closeButton = screen.getByLabelText('Close modal');
    closeButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/list');
  });

  it('should handle multiple types', () => {
    const mockMultiType = {
      ...mockPokemonData,
      types: ['grass', 'poison'],
    };

    mockUseGetPokemonDetails.mockReturnValue({
      data: mockMultiType,
      loading: false,
      error: undefined,
    });

    renderWithRouter(<PokemonDetailsModal />);

    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });

  it('should display pokemon image when sprite is available', () => {
    mockUseGetPokemonDetails.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
    });

    renderWithRouter(<PokemonDetailsModal />);

    const image = screen.getByAltText('Pikachu') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('pikachu.png');
  });
});
