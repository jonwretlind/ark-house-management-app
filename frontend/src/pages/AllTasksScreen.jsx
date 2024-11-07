import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, ThemeProvider, CssBaseline, AppBar, Toolbar, IconButton, Select, MenuItem, FormControl, InputLabel, Fab } from '@mui/material';
import axios from '../utils/api';
import TaskCard from '../components/TaskCard';
import theme from '../theme';
import backgroundImage from '../../assets/screen2.png';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomDialog from '../components/CustomDialog';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import logo from '../../assets/logo.png';

const iconContext = import.meta.glob('../../assets/icons/*.{png,jpg,jpeg,svg}', { eager: true, query: '?url', import: 'default' });
const iconOptions = Object.values(iconContext);

const AllTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    points: '',
    assignedTo: '',
    icon: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTasks();
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get('/tasks', { withCredentials: true });
      const incompleteTasks = response.data.filter(task => !task.isCompleted).map(task => ({
        ...task,
        assignedTo: task.assignedTo || "Unassigned"
      }));
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
             (typeof task.assignedTo === 'object' && !task.assignedTo._id);
    }
    return (typeof task.assignedTo === 'object' && task.assignedTo._id === filter);
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

  const handleCreateTask = async (formData) => {
    try {
      const taskData = {
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate,
        points: parseInt(formData.points),
        assignedTo: formData.assignedTo || "Unassigned",
        icon: formData.icon || logo,
      };

      await axios.post('/tasks', taskData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCreateDialogOpen(false);
      fetchAllTasks();
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error);
    }
  };

  const handleChange = (e) => {
    setNewTask({ 
      ...newTask, 
      [e.target.name]: e.target.value 
    });
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

        {currentUser && currentUser.isAdmin && (
          <Fab 
            color="primary" 
            aria-label="add" 
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
          >
            <AddIcon />
          </Fab>
        )}

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
              <TextField 
                name="name" 
                label="Task Name" 
                fullWidth 
                defaultValue={editingTask.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField 
                name="description" 
                label="Description" 
                fullWidth 
                defaultValue={editingTask.description}
                multiline
                rows={4}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField 
                name="dueDate" 
                type="date" 
                fullWidth 
                defaultValue={editingTask.dueDate?.split('T')[0]} 
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField 
                name="points" 
                type="number" 
                fullWidth 
                defaultValue={editingTask.points}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Assign To</InputLabel>
                <Select 
                  name="assignedTo" 
                  defaultValue={editingTask.assignedTo?._id || editingTask.assignedTo || "Unassigned"}
                  label="Assign To"
                  onChange={handleChange}
                >
                  <MenuItem value="Unassigned">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Icon</InputLabel>
                <Select
                  name="icon"
                  value={newTask.icon || editingTask.icon || ""}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img src={selected || logo} alt="Task icon" style={{ width: 30, height: 30, marginRight: 10 }} />
                      {selected ? selected.split('/').pop() : 'Default Logo'}
                    </Box>
                  )}
                >
                  <MenuItem value="">
                    <em>Default Logo</em>
                  </MenuItem>
                  {iconOptions.map((icon, index) => (
                    <MenuItem key={index} value={icon}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={icon} alt={`Icon ${index + 1}`} style={{ width: 30, height: 30, marginRight: 10 }} />
                        {icon.split('/').pop()}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </CustomDialog>

        <CustomDialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            setNewTask({
              name: '',
              description: '',
              dueDate: '',
              points: '',
              assignedTo: '',
              icon: '',
            });
          }}
          onSubmit={() => handleCreateTask(newTask)}
          title="Create New Task"
        >
          <TextField 
            name="name" 
            label="Task Name" 
            fullWidth 
            required
            value={newTask.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField 
            name="description" 
            label="Description" 
            fullWidth 
            multiline
            rows={4}
            value={newTask.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField 
            name="dueDate" 
            type="date" 
            fullWidth 
            required
            value={newTask.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            label="Due Date"
            sx={{ mb: 2 }}
          />
          <TextField 
            name="points" 
            type="number" 
            label="Points" 
            fullWidth 
            required
            value={newTask.points}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assign To</InputLabel>
            <Select 
              name="assignedTo" 
              value={newTask.assignedTo}
              onChange={handleChange}
              label="Assign To"
            >
              <MenuItem value="Unassigned">Unassigned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Icon</InputLabel>
            <Select
              name="icon"
              value={newTask.icon}
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src={selected || logo} alt="Task icon" style={{ width: 30, height: 30, marginRight: 10 }} />
                  {selected ? selected.split('/').pop() : 'Default Logo'}
                </Box>
              )}
            >
              <MenuItem value="">
                <em>Default Logo</em>
              </MenuItem>
              {iconOptions.map((icon, index) => (
                <MenuItem key={index} value={icon}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={icon} alt={`Icon ${index + 1}`} style={{ width: 30, height: 30, marginRight: 10 }} />
                    {icon.split('/').pop()}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CustomDialog>
      </Box>
    </ThemeProvider>
  );
};

export default AllTasksScreen;
