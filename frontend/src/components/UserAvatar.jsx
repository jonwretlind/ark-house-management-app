// src/components/UserAvatar.jsx
import React from 'react';
import { Avatar } from '@mui/material';
import { BASE_URL } from '../utils/api';

const UserAvatar = ({ user, size = 40, sx = {} }) => {
  const formatAvatarUrl = (url) => {
    if (!url) return null;
    // Remove any leading slashes
    return url.replace(/^\//, '');
  };
  
  console.log('User in UserAvatar:', user);
  console.log('Avatar URL before format:', user?.avatarUrl);
  const formattedUrl = user?.avatarUrl ? `${BASE_URL}/${formatAvatarUrl(user.avatarUrl)}` : null;
  console.log('Final Avatar URL:', formattedUrl);

  return (
    <Avatar
      alt={user?.name || ''}
      src={formattedUrl}
      sx={{
        width: size,
        height: size,
        ...sx
      }}
    >
      {user?.name ? user.name.charAt(0).toUpperCase() : ''}
    </Avatar>
  );
};

export default UserAvatar;
