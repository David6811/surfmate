import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './components/HomePage';
import { PasswordReset } from './components/PasswordReset';

// Material Design 3 inspired theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      light: '#7F67BE',
      dark: '#4F378B'
    },
    secondary: {
      main: '#625B71',
      light: '#7A7289',
      dark: '#4A4458'
    },
    background: {
      default: '#FFFBFE',
      paper: '#FFFFFF'
    },
    surface: {
      main: '#FFFBFE'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '-0.0125em'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 12,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)'
          }
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
          '&.MuiPaper-elevation1': {
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)'
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});

// Extend theme with custom colors
declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
    };
  }

  interface PaletteOptions {
    surface?: {
      main: string;
    };
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
