import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../utils/api';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/messages');
      // Sort messages by date, newest first
      const sortedMessages = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
              Messages
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1 }}>
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
                      Posted: {new Date(message.createdAt).toLocaleDateString()}
                    </Typography>
                    {message.isReadByCurrentUser && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#95a5a6',
                          fontStyle: 'italic'
                        }}
                      >
                        • Read
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MessagesScreen; 