import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../utils/api';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import { useNavigate } from 'react-router-dom';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [openEventForm, setOpenEventForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchCurrentUser();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events', { withCredentials: true });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me', { withCredentials: true });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await axios.post('/events', eventData, { withCredentials: true });
      setOpenEventForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = async (eventId, eventData) => {
    try {
      if (!eventId || typeof eventId !== 'string') {
        console.error('Invalid event ID:', eventId);
        return;
      }
      
      const eventToEdit = events.find(e => e._id === eventId);
      setEditingEvent(eventToEdit);
      setOpenEventForm(true);
      
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleSubmit = async (eventData) => {
    try {
      if (editingEvent) {
        await axios.put(`/events/${editingEvent._id}`, eventData, { 
          withCredentials: true 
        });
      } else {
        await axios.post('/events', eventData, { withCredentials: true });
      }
      
      setOpenEventForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/events/${eventId}`, { withCredentials: true });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
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
            backgroundColor: theme.palette.primary.main,
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
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              currentUser={currentUser}
              refreshEvents={fetchEvents}
            />
          ))}
        </Container>

        {currentUser && currentUser.isAdmin && (
          <Fab 
            color="primary" 
            aria-label="add" 
            onClick={() => setOpenEventForm(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        )}

        <EventForm
          open={openEventForm}
          handleClose={() => {
            setOpenEventForm(false);
            setEditingEvent(null);
          }}
          handleSubmit={handleSubmit}
          initialData={editingEvent}
        />
      </Box>
    </ThemeProvider>
  );
};

export default EventsScreen;
