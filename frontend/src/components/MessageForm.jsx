import React, { useState, useRef, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import axios from '../utils/api';
import { useTheme } from '@mui/material/styles';

const MessageForm = ({ open, handleClose, refreshMessages }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [open]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/messages', { content: message }, { withCredentials: true });
      refreshMessages();
      handleClose();
      setMessage('');
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  const glassyStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus
      disableAutoFocus
      PaperProps={{
        style: glassyStyle
      }}
    >
      <DialogTitle id="form-dialog-title">Create New Message</DialogTitle>
      <DialogContent>
        <Box sx={{
          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.secondary.main,
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: theme.palette.secondary.main,
            },
          },
        }}>
          <TextField
            inputRef={inputRef}
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={handleChange}
            inputProps={{ maxLength: 250 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleClose} sx={{ color: 'red' }}>
          <CloseIcon />
        </IconButton>
        <IconButton 
          onClick={handleSubmit} 
          sx={{ 
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
            width: 40,
            height: 40,
          }}
        >
          <CheckIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default MessageForm;
