import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import axios from '../utils/api';
import CustomDialog from './CustomDialog';

const EventForm = ({ open, handleClose, handleSubmit: onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        time: initialData.time || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        location: '',
        date: '',
        time: '',
        description: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onSubmit={submitForm}
      title={initialData ? 'Edit Event' : 'Create New Event'}
    >
      <TextField fullWidth margin="normal" name="name" label="Event Name" value={formData.name} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="location" label="Location" value={formData.location} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="time" label="Time" type="time" InputLabelProps={{ shrink: true }} value={formData.time} onChange={handleChange} />
      <TextField fullWidth margin="normal" name="description" label="Description" multiline rows={4} value={formData.description} onChange={handleChange} />
    </CustomDialog>
  );
};

export default EventForm;
