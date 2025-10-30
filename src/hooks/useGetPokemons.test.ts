import { renderHook } from '@testing-library/react';
import { useQuery } from '@apollo/client/react';
import { useGetPokemons, useGetPokemonDetails } from './useGetPokemons';

jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useGetPokemons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockUseQuery
      .mockReturnValueOnce({
        data: undefined,
        loading: true,
        error: undefined,
      } as any)
      .mockReturnValueOnce({
        data: undefined,
        loading: true,
        error: undefined,
      } as any);

    const { result } = renderHook(() => useGetPokemons('', 20, 0));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should return pokemon data when loaded', () => {
    const mockData = {
      pokemon: [
        {
          id: '25',
          pokemonspecy: {
            pokemonspeciesnames: [{ name: 'Pikachu' }],
          },
          pokemonsprites: [{ sprites: 'https://example.com/pikachu.png' }],
          pokemontypes: [
            {
              type: {
                typenames: [{ name: 'electric' }],
              },
            },
          ],
        },
      ],
    };

    const mockCountData = {
      pokemon_aggregate: {
        aggregate: {
          count: 151,
        },
      },
    };

    mockUseQuery
      .mockReturnValueOnce({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)
      .mockReturnValueOnce({
        data: mockCountData,
        loading: false,
        error: undefined,
      } as any);

    const { result } = renderHook(() => useGetPokemons('', 20, 0));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual({
      id: '25',
      name: 'Pikachu',
      sprite: 'https://example.com/pikachu.png',
      types: ['electric'],
    });
    expect(result.current.totalCount).toBe(151);
  });

  it('should handle errors', () => {
    const mockError = new Error('Network error');

    mockUseQuery
      .mockReturnValueOnce({
        data: undefined,
        loading: false,
        error: mockError,
      } as any)
      .mockReturnValueOnce({
        data: { pokemon_aggregate: { aggregate: { count: 0 } } },
        loading: false,
        error: undefined,
      } as any);

    const { result } = renderHook(() => useGetPokemons('', 20, 0));

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toEqual([]);
  });

  it('should handle search with case-insensitive pattern', () => {
    const mockData = {
      pokemon: [
        {
          id: '25',
          pokemonspecy: {
            pokemonspeciesnames: [{ name: 'Pikachu' }],
          },
          pokemonsprites: [{ sprites: 'https://example.com/pikachu.png' }],
          pokemontypes: [
            {
              type: {
                typenames: [{ name: 'electric' }],
              },
            },
          ],
        },
      ],
    };

    mockUseQuery
      .mockReturnValueOnce({
        data: mockData,
        loading: false,
        error: undefined,
      } as any)
      .mockReturnValueOnce({
        data: { pokemon_aggregate: { aggregate: { count: 1 } } },
        loading: false,
        error: undefined,
      } as any);

    const { result } = renderHook(() => useGetPokemons('pika', 20, 0));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.totalCount).toBe(1);
  });
});

describe('useGetPokemonDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return pokemon details when loaded', () => {
    const mockData = {
      pokemon: [
        {
          id: '25',
          pokemonspecy: {
            pokemonspeciesnames: [{ name: 'Pikachu' }],
            capture_rate: 190,
          },
          pokemonsprites: [{ sprites: 'https://example.com/pikachu.png' }],
          pokemontypes: [
            {
              type: {
                typenames: [{ name: 'electric' }],
              },
            },
          ],
          weight: 60,
          height: 4,
          pokemonstats: [
            {
              base_stat: 35,
              stat: { name: 'hp' },
            },
          ],
        },
      ],
    };

    mockUseQuery.mockReturnValue({
      data: mockData,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGetPokemonDetails('25'));

    expect(result.current.data).toEqual({
      id: '25',
      name: 'Pikachu',
      sprite: 'https://example.com/pikachu.png',
      types: ['electric'],
      captureRate: 190,
      weight: 60,
      height: 4,
      stats: [{ baseStat: 35, statName: 'hp' }],
    });
  });

  it('should return null for invalid ID', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGetPokemonDetails('invalid'));

    expect(result.current.data).toBeNull();
  });

  it('should return null for empty ID', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGetPokemonDetails(''));

    expect(result.current.data).toBeNull();
  });

  it('should handle errors', () => {
    const mockError = new Error('Network error');

    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useGetPokemonDetails('25'));

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeNull();
  });

  it('should return null when pokemon not found', () => {
    mockUseQuery.mockReturnValue({
      data: { pokemon: [] },
      loading: false,
      error: undefined,
    } as any);

    const { result } = renderHook(() => useGetPokemonDetails('999'));

    expect(result.current.data).toBeNull();
  });
});
