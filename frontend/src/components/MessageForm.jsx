import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';
import axios from '../utils/api';

const MessageForm = ({ open, handleClose, message, refreshMessages }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isActive: false
  });

  useEffect(() => {
    if (message) {
      setFormData({
        title: message.title || '',
        content: message.content || '',
        isActive: message.isActive || false
      });
    } else {
      setFormData({
        title: '',
        content: '',
        isActive: false
      });
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (message) {
        await axios.put(`/messages/${message._id}`, formData);
      } else {
        await axios.post('/messages', formData);
      }
      handleClose();
      if (refreshMessages) {
        refreshMessages();
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value
    }));
  };

  const glassyStyle = {
    backgroundColor: 'rgba(52, 73, 94, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.7)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputBase-input': {
      color: '#ecf0f1',
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: glassyStyle
      }}
    >
      <DialogTitle sx={{ color: '#ecf0f1', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {message ? 'Edit Message' : 'Create New Message'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
              required
              sx={inputStyle}
            />
            <TextField
              name="content"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
              required
              sx={inputStyle}
            />
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ecf0f1',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#2ecc71',
                    },
                  }}
                />
              }
              label="Active Message"
              sx={{ color: '#ecf0f1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{ color: '#ecf0f1' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              backgroundColor: '#2ecc71',
              '&:hover': {
                backgroundColor: '#27ae60'
              }
            }}
          >
            {message ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MessageForm;
