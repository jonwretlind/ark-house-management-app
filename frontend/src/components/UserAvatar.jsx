// src/components/UserAvatar.jsx
import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const UserAvatar = ({ user }) => {
  return (
    <Box display="flex" alignItems="center" mb={3}>
      <Avatar 
        src={user.avatar || '/default-avatar.png'} 
        alt={user.name} 
        sx={{ width: 56, height: 56 }} 
      />
      <Box ml={2}>
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="subtitle1">Points: {user.points || 0}</Typography>
      </Box>
    </Box>
  );
};

export default UserAvatar;
