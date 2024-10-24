// src/components/AdminTaskTable.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  styled,
  useTheme,
} from '@mui/material';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from '../utils/api';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';
import update from 'immutability-helper';
import CustomDialog from './CustomDialog';

// Import all icon images from the assets/icons folder
import logo from '../../assets/logo.png';

// Update the dynamic import to use the new syntax
const iconContext = import.meta.glob('../../assets/icons/*.{png,jpg,jpeg,svg}', { eager: true, query: '?url', import: 'default' });
const iconOptions = Object.values(iconContext);

// Styled components for light-colored tabs
const LightTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.common.white,
  },
}));

const LightTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.grey[300],
  '&.Mui-selected': {
    color: theme.palette.common.white,
  },
}));

const TaskItem = ({ task, index, moveTask, onEdit, onDelete, tabIndex, currentUser, refreshTasks }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover(item, monitor) {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
        showAssignedUser={tabIndex === 2}
        currentUser={currentUser}
        refreshTasks={refreshTasks}
      />
    </div>
  );
};

const AdminTaskTable = ({ tasks, setTasks, currentUser }) => {
  const theme = useTheme();
  const [internalTasks, setInternalTasks] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    points: '',
    assignedTo: '',
    icon: '',
  });
  const [tabValue, setTabValue] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  const filterTasks = useCallback((tasks) => {
    const userTasks = tasks.filter(task => 
      task.assignedTo && 
      (task.assignedTo._id === currentUser._id || task.assignedTo === currentUser._id)
    );
    const unassignedTasks = tasks.filter(task => 
      !task.assignedTo || 
      task.assignedTo === "Unassigned" || 
      (task.assignedTo && task.assignedTo.name === "Unassigned")
    );
    const otherUserTasks = tasks.filter(task => 
      task.assignedTo && 
      task.assignedTo !== "Unassigned" && 
      task.assignedTo._id !== currentUser._id && 
      task.assignedTo !== currentUser._id &&
      task.assignedTo.name !== "Unassigned"
    );
    console.log('Filtered tasks:', { userTasks, unassignedTasks, otherUserTasks });
    return [userTasks, unassignedTasks, otherUserTasks];
  }, [currentUser]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const formattedTasks = tasks.map((task, index) => ({
        ...task,
        _id: task._id ? task._id.toString() : task._id,
        priority: index + 1 // Set priority based on the order
      }));
      setInternalTasks(formattedTasks);
      console.log('Formatted tasks:', formattedTasks);
      
      const [userTasks, unassignedTasks, otherUserTasks] = filterTasks(formattedTasks);
      console.log('User tasks:', userTasks);
      console.log('Unassigned:', unassignedTasks);
      console.log('Other:', otherUserTasks);
    }
  }, [tasks, filterTasks]);

  const moveTask = useCallback((dragIndex, hoverIndex) => {
    setInternalTasks((prevTasks) => {
      const updatedTasks = update(prevTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTasks[dragIndex]],
        ],
      });
      setHasChanges(true);
      return updatedTasks;
    });
  }, []);

  const updateTaskPriorities = useCallback(async () => {
    if (internalTasks.length === 0 || isUpdating || !hasChanges) return;

    setIsUpdating(true);
    try {
      const updatedPriorities = internalTasks.map((task, index) => ({
        id: task._id,
        priority: index + 1
      }));

      await axios.put('/tasks/update-priorities', { priorities: updatedPriorities }, { withCredentials: true });
      
      // Update the main tasks state
      setTasks(internalTasks);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating task priorities:', error.response?.data || error.message);
    } finally {
      setIsUpdating(false);
    }
  }, [internalTasks, setTasks, isUpdating, hasChanges]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasChanges) {
        updateTaskPriorities();
      }
    }, 2000); // Increased debounce time to 2 seconds

    return () => clearTimeout(timer);
  }, [hasChanges, updateTaskPriorities]);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewTask({ ...newTask, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTask = async () => {
    try {
      const response = await axios.post('/tasks', newTask, { withCredentials: true });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setOpen(false);
      setNewTask({
        name: '',
        description: '',
        dueDate: '',
        points: '',
        assignedTo: '',
        image: null,
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleEditTask = (task) => {
    setNewTask(task);
    setOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateOrUpdateTask = async () => {
    try {
      const taskData = {
        name: newTask.name,
        description: newTask.description,
        dueDate: newTask.dueDate,
        points: newTask.points,
        assignedTo: newTask.assignedTo || "Unassigned",
        icon: newTask.icon || logo, // Use logo as default if no icon is selected
      };

      if (newTask._id) {
        // Update existing task
        const response = await axios.put(`/tasks/${newTask._id}`, taskData, { withCredentials: true });
        console.log('Task updated:', response.data);
        setTasks((prevTasks) => prevTasks.map((task) => task._id === newTask._id ? response.data : task));
      } else {
        // Create new task
        console.log('Creating new task with data:', taskData);
        const response = await axios.post('/tasks', taskData, { withCredentials: true });
        console.log('New task created:', response.data);
        setTasks((prevTasks) => [response.data, ...prevTasks]); // Add new task to the top of the list
      }
      setOpen(false);
      setNewTask({
        name: '',
        description: '',
        dueDate: '',
        points: '',
        assignedTo: '',
        icon: '',
      });
      
      // Fetch updated tasks
      const updatedTasksResponse = await axios.get('/tasks', { withCredentials: true });
      setTasks(updatedTasksResponse.data);
    } catch (error) {
      console.error('Error creating/updating task:', error.response?.data || error.message);
      // You can add user feedback here, e.g., using a snackbar or alert
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [userTasks, unassignedTasks, otherUserTasks] = useMemo(() => filterTasks(internalTasks), [filterTasks, internalTasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const renderTaskList = (taskList, tabIndex) => (
    <div>
      {taskList.map((task, index) => (
        <TaskItem
          key={task._id ? task._id.toString() : index}
          task={task}
          index={index}
          moveTask={moveTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          tabIndex={tabIndex}
          currentUser={currentUser}
          refreshTasks={fetchTasks}
        />
      ))}
    </div>
  );

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: 2,
    marginBottom: 2,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ padding: 1 }}>
        <LightTabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="task tabs"
          sx={{ 
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
            },
            '& .MuiTabs-flexContainer': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
            '& .MuiTab-root': {
              minWidth: 'auto',
              padding: '6px 12px', // Reduce padding here
            },
          }}
        >
          <LightTab label="My Tasks" sx={{ color: theme.palette.text.primary }} />
          <LightTab label="Unassigned" sx={{ color: theme.palette.text.primary }} />
          <LightTab label="Other" sx={{ color: theme.palette.text.primary }} />
        </LightTabs>

        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && renderTaskList(userTasks, 0)}
          {tabValue === 1 && renderTaskList(unassignedTasks, 1)}
          {tabValue === 2 && renderTaskList(otherUserTasks, 2)}
        </Box>

        <IconButton 
          onClick={() => setOpen(true)} 
          sx={{ 
            marginTop: 2,
            ...glassyBoxStyle,
            width: 56,
            height: 56,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }} 
          aria-label="add task"
        >
          <AddIcon />
        </IconButton>

        <CustomDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleCreateOrUpdateTask}
          title={newTask._id ? 'Edit Task' : 'Create New Task'}
        >
          <TextField name="name" label="Task Name" fullWidth value={newTask.name} onChange={handleChange} sx={{ mt: 2 }} />
          <TextField name="description" label="Description" fullWidth value={newTask.description} onChange={handleChange} sx={{ mt: 2 }} />
          <TextField name="dueDate" type="date" fullWidth value={newTask.dueDate} onChange={handleChange} sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField name="points" type="number" fullWidth value={newTask.points} onChange={handleChange} sx={{ mt: 2 }} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Assign To</InputLabel>
            <Select name="assignedTo" value={newTask.assignedTo} onChange={handleChange}>
              <MenuItem value="">Unassigned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
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
    </DndProvider>
  );
};

export default AdminTaskTable;
