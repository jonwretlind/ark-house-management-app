import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import axios from '../utils/api';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const MessagesDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (open) {
      fetchMessages();
      markMessagesAsViewed();
    }
  }, [open]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/messages', { withCredentials: true });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsViewed = async () => {
    try {
      await axios.post('/messages/mark-viewed', {}, { withCredentials: true });
    } catch (error) {
      console.error('Error marking messages as viewed:', error);
    }
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
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
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        style: glassyStyle
      }}
      disableEnforceFocus
      disableAutoFocus
    >
      <DialogTitle>Messages</DialogTitle>
      <DialogContent>
        {messages.length > 0 ? (
          <>
            <AutoPlaySwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {messages.map((message, index) => (
                <Box key={message._id}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <Box>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                        {message.content}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: theme.palette.text.secondary }}>
                        Posted on: {new Date(message.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
              ))}
            </AutoPlaySwipeableViews>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              {messages.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: index === activeStep ? theme.palette.primary.main : theme.palette.grey[500],
                    borderRadius: '50%',
                    mx: 0.5,
                  }}
                />
              ))}
            </Box>
          </>
        ) : (
          <Typography sx={{ color: theme.palette.text.primary }}>No messages.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onClose} sx={{ color: theme.palette.secondary.main }}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default MessagesDialog;
