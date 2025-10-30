import { createTss } from 'tss-react';

function useContext() {
  const theme = {
    color: {
      surface: '#000E1C',
      text: {
        primary: '#FAFAFA',
      },
    },
  };

  return { theme };
}

export const { tss } = createTss({ useContext });

// Pokemon List Page Styles
export const usePokemonListStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '20px',
    paddingBottom: '100px',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s ease-in-out',
    '&:focus': {
      borderColor: '#1976d2',
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: theme.color.text.primary,
    margin: 0,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '15px',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '64px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#d32f2f',
    margin: 0,
  },
  errorMessage: {
    fontSize: '18px',
    color: theme.color.text.primary,
    margin: 0,
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '15px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: theme.color.text.primary,
    margin: 0,
  },
  emptyMessage: {
    fontSize: '18px',
    color: theme.color.text.primary,
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: theme.color.surface,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerRow: {
    backgroundColor: '#1976d2',
    color: '#ffffff',
  },
  headerCell: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #e0e0e0',
  },
  row: {
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.15)',
      transform: 'scale(1.01)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  cell: {
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
  },
  imagePlaceholder: {
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    padding: '4px',
    '& span': {
      fontSize: '10px',
      color: '#666',
      textAlign: 'center',
      lineHeight: '1.2',
    },
  },
  paginationContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    padding: '15px 20px',
    backgroundColor: theme.color.surface,
    borderTop: '2px solid #e0e0e0',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  },
  paginationButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover:not(:disabled)': {
      backgroundColor: '#1976d2',
      color: 'white',
      borderColor: '#1976d2',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  pageNumbers: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  pageButton: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    minWidth: '40px',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      borderColor: '#1976d2',
    },
  },
  pageButtonActive: {
    backgroundColor: '#1976d2',
    color: 'white',
    borderColor: '#1976d2',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  ellipsis: {
    padding: '0 8px',
    color: '#666',
  },
}));

// Pokemon Details Modal Styles
export const usePokemonDetailsModalStyles = tss.create(() => ({
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    background: 'white',
    borderRadius: '8px',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  modalTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#333',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#666',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#000',
    },
  },
  modalBody: {
    padding: '20px',
  },
  modalLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    '& p': {
      marginTop: '15px',
      color: '#666',
    },
  },
  modalError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    '& h2': {
      color: '#d32f2f',
      marginTop: 0,
    },
    '& p': {
      marginTop: '15px',
      color: '#666',
    },
  },
  modalEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    '& h2': {
      color: '#333',
      marginTop: 0,
    },
    '& p': {
      marginTop: '15px',
      color: '#666',
    },
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '15px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '15px',
  },
  modalContentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  modalImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
  },
  modalDetails: {
    '& h3': {
      margin: '0 0 5px 0',
      color: '#666',
      fontSize: '18px',
    },
  },
  pokemonName: {
    margin: '0 0 20px 0',
    fontSize: '28px',
    textTransform: 'capitalize',
    color: '#333',
  },
  detailItem: {
    marginBottom: '12px',
    color: '#333',
  },
  typeBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: '12px',
    fontSize: '14px',
    marginRight: '5px',
    textTransform: 'capitalize',
  },
  statsSection: {
    marginTop: '25px',
    '& strong': {
      display: 'block',
      marginBottom: '10px',
      color: '#333',
    },
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statName: {
    textTransform: 'capitalize',
    fontSize: '14px',
    color: '#666',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  statBar: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#1976d2',
    transition: 'width 0.3s ease',
  },
}));
