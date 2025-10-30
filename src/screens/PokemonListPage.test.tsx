import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PokemonListPage } from './PokemonListPage';
import * as useGetPokemonsHook from '../hooks/useGetPokemons';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

jest.mock('../hooks/useGetPokemons');

const mockUseGetPokemons = useGetPokemonsHook.useGetPokemons as jest.MockedFunction<
  typeof useGetPokemonsHook.useGetPokemons
>;

describe('PokemonListPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  const mockPokemonData = [
    {
      id: '25',
      name: 'Pikachu',
      types: ['electric'],
      sprite: 'https://example.com/pikachu.png',
    },
    {
      id: '1',
      name: 'Bulbasaur',
      types: ['grass', 'poison'],
      sprite: 'https://example.com/bulbasaur.png',
    },
  ];

  it('should display loading state initially', () => {
    mockUseGetPokemons.mockReturnValue({
      data: [],
      loading: true,
      error: undefined,
      totalCount: 0,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should display pokemon list after loading', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display error message on error', () => {
    mockUseGetPokemons.mockReturnValue({
      data: [],
      loading: false,
      error: new Error('Network error') as any,
      totalCount: 0,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Oops, we couldn't catch any pokemon!")).toBeInTheDocument();
    expect(screen.getByText('Try again later.')).toBeInTheDocument();
  });

  it('should display empty state when no pokemon found', () => {
    mockUseGetPokemons.mockReturnValue({
      data: [],
      loading: false,
      error: undefined,
      totalCount: 0,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('No Pokemon to Display')).toBeInTheDocument();
  });

  it('should display search input', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText('Search Pokemon by name...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should update search term on input change', async () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText(
      'Search Pokemon by name...',
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'pika' } });

    expect(searchInput.value).toBe('pika');
  });

  it('should display no results message when search returns empty', () => {
    mockUseGetPokemons.mockReturnValue({
      data: [],
      loading: false,
      error: undefined,
      totalCount: 0,
    });

    const { rerender } = render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText('Search Pokemon by name...');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });

    rerender(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('No Results Found')).toBeInTheDocument();
  });

  it('should navigate to pokemon details on row click', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const pikachuRow = screen.getByText('Pikachu').closest('tr');
    if (pikachuRow) {
      fireEvent.click(pikachuRow);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/list/pokemon/25');
  });

  it('should display table headers', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Number')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type(s)')).toBeInTheDocument();
  });

  it('should display pokemon types correctly', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('electric')).toBeInTheDocument();
    expect(screen.getByText('grass, poison')).toBeInTheDocument();
  });

  it('should display pagination when totalPages > 1', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 50,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should not display pagination when totalPages <= 1', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 50,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('should render Outlet for nested routes', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('should display pokemon images when sprites are available', () => {
    mockUseGetPokemons.mockReturnValue({
      data: mockPokemonData,
      loading: false,
      error: undefined,
      totalCount: 2,
    });

    render(
      <MemoryRouter>
        <PokemonListPage />
      </MemoryRouter>,
    );

    const pikachuImage = screen.getByAltText('Pikachu') as HTMLImageElement;
    expect(pikachuImage).toBeInTheDocument();
    expect(pikachuImage.src).toContain('pikachu.png');
  });
});
