import React from 'react';
import { Typography, Paper } from '@mui/material';
import EventCard from './EventCard';

const MyEventsList = ({ events }) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        padding: '24px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        marginTop: '16px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          color: 'white',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          fontWeight: 500,
          fontSize: '1rem',
          letterSpacing: '0.5px',
          paddingLeft: '8px',
        }}
      >
        My Events
      </Typography>
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          isDashboard={true}
          refreshEvents={() => {}}
        />
      ))}
    </Paper>
  );
};

export default MyEventsList;
