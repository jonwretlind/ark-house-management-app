// src/components/Logo.js
import React from 'react';
import { Box } from '@mui/material';

const Logo = ({ logoUrl = '' }) => {
  const src = logoUrl || '/assets/logo.png';

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
      <img
        src={src}
        alt="App Logo"
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  );
};

export default Logo;
