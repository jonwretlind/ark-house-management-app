import React, { useState } from 'react';
import { TextField } from '@mui/material';
import axios from '../utils/api';
import CustomDialog from './CustomDialog';

const MessageForm = ({ open, handleClose, refreshMessages }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/messages', { content: message }, { withCredentials: true });
      refreshMessages();
      handleClose();
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Create New Message"
    >
      <TextField
        fullWidth
        margin="normal"
        label="Message"
        multiline
        rows={4}
        value={message}
        onChange={handleChange}
        inputProps={{ maxLength: 250 }}
      />
    </CustomDialog>
  );
};

export default MessageForm;
