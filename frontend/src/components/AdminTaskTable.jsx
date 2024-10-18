// src/components/AdminTaskTable.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
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
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../utils/api';


const AdminTaskTable = ({ tasks, setTasks }) => {
  const [internalTasks, setInternalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Dialog state
  const [users, setUsers] = useState([]); // Store system users for the dropdown
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    points: '',
    priority: 1,
    assignedTo: '',
    image: null,
  });

  // Synchronize internalTasks with tasks prop using useEffect
  useEffect(() => {
    handleSetInternalTasks(tasks);
  }, [tasks]);

  // Function to set internalTasks and ensure state consistency
  const handleSetInternalTasks = (newTasks) => {
    if (Array.isArray(newTasks)) {
      setInternalTasks([...newTasks]);
    } else {
      console.warn('Invalid tasks format: expected an array.');
    }
  };

// Helper function to reorder tasks
const reorderTasks = (tasks, startIndex, endIndex) => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Sort tasks by priority
const sortTasksByPriority = (tasks) => tasks.sort((a, b) => a.priority - b.priority);

  // Edit task function
  const onEdit = async (task) => {
    try {
      const updatedTask = { ...task, name: task.name + ' (Edited)' }; // Example update
      await axios.put(`/tasks/${task._id}`, updatedTask, { withCredentials: true });

      // Update the task in the state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete task function
  const onDelete = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Fetch users from the backend to populate the dropdown
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

    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks', { withCredentials: true });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    setTasks(sortTasksByPriority(tasks));
  }, [tasks, setTasks]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
  
    setTasks(reorderedTasks); // Ensure state is updated correctly
  };

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
        priority: 1,
        assignedTo: '',
        image: null,
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {tasks.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ margin: 2 }}>
          There are no tasks in your list.
        </Typography>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <Stack spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ padding: 2, borderRadius: 2, display: 'flex', gap: 2 }}
                      >
                        {task.image && (
                          <Box
                            component="img"
                            src={task.image}
                            alt={task.name}
                            sx={{ width: '20%', height: 'auto', objectFit: 'cover' }}
                          />
                        )}
                        <Box display="flex" flexDirection="column" gap={1} sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{task.name}</Typography>
                          <Typography variant="body2">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">Priority: {task.priority}</Typography>
                          <Typography variant="body2">Points: {task.points}</Typography>
                          <Typography variant="body2">
                            Assigned To: {task.assignedTo?.name || 'Unassigned'}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Button variant="outlined" onClick={() => onEdit(task)}>
                              Edit
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => onDelete(task._id)}>
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ marginTop: 2 }}>
        Add New Task
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField name="name" label="Task Name" fullWidth value={newTask.name} onChange={handleChange} required />
          <TextField name="description" label="Description" fullWidth value={newTask.description} onChange={handleChange} />
          <TextField name="dueDate" type="date" fullWidth value={newTask.dueDate} onChange={handleChange} required />
          <TextField name="points" type="number" fullWidth value={newTask.points} onChange={handleChange} required />
          <TextField name="priority" type="number" fullWidth value={newTask.priority} onChange={handleChange} required />
          <FormControl fullWidth sx={{ marginTop: 2 }}>
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
          <Button component="label" sx={{ marginTop: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTask}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTaskTable;
