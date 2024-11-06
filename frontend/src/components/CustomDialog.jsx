import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const CustomDialog = ({ open, onClose, onSubmit, title, children }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: 'rgba(26, 71, 49, 0.9)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
          p: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ mt: 2 }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white',
              width: '48px',
              height: '48px',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            type="submit"
            sx={{
              backgroundColor: '#1a4731',
              color: 'white',
              width: '48px',
              height: '48px',
              '&:hover': {
                backgroundColor: '#2c3e50',
              },
            }}
          >
            <CheckIcon />
          </IconButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CustomDialog;
