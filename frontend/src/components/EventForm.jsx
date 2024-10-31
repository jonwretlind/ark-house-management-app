import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import CustomDialog from './CustomDialog';

const EventForm = ({ open, handleClose, handleSubmit, initialData }) => {
  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      // Format the date to YYYY-MM-DD for the date input
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0]
        : '';
        
      setEventData({
        name: initialData.name || '',
        location: initialData.location || '',
        date: formattedDate,
        time: initialData.time || '',
        description: initialData.description || ''
      });
    } else {
      // Reset form when not editing
      setEventData({
        name: '',
        location: '',
        date: '',
        time: '',
        description: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    handleSubmit(eventData);
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onSubmit={onSubmit}
      title={initialData ? 'Edit Event' : 'Create New Event'}
    >
      <TextField 
        fullWidth 
        margin="normal" 
        name="name" 
        label="Event Name" 
        value={eventData.name} 
        onChange={handleChange}
        required 
      />
      <TextField 
        fullWidth 
        margin="normal" 
        name="location" 
        label="Location" 
        value={eventData.location} 
        onChange={handleChange} 
      />
      <TextField 
        fullWidth 
        margin="normal" 
        name="date" 
        label="Date" 
        type="date" 
        InputLabelProps={{ shrink: true }} 
        value={eventData.date} 
        onChange={handleChange}
        required 
      />
      <TextField 
        fullWidth 
        margin="normal" 
        name="time" 
        label="Time" 
        type="time" 
        InputLabelProps={{ shrink: true }} 
        value={eventData.time} 
        onChange={handleChange} 
      />
      <TextField 
        fullWidth 
        margin="normal" 
        name="description" 
        label="Description" 
        multiline 
        rows={4} 
        value={eventData.description} 
        onChange={handleChange} 
      />
    </CustomDialog>
  );
};

export default EventForm;
