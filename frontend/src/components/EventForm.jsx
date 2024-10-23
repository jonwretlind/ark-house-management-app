import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const EventForm = ({ open, handleClose, refreshEvents }) => {
  const [event, setEvent] = useState({ name: '', location: '', date: '', time: '', description: '' });
  const theme = useTheme();

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  };

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/events', event, { withCredentials: true });
      refreshEvents();
      handleClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        style: {
          ...glassyBoxStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="normal" name="name" label="Event Name" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="location" label="Location" onChange={handleChange} />
        <TextField fullWidth margin="normal" name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="time" label="Time" type="time" InputLabelProps={{ shrink: true }} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="description" label="Description" multiline rows={4} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;
