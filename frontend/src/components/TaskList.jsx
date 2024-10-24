// src/components/TaskList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import TaskCard from './TaskCard';
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const TaskList = ({ tasks, setTasks, currentUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filterTasks = () => {
    switch (tabValue) {
      case 0: // My Tasks
        return tasks.filter(task => task.assignedTo && task.assignedTo._id === currentUser._id);
      case 1: // Unassigned Tasks
        return tasks.filter(task => !task.assignedTo || task.assignedTo === "Unassigned");
      case 2: // Completed Tasks
        return tasks.filter(task => task.isCompleted && task.assignedTo && task.assignedTo._id === currentUser._id);
      default:
        return tasks;
    }
  };

  const handleEditTask = (task) => {
    // Implement edit functionality here
    console.log('Edit task:', task);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`, { withCredentials: true });
      fetchTasks(); // Refresh the task list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Box>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="task tabs"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.secondary.main,
          },
          '& .MuiTab-root': {
            minWidth: 'auto',
            padding: '6px 12px', // Reduce padding here
            color: theme.palette.text.primary,
          },
        }}
      >
        <Tab label="My Tasks" />
        <Tab label="Unassigned Tasks" />
        <Tab label="Completed Tasks" />
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {filterTasks().map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            currentUser={currentUser}
            refreshTasks={fetchTasks}
            showAssignedUser={tabValue === 1}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TaskList;
