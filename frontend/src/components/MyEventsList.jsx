import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useTheme } from '@mui/material/styles';

const MyEventsList = ({ events }) => {
  const theme = useTheme();

  if (events.length === 0) {
    return null; // Don't render anything if there are no events
  }

  return (
    <Box sx={{ mt: 4, px: 1 }}> {/* Added px: 1 for left and right padding */}
      <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>My Events</Typography>
      {events.map((event) => (
        <Card key={event._id} sx={{ 
          mb: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  letterSpacing: '-.25px'
                }}
              >
                {event.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 0.5 }}>
              Date: {new Date(event.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 0.5 }}>
              Time: {event.time}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              Location: {event.location}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyEventsList;
