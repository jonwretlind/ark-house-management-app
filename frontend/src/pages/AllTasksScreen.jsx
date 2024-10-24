import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import axios from '../utils/api';
import TaskCard from '../components/TaskCard'; // Assuming TaskCard is used to display tasks
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

// Styled components for the dark glassy dropdown
const DarkGlassySelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `2px solid ${theme.palette.secondary.main}`,
  },
  padding: '5px 15px',
  borderRadius: '15px',
}));

const DarkGlassyMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  },
}));

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
      const incompleteTasks = response.data.filter(task => !task.isCompleted); // Filter tasks
      console.log('Fetched tasks:', incompleteTasks); // Log fetched tasks
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
      // Handle the error, maybe redirect to login
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
    return (typeof task.assignedTo === 'string' && task.assignedTo === filter) ||
           (typeof task.assignedTo === 'object' && task.assignedTo._id === filter);
  });

  console.log('Filtered tasks:', filteredTasks); // Log filtered tasks

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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <DarkGlassySelect
              value={filter}
              onChange={handleFilterChange}
              displayEmpty
            >
              <DarkGlassyMenuItem value="All">All Tasks</DarkGlassyMenuItem>
              <DarkGlassyMenuItem value="Unassigned">Unassigned</DarkGlassyMenuItem>
              {users.map(user => (
                <DarkGlassyMenuItem key={user._id} value={user._id}>
                  {user.name}
                </DarkGlassyMenuItem>
              ))}
            </DarkGlassySelect>
          </FormControl>
          <Box sx={{ position: 'relative', minHeight: '200px' }}>
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                currentUser={currentUser}
                refreshTasks={fetchAllTasks}
                showAssignedTo={true}
                onEdit={() => {}} // Add an edit handler if needed
                onDelete={async (taskId) => {
                  try {
                    await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
                    fetchAllTasks();
                  } catch (error) {
                    console.error('Error deleting task:', error);
                  }
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AllTasksScreen;
