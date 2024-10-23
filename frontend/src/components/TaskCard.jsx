import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import arkLogo from '../../assets/logo.png'; // Ensure this path is correct
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const TaskCard = ({ task, onEdit, onDelete, isDragging, dragRef, showAssignedUser }) => {
  const [assignedUserName, setAssignedUserName] = useState('Unassigned');
  const theme = useTheme();

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (task.assignedTo && task.assignedTo !== 'Unassigned') {
        try {
          const response = await axios.get(`/users/${task.assignedTo}`, { withCredentials: true });
          setAssignedUserName(response.data.name);
        } catch (error) {
          console.error('Error fetching assigned user:', error);
          setAssignedUserName('Unknown');
        }
      } else {
        setAssignedUserName('Unassigned');
      }
    };

    fetchAssignedUser();
  }, [task.assignedTo]);

  return (
    <Paper
      ref={dragRef}
      sx={{
        padding: 2,
        display: 'flex',
        gap: 2,
        backgroundColor: isDragging ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        opacity: isDragging ? 0.8 : 1,
        cursor: 'move',
        marginBottom: 2,
        transition: 'all 0.3s ease',
        borderRadius: '15px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
          backgroundColor: 'rgba(255,255,255,0.8)',
        },
      }}
    >
      <Box sx={{ width: '100px', height: '100px' }}>
        <img
          src={task.icon || arkLogo}
          alt={task.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, paddingTop: '20px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>{task.name}</Typography>
        <Typography variant="body2" sx={{ color: '#555' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>
        <Typography variant="body2" sx={{ color: '#555' }}>Points: {task.points}</Typography>
        {showAssignedUser && (
          <Typography variant="body2" sx={{ color: '#555' }}>
            Assigned To: {assignedUserName}
          </Typography>
        )}
      </Box>
      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex' }}>
        <IconButton onClick={() => onEdit(task)} aria-label="edit" size="small" sx={{ color: theme.palette.primary.main }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => onDelete(task._id)} aria-label="delete" size="small" sx={{ color: theme.palette.secondary.main }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TaskCard;
