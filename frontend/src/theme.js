import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Noto Sans',
      'Noto Serif',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Noto Serif, serif',
    },
    h2: {
      fontFamily: 'Noto Serif, serif',
    },
    h3: {
      fontFamily: 'Noto Serif, serif',
    },
    h4: {
      fontFamily: 'Noto Serif, serif',
    },
    h5: {
      fontFamily: 'Noto Serif, serif',
    },
    h6: {
      fontFamily: 'Noto Serif, serif',
    },
  },
  palette: {
    primary: {
      main: '#1a4731', // Dark green
    },
    secondary: {
      main: '#d35400', // Rusty orange
    },
    background: {
      default: '#2c3e50', // Dark blue-gray
      paper: 'rgba(255, 255, 255, 0.15)', // Translucent white
    },
    text: {
      primary: '#ecf0f1', // Light gray
      secondary: '#bdc3c7', // Lighter gray
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          '&:hover': {
            background: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a4731',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputBase-input': {
            color: '#ecf0f1',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  },
});

export default theme;
