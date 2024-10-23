// src/components/Logo.js
import React from 'react';
import { Box } from '@mui/material';

const Logo = () => {
  return (
    <Box sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
      <img
        src="/assets/logo.png"  // Ensure logo.png is placed in the correct folder
        alt="App Logo"
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  );
};

export default Logo;
