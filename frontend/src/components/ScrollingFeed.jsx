import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ScrollingFeed = ({ feed }) => {
  const theme = useTheme();

  const glassyBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: '10px 0',
    marginBottom: '20px',
  };

  return (
    <Box sx={glassyBoxStyle}>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'nowrap',
          animation: 'scroll 60s linear infinite',
          color: theme.palette.text.primary,
          '@keyframes scroll': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        }}
      >
        {feed.map((item, index) => (
          <span key={item._id}>
            {item.type === 'event' ? (
              `Event: ${item.name} on ${new Date(item.date).toLocaleDateString()} at ${item.time}, ${item.location}`
            ) : (
              `Message: ${item.content}`
            )}
            {index < feed.length - 1 ? ' | ' : ''}
          </span>
        ))}
      </Typography>
    </Box>
  );
};

export default ScrollingFeed;
