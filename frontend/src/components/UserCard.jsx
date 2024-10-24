import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const UserCard = ({ user, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      padding: 2,
      marginBottom: 2,
      transition: 'all 0.3s ease',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
        backgroundColor: 'rgba(255,255,255,0.8)',
      },
    }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex' }}>
        <IconButton onClick={() => onEdit(user)} aria-label="edit" size="small" sx={{ color: theme.palette.primary.main }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(user._id)} aria-label="delete" size="small" sx={{ color: theme.palette.secondary.main }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}>
          {user.name}
        </Typography>
        <Typography sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.7)' }}>
          Email: {user.email}
        </Typography>
        <Typography sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.7)' }}>
          Phone: {user.phone}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 1 }}>
          Role: {user.isAdmin ? 'Admin' : 'Resident'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
