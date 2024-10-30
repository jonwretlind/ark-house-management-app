import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

const ActiveMessageDialog = ({ open, onClose, message }) => {
  if (!message) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {message.title && (
        <DialogTitle sx={{ 
          pb: 1,
          color: '#1a4731',
          fontWeight: 'bold'
        }}>
          {message.title}
        </DialogTitle>
      )}
      <DialogContent>
        {message.content && (
          <Typography variant="body1" sx={{ 
            mt: 1,
            color: '#2c3e50',
            lineHeight: 1.6
          }}>
            {message.content}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="caption" color="text.secondary">
            Posted: {new Date(message.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActiveMessageDialog;
