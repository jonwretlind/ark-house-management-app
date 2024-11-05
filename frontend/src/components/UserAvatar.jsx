// src/components/UserAvatar.jsx
import React from 'react';
import { Avatar } from '@mui/material';
import api from '../utils/api'; // Import the default export

const UserAvatar = ({ user, size = 40, sx = {} }) => {
  const formatAvatarUrl = (url) => {
    if (!url) return '';
    // Extract just the filename part after 'avatars/'
    const match = url.match(/avatars\/[^/]+$/);
    return match ? `avatars/${match[0].split('/').pop()}` : '';
  };
  
  return (
    <Avatar
      alt={user.name}
      src={user.avatarUrl ? `${api.BASE_URL}/uploads/${formatAvatarUrl(user.avatarUrl)}` : undefined}
      sx={{
        width: size,
        height: size,
        ...sx
      }}
    >
      {user.name ? user.name.charAt(0).toUpperCase() : ''}
    </Avatar>
  );
};

export default UserAvatar;
