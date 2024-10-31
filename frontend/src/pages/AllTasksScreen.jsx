import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import axios from '../utils/api';
import TaskCard from '../components/TaskCard';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTasks();
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get('/tasks', { withCredentials: true });
      const incompleteTasks = response.data.filter(task => !task.isCompleted);
      setTasks(incompleteTasks);
    } catch (error) {
      console.error('Error fetching all tasks:', error.response || error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Unassigned') {
      return !task.assignedTo || 
             task.assignedTo === "Unassigned" || 
             (typeof task.assignedTo === 'object' && task.assignedTo.name === "Unassigned");
    }
    return (typeof task.assignedTo === 'object' && task.assignedTo._id === filter);
  });

  const getSelectedUserName = () => {
    if (filter === 'All') return 'Filter Tasks';
    if (filter === 'Unassigned') return 'Unassigned';
    const selectedUser = users.find(user => user._id === filter);
    return selectedUser ? selectedUser.name : 'Filter Tasks';
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
              All Tasks
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
          <FormControl 
            fullWidth 
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                backgroundColor: '#1a4731',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.18)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d35400',
                },
              },
              '& .MuiSelect-icon': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
            <Select
              value={filter}
              onChange={handleFilterChange}
              displayEmpty
              renderValue={getSelectedUserName}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(52, 73, 94, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="All">All Tasks</MenuItem>
              <MenuItem value="Unassigned">Unassigned</MenuItem>
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ position: 'relative', minHeight: '200px' }}>
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                currentUser={currentUser}
                refreshTasks={fetchAllTasks}
                showAssignedTo={true}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AllTasksScreen;
