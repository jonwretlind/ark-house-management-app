import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckIcon from '@mui/icons-material/Check';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import arkLogo from '../../assets/logo.png'; // Ensure this path is correct
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const TaskCard = ({ task, onEdit, onDelete, isDragging, dragRef, showAssignedUser, currentUser, refreshTasks, showAssignedTo }) => {
  const theme = useTheme();
  const [assignedUserName, setAssignedUserName] = useState('');

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (task.assignedTo && task.assignedTo !== "Unassigned") {
        try {
          const response = await axios.get(`/users/${task.assignedTo}`, { withCredentials: true });
          setAssignedUserName(response.data.name);
        } catch (error) {
          console.error('Error fetching assigned user:', error);
          setAssignedUserName('Unknown User');
        }
      } else {
        setAssignedUserName('Unassigned');
      }
    };

    if (showAssignedTo) {
      fetchAssignedUser();
    }
  }, [task.assignedTo, showAssignedTo]);

  const handleComplete = async () => {
    try {
      await axios.put(`/tasks/${task._id}/complete`, {}, { withCredentials: true });
      refreshTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleAssignToSelf = async () => {
    try {
      if (!currentUser || !currentUser._id) {
        console.error('Current user is undefined or missing _id');
        return;
      }
      console.log('Assigning task:', task._id, 'to user:', currentUser._id);
      const response = await axios.put(`/tasks/${task._id}/assign`, { userId: currentUser._id }, { withCredentials: true });
      console.log('Assignment response:', response.data);
      refreshTasks();
    } catch (error) {
      console.error('Error assigning task:', error.response?.data || error.message);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(`/tasks/${task._id}/approve`, {}, { withCredentials: true });
      refreshTasks();
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  const isAssignedToCurrentUser = currentUser && task.assignedTo && 
    (task.assignedTo === currentUser._id || 
     (typeof task.assignedTo === 'object' && task.assignedTo._id === currentUser._id));
  
  const isUnassigned = !task.assignedTo || task.assignedTo === "Unassigned" || 
    (typeof task.assignedTo === 'object' && task.assignedTo.name === "Unassigned");

  return (
    <Paper
      ref={dragRef}
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <img src={task.icon || arkLogo} alt="Task icon" style={{ width: 30, height: 30, marginRight: 10 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '-.25px' }}>
          {task.name}
        </Typography>
        {isAssignedToCurrentUser && task.status === 'active' && (
          <IconButton onClick={handleComplete} aria-label="complete task" size="small" sx={{ color: theme.palette.success.main }}>
            <CheckIcon fontSize="small" />
          </IconButton>
        )}
        {currentUser && currentUser.isAdmin && task.status === 'pending_approval' && (
          <IconButton onClick={handleApprove} aria-label="approve task" size="small" sx={{ color: theme.palette.success.main }}>
            <ThumbUpIcon fontSize="small" />
          </IconButton>
        )}
        {isUnassigned && currentUser && (
          <IconButton 
            onClick={handleAssignToSelf} 
            aria-label="assign to self" 
            size="small" 
            sx={{ 
              color: showAssignedUser ? theme.palette.primary.main : theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: 'rgba(26, 71, 49, 0.1)',
              },
            }}
          >
            <AssignmentIcon fontSize="small" />
          </IconButton>
        )}
        {currentUser && currentUser.isAdmin && (
          <>
            <IconButton onClick={() => onEdit(task)} aria-label="edit" size="small" sx={{ color: theme.palette.primary.main }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => onDelete(task._id)} aria-label="delete" size="small" sx={{ color: theme.palette.secondary.main }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>
      <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 1 }}>
        {task.description}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 0.5 }}>
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
        Points: {task.points}
      </Typography>
      {showAssignedTo && (
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mt: 1 }}>
          Assigned To: {assignedUserName}
        </Typography>
      )}
    </Paper>
  );
};

export default TaskCard;
