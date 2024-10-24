import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../utils/api';
import arkLogo from '../../assets/logo.png'; // Ensure this path is correct

const CompletedTaskCard = ({ task, refreshTasks }) => {
  const handleUnassignTask = async () => {
    try {
      await axios.put(`/tasks/${task._id}/unassign`);
      refreshTasks();
    } catch (error) {
      console.error('Error unassigning task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`/tasks/${task._id}`);
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={task.icon || arkLogo} alt="Task icon" style={{ width: 30, height: 30, marginRight: 10 }} />
            <Typography variant="h6" sx={{ color: 'rgba(0, 0, 0, 0.87)', fontWeight: 'bold' }}>
              {task.name}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleUnassignTask} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={handleDeleteTask} color="secondary">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CompletedTaskCard;
