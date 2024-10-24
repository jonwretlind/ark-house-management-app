import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import axios from '../utils/api';
import CustomDialog from './CustomDialog';

const EventForm = ({ open, handleClose, refreshEvents, event }) => {
  const [eventData, setEventData] = useState({ name: '', location: '', date: '', time: '', description: '' });

  useEffect(() => {
    if (event) {
      setEventData(event);
    } else {
      setEventData({ name: '', location: '', date: '', time: '', description: '' });
    }
  }, [event]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (event) {
        await axios.put(`/events/${event._id}`, eventData, { withCredentials: true });
      } else {
        await axios.post('/events', eventData, { withCredentials: true });
      }
      refreshEvents();
      handleClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={event ? 'Edit Event' : 'Create New Event'}
    >
      <TextField fullWidth margin="normal" name="name" label="Event Name" value={eventData.name} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="location" label="Location" value={eventData.location} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} value={eventData.date} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="time" label="Time" type="time" InputLabelProps={{ shrink: true }} value={eventData.time} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="description" label="Description" multiline rows={4} value={eventData.description} onChange={handleChange} />
    </CustomDialog>
  );
};

export default EventForm;
