import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  types?: string[];
  sprite?: string;
}

export interface PokemonDetail extends Pokemon {
  captureRate?: number;
  weight?: number;
  height?: number;
  stats?: Array<{
    baseStat: number;
    statName: string;
  }>;
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String, $limit: Int, $offset: Int) {
    pokemon(
      limit: $limit
      offset: $offset
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

export const GET_POKEMON_COUNT = gql`
  query GetPokemonCount($search: String) {
    pokemon_aggregate(
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const useGetPokemons = (
  search?: string,
  limit: number = 20,
  offset: number = 0,
): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
  totalCount: number;
} => {
  const searchPattern = search ? `(?i).*${search}.*` : '';

  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: {
      search: searchPattern,
      limit,
      offset,
    },
  });

  const { data: countData } = useQuery<{ pokemon_aggregate: { aggregate: { count: number } } }>(
    GET_POKEMON_COUNT,
    {
      variables: {
        search: searchPattern,
      },
    },
  );

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: p.pokemontypes?.map((pt: any) => pt.type.typenames?.[0]?.name),
          sprite: p.pokemonsprites?.[0]?.sprites,
        }),
      ) ?? [],
    loading,
    error,
    totalCount: countData?.pokemon_aggregate?.aggregate?.count ?? 0,
  };
};

export const useGetPokemonDetails = (
  id: string,
): {
  data: PokemonDetail | null;
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const pokemonId = id ? parseInt(id, 10) : null;

  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: { id: pokemonId },
    skip: !pokemonId || Number.isNaN(pokemonId),
  });

  const pokemon = data?.pokemon?.[0];

  return {
    data: pokemon
      ? {
          id: pokemon.id,
          name: pokemon.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: pokemon.pokemontypes?.map((pt: any) => pt.type.typenames?.[0]?.name),
          sprite: pokemon.pokemonsprites?.[0]?.sprites,
          captureRate: pokemon.pokemonspecy.capture_rate,
          weight: pokemon.weight,
          height: pokemon.height,
          stats: pokemon.pokemonstats?.map((ps: any) => ({
            baseStat: ps.base_stat,
            statName: ps.stat.name,
          })),
        }
      : null,
    loading,
    error,
  };
};
