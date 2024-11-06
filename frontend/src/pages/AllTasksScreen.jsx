import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from '../utils/api';
import TaskCard from '../components/TaskCard';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomDialog from '../components/CustomDialog';
import TextField from '@mui/material/TextField';

const AllTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
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
    return (typeof task.assignedTo === 'string' && task.assignedTo === filter) ||
           (typeof task.assignedTo === 'object' && task.assignedTo._id === filter);
  });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
      fetchAllTasks(); // Refresh the tasks list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await axios.put(`/tasks/${editingTask._id}`, updatedTask, { withCredentials: true });
      setEditDialogOpen(false);
      setEditingTask(null);
      fetchAllTasks(); // Refresh the tasks list
    } catch (error) {
      console.error('Error updating task:', error);
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
            <InputLabel sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: 'white',
              }
            }}>
              Filter Tasks
            </InputLabel>
            <Select 
              value={filter} 
              onChange={handleFilterChange}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiSelect-select': {
                  color: 'white',
                },
                '& .MuiSvgIcon-root': { // Dropdown icon
                  color: 'white',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(26, 71, 49, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      },
                    },
                  },
                },
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
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </Box>
        </Container>

        <CustomDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleUpdateTask}
          title="Edit Task"
        >
          {editingTask && (
            <>
              <TextField name="name" label="Task Name" fullWidth defaultValue={editingTask.name} />
              <TextField name="description" label="Description" fullWidth defaultValue={editingTask.description} />
              <TextField name="dueDate" type="date" fullWidth defaultValue={editingTask.dueDate?.split('T')[0]} InputLabelProps={{ shrink: true }} />
              <TextField name="points" type="number" fullWidth defaultValue={editingTask.points} />
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select name="assignedTo" defaultValue={editingTask.assignedTo?._id || editingTask.assignedTo || ""}>
                  <MenuItem value="">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </CustomDialog>
      </Box>
    </ThemeProvider>
  );
};

export default AllTasksScreen;
