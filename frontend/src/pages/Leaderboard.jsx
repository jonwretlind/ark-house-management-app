// src/pages/Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/leaderboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Leaderboard</Typography>
      <List>
        {leaderboard.map((entry, index) => (
          <ListItem key={entry.userId}>
            <ListItemText
              primary={`${index + 1}. ${entry.userId.name}`}
              secondary={`Points: ${entry.totalPoints}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Leaderboard;
