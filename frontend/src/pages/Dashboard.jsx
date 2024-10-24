// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api'; // Axios instance for API calls
import AdminTaskTable from '../components/AdminTaskTable'; // Admin task management
import UserAvatar from '../components/UserAvatar'; // User avatar and info display
import TaskList from '../components/TaskList'; // Task list for non-admins
import { 
  Box, Container, AppBar, Toolbar, Typography, Button, Avatar, 
  CircularProgress, IconButton, Drawer, List, ListItem, ListItemText,
  ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import backgroundImage from '../../assets/screen2.png';
import BibleVerseScroll from '../components/BibleVerseScroll';
import ScrollingFeed from '../components/ScrollingFeed';
import EventForm from '../components/EventForm';
import MessageForm from '../components/MessageForm';
import EventCard from '../components/EventCard';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EventIcon from '@mui/icons-material/Event';
import { useSwipeable } from 'react-swipeable';
import { Badge } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a4731', // Dark green
    },
    secondary: {
      main: '#d35400', // Rusty orange
    },
    background: {
      default: '#2c3e50', // Dark blue-gray
      paper: '#34495e', // Lighter blue-gray
    },
    text: {
      primary: '#ecf0f1', // Light gray
      secondary: '#bdc3c7', // Lighter gray
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#34495e',
          boxShadow: '12px 12px 24px #2c3e50, -12px -12px 24px #3c546e',
          borderRadius: '15px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '6px 6px 12px #2c3e50, -6px -6px 12px #3c546e',
          '&:hover': {
            boxShadow: 'inset 6px 6px 12px #2c3e50, inset -6px -6px 12px #3c546e',
          },
        },
      },
    },
  },
});

const Dashboard = () => {
  const [user, setUser] = useState(null); // Track user state
  const [tasks, setTasks] = useState([]); // Store tasks
  const [isAdmin, setIsAdmin] = useState(false); // Track admin status
  const [loading, setLoading] = useState(true); // Track loading state
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [messageFormOpen, setMessageFormOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feed, setFeed] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // React Router navigation hook
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [hasEvents, setHasEvents] = useState(false);
  const [hasNewEvents, setHasNewEvents] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('/events'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/auth/me', { withCredentials: true });
        setUser(userResponse.data);
        setIsAdmin(userResponse.data.isAdmin);
        console.log('User data fetched:', userResponse.data); // Add this line

        // Fetch tasks if the user is authenticated
        const tasksResponse = await axios.get('/tasks', { withCredentials: true });
        setTasks(tasksResponse.data);

        await refreshFeed();
      } catch (error) {
        console.error('Authentication failed, redirecting to login...', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Updated logout function
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      setUser(null); // Clear user state on logout
      navigate('/'); // Redirect to StartScreen after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshFeed = async () => {
    try {
      const [eventsRes, messagesRes] = await Promise.all([
        axios.get('/events', { withCredentials: true }),
        axios.get('/messages', { withCredentials: true })
      ]);

      // Check if eventsRes.data is an object with an 'events' property
      const events = eventsRes.data.events || [];
      const messages = messagesRes.data || [];

      const combinedFeed = [
        ...events.map(event => ({ ...event, type: 'event' })),
        ...messages.map(message => ({ ...message, type: 'message' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFeed(combinedFeed);
      setHasNewEvents(eventsRes.data.hasNewEvents);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    { text: 'Create Event', onClick: () => { setEventFormOpen(true); setMenuOpen(false); } },
    { text: 'Create Message', onClick: () => { setMessageFormOpen(true); setMenuOpen(false); } },
    { text: 'Logout', onClick: handleLogout },
  ];

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: 2,
    marginBottom: 2,
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events', { withCredentials: true });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventScroll = (index) => {
    setCurrentEventIndex(index);
  };

  useEffect(() => {
    const checkEvents = async () => {
      try {
        const response = await axios.get('/events', { withCredentials: true });
        setHasNewEvents(response.data.hasNewEvents);
      } catch (error) {
        console.error('Error checking events:', error);
      }
    };

    checkEvents();
  }, []);

  const handleEventIconClick = async () => {
    try {
      await axios.post('/events/mark-viewed', {}, { withCredentials: true });
      setHasNewEvents(false);
      navigate('/events');
    } catch (error) {
      console.error('Error marking events as viewed:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        {...handlers}
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
            backgroundColor: 'black',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
            boxShadow: (theme) => `0 4px 20px rgba(0,0,0,0.6)`,
          }}
        >
          <Toolbar>
            <Avatar 
              alt={user.name} 
              src={user.avatarUrl}
              sx={{ mr: 2 }}
            />
            <Typography variant="subtitle1" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
              {user.name}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleMenu}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleEventIconClick}
            >
              <Badge
                variant="dot"
                color="error"
                invisible={!hasNewEvents}
              >
                <EventIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="right"
          open={menuOpen}
          onClose={toggleMenu}
          PaperProps={{
            sx: {
              ...glassyBoxStyle,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Container maxWidth="lg" sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          mt: 4,
          mb: 4,
          padding: '2rem',
        }}>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}>
              My Dashboard
            </Typography>
          </Box>
          
          <Box>
            <BibleVerseScroll />
          </Box>

          <Box sx={glassyBoxStyle}>
            {isAdmin ? (
              <AdminTaskTable tasks={tasks} setTasks={setTasks} currentUser={user} />
            ) : (
              <TaskList tasks={tasks} setTasks={setTasks} currentUser={user} />
            )}
          </Box>
        </Container>

        <EventForm open={eventFormOpen} handleClose={() => setEventFormOpen(false)} refreshEvents={refreshFeed} />
        <MessageForm open={messageFormOpen} handleClose={() => setMessageFormOpen(false)} refreshMessages={refreshFeed} />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
