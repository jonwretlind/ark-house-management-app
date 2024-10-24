import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { format, parse } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const EventCard = ({ event, onEdit, onDelete }) => {
  const theme = useTheme();

  const formatTime = (timeString) => {
    const date = parse(timeString, 'HH:mm', new Date());
    return format(date, 'h:mm a');
  };

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
        <IconButton onClick={() => onEdit(event)} aria-label="edit" size="small" sx={{ color: theme.palette.primary.main }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(event._id)} aria-label="delete" size="small" sx={{ color: theme.palette.secondary.main }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 1 }}>
          {event.name}
        </Typography>
        <Typography sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.7)' }}>
          {format(new Date(event.date), 'MMMM d, yyyy')} at {formatTime(event.time)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 1 }}>
          Location: {event.location}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
