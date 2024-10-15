// src/pages/StartScreen.js
import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';
import Logo from '../components/Logo';

const StartScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);  // Store JWT in localStorage
      history.push('/dashboard');  // Redirect to the dashboard
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {/* Logo */}
      <Logo />
      
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to The Ark Sober Living
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" fullWidth type="submit">
            Log In
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default StartScreen;
