import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  MobileStepper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from '../utils/api';

const MessagesDialog = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMessages();
      setHasMarkedAsRead(false);
    }
  }, [open]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching active messages...');
      const response = await axios.get('/messages/active');
      console.log('Response:', response.data);
      
      if (response.data) {
        const messageArray = Array.isArray(response.data) ? response.data : [response.data];
        const activeMessages = messageArray.filter(msg => msg !== null);
        setMessages(activeMessages);
        setActiveStep(0);
      } else {
        console.error('Unexpected response format:', response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = async () => {
    if (!hasMarkedAsRead && messages.length > 0) {
      try {
        // Mark all displayed messages as read when dialog is closed
        await Promise.all(messages.map(message => 
          axios.post('/messages/mark-viewed', { messageId: message._id })
        ));
        setHasMarkedAsRead(true);
      } catch (error) {
        console.error('Error marking messages as viewed:', error);
      }
    }
    onClose();
  };

  const glassyStyle = {
    backgroundColor: 'rgba(52, 73, 94, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
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
      <DialogTitle sx={{ 
        color: '#ecf0f1',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pr: 6
      }}>
        {messages.length > 0 ? messages[activeStep].title : 'Messages'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#ecf0f1'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {messages.length > 0 ? (
          <>
            <Box sx={{ py: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#bdc3c7',
                  mb: 2,
                  lineHeight: 1.6
                }}
              >
                {messages[activeStep].content}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: '#95a5a6' }}
              >
                Posted: {new Date(messages[activeStep].createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            
            {messages.length > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: 2,
                gap: 2
              }}>
                <IconButton 
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ color: '#ecf0f1' }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '200px'
                }}>
                  <MobileStepper
                    steps={messages.length}
                    position="static"
                    activeStep={activeStep}
                    sx={{
                      backgroundColor: 'transparent',
                      width: 'auto',
                      padding: 0,
                      '& .MuiMobileStepper-dots': {
                        gap: '8px'
                      },
                      '& .MuiMobileStepper-dot': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        width: 8,
                        height: 8,
                        margin: 0
                      },
                      '& .MuiMobileStepper-dotActive': {
                        backgroundColor: '#ecf0f1',
                      }
                    }}
                    nextButton={null}
                    backButton={null}
                  />
                </Box>
                <IconButton
                  onClick={handleNext}
                  disabled={activeStep === messages.length - 1}
                  sx={{ color: '#ecf0f1' }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography 
              variant="body1" 
              sx={{ color: '#bdc3c7' }}
            >
              There are no active messages.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;
