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
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import axios from '../utils/api';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import { formatAvatarUrl } from '../utils/avatarHelper';

const calculateStars = (points) => {
  let remainingPoints = points;
  
  // Calculate red stars (5000 points each - every 5 gold stars)
  const redStars = Math.floor(points / 5000);
  remainingPoints = points % 5000;

  // Calculate gold stars (1000 points each)
  let goldStars = Math.floor(remainingPoints / 1000);
  remainingPoints = remainingPoints % 1000;

  // Calculate silver stars (250 points each)
  let silverStars = Math.floor(remainingPoints / 250);
  remainingPoints = remainingPoints % 250;

  // Calculate bronze stars (50 points each)
  let bronzeStars = Math.floor(remainingPoints / 50);

  // Convert 4 silver stars to 1 gold star
  const additionalGoldStars = Math.floor(silverStars / 4);
  goldStars += additionalGoldStars;
  silverStars = silverStars % 4;

  // Convert 5 bronze stars to 1 silver star
  const additionalSilverStars = Math.floor(bronzeStars / 5);
  silverStars += additionalSilverStars;
  bronzeStars = bronzeStars % 5;

  return {
    red: redStars,
    gold: goldStars,
    silver: silverStars,
    bronze: bronzeStars
  };
};

const Stars = ({ points }) => {
  const stars = calculateStars(points);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      alignItems: 'center', 
      mt: 1,
      maxWidth: '70%',
      gap: 0.5
    }}>
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.5
      }}>
        {[...Array(stars.gold)].map((_, i) => (
          <StarIcon 
            key={`gold-${i}`} 
            sx={{ 
              color: '#DAA520',
              fontSize: '1rem'
            }} 
          />
        ))}
        {[...Array(stars.silver)].map((_, i) => (
          <StarIcon 
            key={`silver-${i}`} 
            sx={{ 
              color: '#A9A9A9',
              fontSize: '1rem'
            }} 
          />
        ))}
        {[...Array(stars.bronze)].map((_, i) => (
          <StarIcon 
            key={`bronze-${i}`} 
            sx={{ 
              color: '#1a4731',
              fontSize: '1rem'
            }} 
          />
        ))}
      </Box>
    </Box>
  );
};

const LeaderboardScreen = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/users/leaderboard');
        console.log('Leaderboard users:', response.data);
        const formattedUsers = response.data.map(user => ({
          ...user,
          avatarUrl: user.avatarUrl ? formatAvatarUrl(user.avatarUrl) : null
        }));
        setUsers(formattedUsers);
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
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  flexGrow: 1,
                  minWidth: 0
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      alt={user.name} 
                      src={user.avatarUrl || null}
                      sx={{ 
                        mr: 2,
                        width: 40,
                        height: 40,
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontSize: '1.2rem',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      minWidth: 0
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#2c3e50',
                          fontWeight: 'medium'
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Stars points={user.accountBalance} />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#d35400',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.accountBalance} pts
                  </Typography>
                  {calculateStars(user.accountBalance).red > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <MilitaryTechIcon 
                        sx={{ 
                          color: '#cc0000',
                          fontSize: '2rem',
                          filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))',
                          display: 'block'
                        }} 
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LeaderboardScreen;
