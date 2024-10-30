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
import UserAvatar from '../components/UserAvatar';

const LeaderboardScreen = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/leaderboard');
        console.log('Leaderboard response:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

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
              Leaderboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          {users.map((user, index) => (
            <Paper 
              key={user._id} 
              sx={{
                p: 3,
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                position: 'relative',
                overflow: 'hidden',
                borderLeft: index === 0 ? '5px solid #FFD700' :
                            index === 1 ? '5px solid #C0C0C0' :
                            index === 2 ? '5px solid #CD7F32' :
                            '5px solid transparent',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                },
                '& .MuiTypography-root': {
                  color: '#2c3e50',
                },
                '& .rank-text': {
                  color: '#666',
                },
                '& .points-badge': {
                  backgroundColor: index === 0 ? '#FFD700' :
                                  index === 1 ? '#C0C0C0' :
                                  index === 2 ? '#CD7F32' :
                                  '#1a4731',
                  color: index <= 2 ? '#000' : '#fff',
                  boxShadow: index <= 2 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <UserAvatar 
                    user={user} 
                    size={48} 
                    sx={{ 
                      mr: 2,
                      border: `2px solid ${
                        index === 0 ? '#FFD700' :
                        index === 1 ? '#C0C0C0' :
                        index === 2 ? '#CD7F32' :
                        '#1a4731'
                      }`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'medium',
                        color: '#2c3e50',
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="rank-text"
                      sx={{ 
                        color: '#666',
                      }}
                    >
                      {index === 0 ? 'Gold' : 
                       index === 1 ? 'Silver' : 
                       index === 2 ? 'Bronze' : 
                       `Rank #${index + 1}`}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="h6" 
                  className="points-badge"
                  sx={{ 
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: index === 0 ? '#FFD700' :
                                    index === 1 ? '#C0C0C0' :
                                    index === 2 ? '#CD7F32' :
                                    '#1a4731',
                    color: index <= 2 ? '#000' : '#fff',
                    boxShadow: index <= 2 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  }}
                >
                  {user.accountBalance} pts
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LeaderboardScreen;
