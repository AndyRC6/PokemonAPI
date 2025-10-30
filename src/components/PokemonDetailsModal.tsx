import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPokemonDetails } from 'src/hooks/useGetPokemons';
import { usePokemonDetailsModalStyles } from '../tss';

export const PokemonDetailsModal = () => {
  const { classes } = usePokemonDetailsModalStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useGetPokemonDetails(id || '');

  const handleClose = useCallback(() => {
    navigate('/list');
  }, [navigate]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  return (
    <div className={classes.modalOverlay} role="button" tabIndex={0}>
      <div className={classes.modalContainer} role="dialog" aria-modal="true">
        <div className={classes.modalHeader}>
          <h2 className={classes.modalTitle}>
            {loading ? 'Loading...' : data?.name || 'Pokemon Details'}
          </h2>
          <button className={classes.modalCloseBtn} onClick={handleClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className={classes.modalBody}>
          {loading && (
            <div className={classes.modalLoading}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading Pokemon details...</p>
            </div>
          )}

          {error && (
            <div className={classes.modalError}>
              <div className={classes.errorIcon}>⚠️</div>
              <h2>Failed to load Pokemon details</h2>
              <p>Please try again later.</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className={classes.modalContentGrid}>
              <div className={classes.modalImage}>
                {data.sprite && <img src={data.sprite} alt={data.name} className={classes.image} />}
              </div>
              <div className={classes.modalDetails}>
                <h3>#{data.id}</h3>
                <h4 className={classes.pokemonName}>{data.name}</h4>

                <div className={classes.detailItem}>
                  <strong>Type(s):</strong>{' '}
                  {data.types?.map((type) => (
                    <span key={type} className={classes.typeBadge}>
                      {type}
                    </span>
                  ))}
                </div>

                <div className={classes.detailItem}>
                  <strong>Height:</strong> {data.height ? `${data.height / 10} m` : 'N/A'}
                </div>

                <div className={classes.detailItem}>
                  <strong>Weight:</strong> {data.weight ? `${data.weight / 10} kg` : 'N/A'}
                </div>

                <div className={classes.detailItem}>
                  <strong>Capture Rate:</strong> {data.captureRate || 'N/A'}
                </div>

                {data.stats && data.stats.length > 0 && (
                  <div className={classes.statsSection}>
                    <strong>Stats:</strong>
                    <div className={classes.statsList}>
                      {data.stats.map((stat) => (
                        <div key={stat.statName} className={classes.statItem}>
                          <div className={classes.statHeader}>
                            <span className={classes.statName}>
                              {stat.statName.replace('-', ' ')}:
                            </span>
                            <span className={classes.statValue}>{stat.baseStat}</span>
                          </div>
                          <div className={classes.statBar}>
                            <div
                              className={classes.statBarFill}
                              style={{ width: `${(stat.baseStat / 255) * 100}%` }}
                              role="progressbar"
                              aria-label={`${stat.statName} stat`}
                              aria-valuenow={stat.baseStat}
                              aria-valuemin={0}
                              aria-valuemax={255}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !error && !data && (
            <div className={classes.modalEmpty}>
              <div className={classes.emptyIcon}>📭</div>
              <h2>Pokemon Not Found</h2>
              <p>Could not find details for this Pokemon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
