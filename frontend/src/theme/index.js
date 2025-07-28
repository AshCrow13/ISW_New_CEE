import { createTheme } from '@mui/material/styles';

// Paleta de colores del proyecto
const colors = {
  primary: {
    main: '#003366',
    light: '#336699',
    dark: '#001a33',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#eef7ff',
    light: '#ffffff',
    dark: '#bbc4cc',
    contrastText: '#003366',
  },
  accent: {
    main: '#006edf',
    light: '#4d94e8',
    dark: '#004a9c',
  },
  success: {
    main: '#166534',
    light: '#22c55e',
    dark: '#0f4c2a',
    contrastText: '#ffffff',
  },
  error: {
    main: '#991b1b',
    light: '#ef4444',
    dark: '#7f1d1d',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#92400e',
    light: '#f59e0b',
    dark: '#78350f',
    contrastText: '#ffffff',
  },
  info: {
    main: '#1e40af',
    light: '#3b82f6',
    dark: '#1e3a8a',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

// Crear el theme personalizado
const theme = createTheme({
  palette: {
    ...colors,
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: colors.primary.main,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: colors.primary.main,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.primary.main,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.grey[800],
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: colors.grey[800],
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: colors.grey[700],
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.grey[700],
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.grey[600],
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  spacing: 8, // Base spacing unit (8px)
  shape: {
    borderRadius: 12, // Border radius por defecto
  },
  components: {
    // Button customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.accent.main} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.accent.dark} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.grey[100]} 100%)`,
          color: colors.primary.main,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.secondary.dark} 0%, ${colors.grey[200]} 100%)`,
          },
        },
      },
    },
    // Paper customization
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.grey[200]}`,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
        elevation6: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    // Card customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.grey[200]}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    // TextField customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: colors.secondary.main,
            '& fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colors.accent.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.accent.main,
              boxShadow: `0 0 0 3px rgba(0, 110, 223, 0.1)`,
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.primary.main,
            fontWeight: 500,
          },
        },
      },
    },
    // DataGrid customization
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.grey[200]}`,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            fontWeight: 600,
            borderRadius: '16px 16px 0 0',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colors.grey[100]}`,
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: colors.grey[50],
            },
          },
        },
      },
    },
    // Chip customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        colorPrimary: {
          background: `linear-gradient(135deg, ${colors.info.light} 0%, ${colors.info.main} 100%)`,
          color: colors.info.contrastText,
        },
        colorSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.grey[100]} 100%)`,
          color: colors.primary.main,
        },
      },
    },
    // Dialog customization
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    // AppBar customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.info.main} 100%)`,
          boxShadow: '0 4px 20px rgba(0, 51, 102, 0.15)',
        },
      },
    },
    // TableContainer customization
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.grey[200]}`,
        },
      },
    },
    // Table customization
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            '& .MuiTableCell-root': {
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText,
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
          },
          '& .MuiTableBody-root': {
            '& .MuiTableRow-root': {
              '&:hover': {
                backgroundColor: colors.grey[50],
              },
            },
          },
        },
      },
    },
  },
  // Breakpoints personalizados
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
});

export default theme;
