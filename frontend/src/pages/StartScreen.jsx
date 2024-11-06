// src/pages/StartScreen.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, Alert, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import axios from '../utils/api'; // Axios instance for API calls
import { useNavigate } from 'react-router-dom'; // For navigation after login
import Logo from '../components/Logo';
// Add this import
import backgroundImage from '../../assets/screen1.png';
import theme from '../theme';

const StartScreen = () => {
  const [email, setEmail] = useState(''); // Track email input
  const [password, setPassword] = useState(''); // Track password input
  const [error, setError] = useState(null); // Handle login errors
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Hook for navigation

  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const response = await axios.get('/auth/me');
        console.log('Session check response:', response.data);
        
        if (response.data) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.log('No active session:', error);
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  // Handle user login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      console.log('Attempting login with:', { email: email.trim() }); // Log the attempt
      const response = await axios.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      console.log('Login response:', response.data); // Log the response

      if (response.data && response.data.user) {
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data); // Log detailed error
      setError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: 4,
    textAlign: 'center',
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          position: 'relative',
          paddingTop: '15vh',
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: '10vh', // Adjust this value to move the logo down
            left: '50%',
            width: '50%',
            transform: 'translateX(-50%)',
            filter: 'brightness(0) invert(1)',
            marginBottom: 4, // Decrease the margin
          }}
        >
          <Logo />
        </Box>

        <Container maxWidth="sm">
          <Box sx={glassyBoxStyle}>
            <Typography variant="h4" component="h2" gutterBottom color="text.primary">
              Welcome to the Ark
            </Typography>
            <Typography variant="h6" component="h3" gutterBottom color="text.primary">
              Christ-Centered Sober Living
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                sx={{ 
                  mt: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Login
              </Button>
            </form>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default StartScreen;
