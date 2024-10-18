// src/components/TaskList.jsx
import React from 'react';
import { Box, Stack, Typography, Paper } from '@mui/material';

const TaskList = ({ tasks }) => {
  return (
    <Box sx={{ padding: 2 }}>
    {/* Show message if no tasks are available */}
    {tasks.length === 0 ? (
      <Typography variant="h6" align="center" sx={{ margin: 2 }}>
        There are no tasks in your list.
      </Typography>
    ) : (
    <Stack spacing={2} sx={{ padding: 2 }}>
      {tasks.map((task) => (
        <Paper key={task._id} sx={{ padding: 2, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">{task.name}</Typography>
            <Typography variant="body2">Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>
            <Typography variant="body2">Priority: {task.priority}</Typography>
            <Typography variant="body2">Points: {task.points}</Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  )}
    </Box>
  );
};

export default TaskList;
