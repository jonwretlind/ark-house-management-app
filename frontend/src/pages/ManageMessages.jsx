import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Badge,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import axios from '../utils/api';
import MessageForm from '../components/MessageForm';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasNewEvents, setHasNewEvents] = useState(false);
  const [hasUnviewedMessages, setHasUnviewedMessages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    checkNotifications();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      navigate('/');
    }
  };

  const checkNotifications = async () => {
    try {
      const eventsResponse = await axios.get('/events');
      setHasNewEvents(eventsResponse.data.hasNewEvents);
      
      const unviewedResponse = await axios.get('/messages/unviewed');
      setHasUnviewedMessages(unviewedResponse.data.hasUnviewed);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const handleEdit = (message) => {
    setSelectedMessage(message);
    setIsFormOpen(true);
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`/messages/${messageId}`);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMessage(null);
    fetchMessages();
  };

  const handleEventIconClick = async () => {
    try {
      await axios.post('/events/mark-viewed', {}, { withCredentials: true });
      setHasNewEvents(false);
      navigate('/events');
    } catch (error) {
      console.error('Error marking events as viewed:', error);
    }
  };

  const handleMessagesClick = () => {
    navigate('/messages');
    setHasUnviewedMessages(false);
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
            backgroundColor: '#1a4731',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
              Manage Messages
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
            >
              New Message
            </Button>
          </Box>

          {messages.map((message) => (
            <Paper 
              key={message._id} 
              sx={{
                p: 3,
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#1a4731',
                      mb: 1
                    }}
                  >
                    {message.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      color: '#2c3e50',
                      lineHeight: 1.6
                    }}
                  >
                    {message.content}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      Created: {new Date(message.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: message.isActive ? '#2ecc71' : '#95a5a6',
                        fontWeight: 'bold'
                      }}
                    >
                      {message.isActive ? '● Active' : '○ Inactive'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleEdit(message)}
                    sx={{ 
                      color: '#1a4731',
                      '&:hover': { backgroundColor: 'rgba(26, 71, 49, 0.1)' }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(message._id)}
                    sx={{ 
                      color: '#e74c3c',
                      '&:hover': { backgroundColor: 'rgba(231, 76, 60, 0.1)' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        <MessageForm
          open={isFormOpen}
          handleClose={handleFormClose}
          message={selectedMessage}
        />
      </Box>
    </ThemeProvider>
  );
};

export default ManageMessages;