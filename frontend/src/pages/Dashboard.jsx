// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api'; // Axios instance for API calls
import AdminTaskTable from '../components/AdminTaskTable'; // Admin task management
import UserAvatar from '../components/UserAvatar'; // User avatar and info display
import TaskList from '../components/TaskList'; // Task list for non-admins
import MyEventsList from '../components/MyEventsList'; // Import the new component
import { 
  Box, Container, AppBar, Toolbar, Typography, Button, Avatar, 
  CircularProgress, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  ThemeProvider, createTheme, CssBaseline, Badge
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
import MessageIcon from '@mui/icons-material/Message';
import { useSwipeable } from 'react-swipeable';
import ActiveMessageDialog from '../components/ActiveMessageDialog';
import MessagesDialog from '../components/MessagesDialog';
import { formatAvatarUrl } from '../utils/avatarHelper';

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
  const [activeMessage, setActiveMessage] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messagesDialogOpen, setMessagesDialogOpen] = useState(false);
  const [recentMessage, setRecentMessage] = useState(null);
  const [hasUnviewedMessages, setHasUnviewedMessages] = useState(false);
  const [myEvents, setMyEvents] = useState([]);

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('/events'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get('/auth/me', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!userResponse.data || typeof userResponse.data === 'string') {
          console.error('Invalid user data received:', userResponse);
          throw new Error('Invalid user data');
        }

        setUser(userResponse.data);
        setIsAdmin(userResponse.data.isAdmin);
        console.log('User data fetched:', userResponse.data);

        try {
          const tasksResponse = await axios.get('/tasks', { withCredentials: true });
          setTasks(tasksResponse.data);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }

        try {
          const myEventsResponse = await axios.get('/events/my-events', { withCredentials: true });
          setMyEvents(myEventsResponse.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }

        try {
          const activeMessageResponse = await axios.get('/messages/active', { withCredentials: true });
          setActiveMessage(activeMessageResponse.data);
        } catch (error) {
          console.error('Error fetching active message:', error);
        }

        try {
          const recentMessageResponse = await axios.get('/messages/recent', { withCredentials: true });
          setRecentMessage(recentMessageResponse.data);
        } catch (error) {
          console.error('Error fetching recent message:', error);
        }

        try {
          const unviewedResponse = await axios.get('/messages/unviewed', { withCredentials: true });
          setHasUnviewedMessages(unviewedResponse.data.hasUnviewed);
        } catch (error) {
          console.error('Error fetching unviewed messages:', error);
        }

        await refreshFeed();

      } catch (error) {
        console.error('Authentication error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

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

      const events = eventsRes.data.events || [];
      const messages = messagesRes.data || [];

      const combinedFeed = [
        ...events.map(event => ({ ...event, type: 'event' })),
        ...messages.map(message => ({ ...message, type: 'message' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFeed(combinedFeed);
      setHasNewEvents(eventsRes.data.hasNewEvents);
      
      setEvents(events);
    } catch (error) {
      console.error('Error refreshing feed:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    { text: 'View Profile', onClick: () => { navigate('/profile'); setMenuOpen(false); } },
    { text: 'Leaderboard', onClick: () => { navigate('/leaderboard'); setMenuOpen(false); } },
    { text: 'All Tasks', onClick: () => { navigate('/all-tasks'); setMenuOpen(false); } },
    { text: 'All Messages', onClick: () => { navigate('/messages'); setMenuOpen(false); } },
    ...(isAdmin ? [
      { text: 'Create Event', onClick: () => { setEventFormOpen(true); setMenuOpen(false); } },
      { text: 'Register User', onClick: () => { navigate('/register-user'); setMenuOpen(false); } },
      { text: 'Manage Users', onClick: () => { navigate('/manage-users'); setMenuOpen(false); } },
      { text: 'Create Message', onClick: () => { setMessageFormOpen(true); setMenuOpen(false); } },
      { text: 'Manage Messages', onClick: () => { navigate('/manage-messages'); setMenuOpen(false); } },
      { text: 'Completed Tasks', onClick: () => { navigate('/completed-tasks'); setMenuOpen(false); } }
    ] : []),
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
        console.log('Fetching events...');
        const response = await axios.get('/events', { 
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        console.log('Events response:', response.data);
        setEvents(response.data.events);
        setHasNewEvents(response.data.hasNewEvents);
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
      console.log('Marking events as viewed...');
      await axios.post('/events/mark-viewed', {}, { 
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setHasNewEvents(false);
      navigate('/events');
    } catch (error) {
      console.error('Error marking events as viewed:', error);
    }
  };

  const handleMessagesClick = async () => {
    try {
      // Check if there are unviewed messages
      const response = await axios.get('/messages/unviewed');
      const hasUnviewed = response.data.hasUnviewed;

      if (hasUnviewed) {
        // If there are unviewed messages, show the dialog
        setMessagesDialogOpen(true);
        setHasUnviewedMessages(false);
      } else {
        // If no unviewed messages, navigate to messages screen
        navigate('/messages');
      }
    } catch (error) {
      console.error('Error checking unviewed messages:', error);
    }
  };

  useEffect(() => {
    // Test direct axios call
    const testConnection = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        console.log('Test connection response:', response);
        const data = await response.json();
        console.log('Test connection data:', data);
      } catch (error) {
        console.error('Test connection error:', error);
      }
    };

    testConnection();
  }, []);

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
              src={formatAvatarUrl(user.avatarUrl)}
              sx={{ 
                mr: 2,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              onClick={() => navigate('/profile')}
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
              sx={{ mr: .25 }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleEventIconClick}
              sx={{ ml: 1 }}
            >
              <Badge
                variant="dot"
                color="error"
                invisible={!hasNewEvents}
              >
                <EventIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleMessagesClick}
              sx={{ 
                ml: 1,
                color: hasUnviewedMessages ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: '#fff'
                }
              }}
            >
              <Badge
                variant="dot"
                color="error"
                invisible={!hasUnviewedMessages}
              >
                <MessageIcon />
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
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={item.onClick}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
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

          {/* Only render MyEventsList if there are events */}
          {myEvents.length > 0 && (
            <Box sx={glassyBoxStyle}>
              <MyEventsList events={myEvents} />
            </Box>
          )}
        </Container>

        <EventForm 
          open={eventFormOpen} 
          handleClose={() => setEventFormOpen(false)} 
          onSubmit={async (eventData) => {
            try {
              const response = await axios.post('/events', eventData);
              await refreshFeed();
              setEventFormOpen(false);
            } catch (error) {
              console.error('Error creating event:', error);
            }
          }}
        />
        <MessageForm open={messageFormOpen} handleClose={() => setMessageFormOpen(false)} refreshMessages={refreshFeed} />
        <ActiveMessageDialog
          open={messageDialogOpen}
          onClose={() => setMessageDialogOpen(false)}
          message={activeMessage}
        />
        <MessagesDialog
          open={messagesDialogOpen}
          onClose={() => setMessagesDialogOpen(false)}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
