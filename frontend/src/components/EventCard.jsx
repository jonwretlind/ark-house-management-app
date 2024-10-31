import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const EventCard = ({ event, onEdit, onDelete, currentUser, refreshEvents, isDashboard }) => {
  const [isRSVPed, setIsRSVPed] = useState(event.attendees && Array.isArray(event.attendees) && currentUser && event.attendees.includes(currentUser._id));
  const theme = useTheme();

  const handleRSVP = async () => {
    if (!currentUser) {
      console.error('No current user');
      return;
    }
    try {
      console.log('Sending RSVP request for event:', event._id);
      const response = await axios.post(`/events/${event._id}/rsvp`, {}, { withCredentials: true });
      console.log('RSVP response:', response.data);
      setIsRSVPed(response.data.isAttending);
      refreshEvents();
    } catch (error) {
      console.error('Error RSVPing to event:', error.response?.data || error.message);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Card sx={{ 
      mb: 2, 
      backgroundColor: 'rgba(255, 255, 255, 0.7)', 
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      ...(isDashboard && {
        '& .MuiCardContent-root': {
          padding: '16px'
        }
      })
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: theme.palette.primary.main, 
              fontWeight: 'bold', 
              fontSize: isDashboard ? '1rem' : '1.2rem', 
              letterSpacing: '-.25px'
            }}
          >
            {event.name}
          </Typography>
          <Box>
            {currentUser && currentUser.isAdmin && (
              <>
                <IconButton onClick={() => onEdit(event._id, event)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(event._id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
            {currentUser && (
              <IconButton onClick={handleRSVP} color={isRSVPed ? "primary" : "default"} size="small">
                <EventIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(0, 0, 0, 0.7)', 
            mb: 1,
            ...(isDashboard && {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            })
          }}
        >
          {event.description}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 0.5 }}>
          Date: {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 0.5 }}>
          Time: {event.time}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 0.5 }}>
          Location: {event.location}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
          Attendees: {event.attendees ? event.attendees.length : 0}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
