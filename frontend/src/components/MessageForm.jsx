import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const MessageForm = ({ open, handleClose, refreshMessages }) => {
  const [message, setMessage] = useState('');
  const theme = useTheme();

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/messages', { content: message }, { withCredentials: true });
      refreshMessages();
      handleClose();
    } catch (error) {
      console.error('Error creating message:', error);
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
      <DialogTitle>Create New Message</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageForm;
