// src/components/TaskList.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, IconButton, Tabs, Tab, styled, useTheme } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from '../utils/api';
import TaskCard from './TaskCard';

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

const TaskItem = ({ task, refreshTasks, currentUser }) => {
  return (
    <TaskCard
      task={task}
      currentUser={currentUser}
      refreshTasks={refreshTasks}
      showAssignedUser={true}
    />
  );
};

const TaskList = ({ tasks, setTasks, currentUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get('/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [setTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [userTasks, unassignedTasks] = useMemo(() => {
    const userTasks = tasks.filter(task => 
      task.assignedTo && 
      (task.assignedTo._id === currentUser._id || task.assignedTo === currentUser._id) &&
      task.status === 'active'
    );
    const unassignedTasks = tasks.filter(task => 
      !task.assignedTo || 
      task.assignedTo === "Unassigned" || 
      (task.assignedTo && task.assignedTo.name === "Unassigned")
    );
    return [userTasks, unassignedTasks];
  }, [tasks, currentUser]);

  const tabsToShow = [
    { label: "My Tasks", content: userTasks },
    { label: "Unassigned", content: unassignedTasks },
  ];

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
              padding: '6px 12px',
            },
          }}
        >
          {tabsToShow.map((tab, index) => (
            <LightTab key={index} label={tab.label} sx={{ color: theme.palette.text.primary }} />
          ))}
        </LightTabs>

        <Box sx={{ mt: 2 }}>
          {tabsToShow[tabValue] && tabsToShow[tabValue].content.map((task) => (
            <TaskItem
              key={task._id ? task._id.toString() : task.id}
              task={task}
              refreshTasks={fetchTasks}
              currentUser={currentUser}
            />
          ))}
        </Box>
      </Box>
    </DndProvider>
  );
};

export default TaskList;
