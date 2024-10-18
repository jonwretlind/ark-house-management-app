// src/pages/StartScreen.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, Alert } from '@mui/material';
import axios from '../utils/api'; // Axios instance for API calls
import { useNavigate } from 'react-router-dom'; // For navigation after login
import Logo from '../components/Logo';

const StartScreen = () => {
  const [email, setEmail] = useState(''); // Track email input
  const [password, setPassword] = useState(''); // Track password input
  const [error, setError] = useState(null); // Handle login errors
  const navigate = useNavigate(); // Hook for navigation

   // Check if user is already logged in and redirect to dashboard
   useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get('/auth/me', { withCredentials: true });
        navigate('/dashboard'); // Redirect if user is already logged in
      } catch (error) {
        console.log('No active session found, stay on login screen.');
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
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '8rem' }}>
              {/* Logo */}
      <Logo />
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to The Ark Sober Living
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Please log in to access your tasks and dashboard.
      </Typography>

      {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

      <form onSubmit={handleLogin}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </form>

      <Box mt={4}>
        <Typography variant="body2">Don't have an account?</Typography>
        <Button variant="outlined" href="/register">
          Register Here
        </Button>
      </Box>
    </Container>
  );
};

export default StartScreen;
