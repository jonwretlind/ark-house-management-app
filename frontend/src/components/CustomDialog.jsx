import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const CustomDialog = ({ open, onClose, onSubmit, title, children }) => {
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{
          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#d35400', // Rusty orange
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#d35400', // Rusty orange
            },
          },
        }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onClose} sx={{ color: 'red' }}>
          <CloseIcon />
        </IconButton>
        <IconButton 
          onClick={onSubmit} 
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

export default CustomDialog;
