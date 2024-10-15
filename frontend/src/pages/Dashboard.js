// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');  // Fetch tasks from the backend
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskComplete = async (taskId) => {
    try {
      await axios.post(`/api/tasks/complete/${taskId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(tasks.filter(task => task._id !== taskId));  // Remove completed task from UI
    } catch (error) {
      console.error('Error completing task', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Task Dashboard</Typography>
      <Grid container spacing={2}>
        {tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.name}</Typography>
                <Typography variant="body2">Points: {task.points}</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleTaskComplete(task._id)}
                >
                  Complete Task
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
