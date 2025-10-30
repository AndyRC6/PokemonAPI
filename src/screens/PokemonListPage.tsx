import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { usePokemonListStyles } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';

export const PokemonListPage = () => {
  const { classes } = usePokemonListStyles();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const offset = (currentPage - 1) * itemsPerPage;
  const { data, loading, error, totalCount } = useGetPokemons(
    debouncedSearchTerm,
    itemsPerPage,
    offset,
  );
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // set debounce time to 300 milliseconds

    // cleanup timeout when component unmounts
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRowClick = (pokemonId: string) => {
    navigate(`/list/pokemon/${pokemonId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className={classes.root}>
        <div className={classes.errorContainer}>
          <div className={classes.errorIcon}>⚠️</div>
          <h2 className={classes.errorTitle}>Oops, we couldn&apos;t catch any pokemon!</h2>
          <p className={classes.errorMessage}>Try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchContainer}>
        <input
          type="text"
          className={classes.searchInput}
          placeholder="Search Pokemon by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading && (
        <div className={classes.loadingContainer}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className={classes.loadingText}>Searching...</p>
        </div>
      )}

      {(!data || data?.length === 0) && !loading && (
        <div className={classes.emptyContainer}>
          <div className={classes.emptyIcon}>🔍</div>
          <h2 className={classes.emptyTitle}>
            {searchTerm ? 'No Results Found' : 'No Pokemon to Display'}
          </h2>
          <p className={classes.emptyMessage}>
            {searchTerm
              ? `No pokemon match "${searchTerm}". Try a different search term.`
              : 'There are no pokemon available at the moment.'}
          </p>
        </div>
      )}

      {data && data?.length > 0 && (
        <>
          <table className={classes.table}>
            <thead>
              <tr className={classes.headerRow}>
                <th className={classes.headerCell}>Number</th>
                <th className={classes.headerCell}>Image</th>
                <th className={classes.headerCell}>Name</th>
                <th className={classes.headerCell}>Type(s)</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((pokemon) => (
                <tr
                  key={pokemon.id}
                  className={classes.row}
                  onClick={() => handleRowClick(pokemon.id)}
                >
                  <td className={classes.cell}>{pokemon.id}</td>
                  <td className={classes.cell}>
                    {pokemon.sprite && (
                      <img src={pokemon.sprite} alt={pokemon.name} className={classes.image} />
                    )}
                  </td>
                  <td className={classes.cell}>{pokemon.name}</td>
                  <td className={classes.cell}>{pokemon.types?.join(', ') || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className={classes.paginationContainer}>
              <button
                className={classes.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className={classes.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className={classes.ellipsis}>
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      className={`${classes.pageButton} ${
                        page === currentPage ? classes.pageButtonActive : ''
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                className={classes.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <Outlet />
    </div>
  );
};
