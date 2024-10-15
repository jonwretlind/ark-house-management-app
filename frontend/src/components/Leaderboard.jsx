// src/components/Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Leaderboard</Typography>
      <List>
        {leaderboard.map((entry, index) => (
          <ListItem key={entry.userId}>
            <ListItemText
              primary={`${index + 1}. ${entry.userName}`}
              secondary={`Points: ${entry.totalPoints}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Leaderboard;
