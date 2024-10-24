import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import axios from '../utils/api';
import EventCard from '../components/EventCard';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import AddIcon from '@mui/icons-material/Add';
import EventForm from '../components/EventForm';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    markEventsAsViewed();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events', { withCredentials: true });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const markEventsAsViewed = async () => {
    try {
      await axios.post('/events/mark-viewed', {}, { withCredentials: true });
    } catch (error) {
      console.error('Error marking events as viewed:', error);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventFormOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`, { withCredentials: true });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCloseForm = () => {
    setEventFormOpen(false);
    setSelectedEvent(null);
  };

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: 2,
    marginBottom: 2,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <AppBar 
          position="sticky"
          elevation={0} 
          sx={{ 
            backgroundColor: theme.palette.primary.main, // Changed to dark green
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
            boxShadow: (theme) => `0 4px 20px rgba(0,0,0,0.6)`,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => navigate('/dashboard')}
              edge="start"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Events
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          mt: 4,
          mb: 4,
          padding: '2rem',
        }}>
          <Box sx={{ ...glassyBoxStyle, position: 'relative', minHeight: '200px' }}>
            {events.map((event) => (
              <EventCard 
                key={event._id} 
                event={event} 
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}

            <IconButton 
              onClick={() => setEventFormOpen(true)} 
              sx={{ 
                position: 'relative',
                bottom: 0,
                left: 0,
                ...glassyBoxStyle,
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }} 
              aria-label="add event"
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Container>

        <EventForm 
          open={eventFormOpen} 
          handleClose={handleCloseForm} 
          refreshEvents={fetchEvents}
          event={selectedEvent}
        />
      </Box>
    </ThemeProvider>
  );
};

export default EventsScreen;
