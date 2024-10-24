import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const ActiveMessageDialog = ({ open, onClose, message }) => {
  const theme = useTheme();

  if (!message) return null;

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
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        style: glassyStyle
      }}
    >
      <DialogTitle>Active Message</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message.content}</Typography>
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          Posted on: {new Date(message.createdAt).toLocaleString()}
        </Typography>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onClose} sx={{ color: theme.palette.secondary.main }}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default ActiveMessageDialog;
