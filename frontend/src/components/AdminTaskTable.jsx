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
  CircularProgress,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from '../utils/api';
import defaultPlaceholder from '../../assets/placeholder.png'; // Placeholder image

const AdminTaskTable = ({ tasks, setTasks }) => {
  const [internalTasks, setInternalTasks] = useState([]);
  const [loading, setLoading] = useState({});
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    points: '',
    priority: 1,
    assignedTo: '',
    image: null,
  });

  // Synchronize tasks with internal state
  useEffect(() => {
    handleSetInternalTasks(tasks);
  }, [tasks]);

  // Function to generate images only once per task and maintain state
  const handleSetInternalTasks = async (newTasks) => {
    const tasksWithImages = await Promise.all(
      newTasks.map(async (task) => {
        if (!task.imageUrl) {
          setLoading((prev) => ({ ...prev, [task._id]: true }));
          try {
            const response = await axios.post('/ai-image/generate-image', {
              taskName: task.name,
              description: task.description,
            });
            return { ...task, imageUrl: response.data.imageUrl };
          } catch (error) {
            console.error(`Failed to generate image for ${task.name}`, error);
            return { ...task, imageUrl: '' }; // Use empty URL as fallback
          } finally {
            setLoading((prev) => ({ ...prev, [task._id]: false }));
          }
        }
        return task;
      })
    );
    setInternalTasks(tasksWithImages);
  };

  // Reorder tasks during drag-and-drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = reorderTasks(internalTasks, result.source.index, result.destination.index);
    setInternalTasks(reorderedTasks);
    setTasks(reorderedTasks);
  };

  const reorderTasks = (tasks, startIndex, endIndex) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handle form changes
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

  // Fetch users for dropdown
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

  return (
    <Box sx={{ padding: 2 }}>
      {internalTasks.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ margin: 2 }}>
          There are no tasks in your list.
        </Typography>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <Stack spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
                {internalTasks.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ padding: 2, display: 'flex', gap: 2 }}
                      >
                        <Box sx={{ width: '100px', height: '100px' }}>
                          {loading[task._id] ? (
                            <CircularProgress />
                          ) : task.imageUrl ? (
                            <img
                              src={task.imageUrl}
                              alt={task.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <img
                              src={defaultPlaceholder}
                              alt="Placeholder"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
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
          <TextField name="name" label="Task Name" fullWidth value={newTask.name} onChange={handleChange} />
          <TextField name="description" label="Description" fullWidth value={newTask.description} onChange={handleChange} />
          <TextField name="dueDate" type="date" fullWidth value={newTask.dueDate} onChange={handleChange} />
          <TextField name="points" type="number" fullWidth value={newTask.points} onChange={handleChange} />
          <TextField name="priority" type="number" fullWidth value={newTask.priority} onChange={handleChange} />
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
