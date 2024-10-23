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
        const response = await axios.get('/auth/me', { withCredentials: true });
        if (response.data) {
          navigate('/dashboard'); // Redirect if user is already logged in
        }
      } catch (error) {
        console.log('No active session found, stay on login screen.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  // Handle user login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Make API call to login endpoint
      const response = await axios.post(
        '/auth/login',
        { email, password },
        { withCredentials: true } // Ensure cookies are sent with request
      );

      console.log('Login successful:', response.data);
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
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
          backgroundSize: '120% 120%', // Enlarge the background to 120%
          backgroundPosition: '5% 78%',
          backgroundAttachment: 'fixed',
          position: 'relative',
          paddingTop: '15vh', // Add top padding to lower the content
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
            <Typography variant="h4" component="h1" gutterBottom color="text.primary">
              Welcome to the Ark
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom color="text.primary">
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
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
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
