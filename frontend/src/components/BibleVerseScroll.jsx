import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const BibleVerseScroll = () => {
  const [verse, setVerse] = useState({ text: '', reference: '' });
  const theme = useTheme();

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const response = await axios.get('https://labs.bible.org/api/?passage=votd&type=json');
        const verseData = response.data[0];
        setVerse({ text: verseData.text, reference: `${verseData.bookname} ${verseData.chapter}:${verseData.verse}` });
      } catch (error) {
        console.error('Error fetching Bible verse:', error);
        setVerse({ text: 'Error loading verse', reference: '' });
      }
    };

    fetchVerse();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        padding: '10px 0',
        marginBottom: '10px',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'nowrap',
          animation: 'scroll 30s linear infinite',
          color: theme.palette.text.primary,
          '@keyframes scroll': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(-400%)' },
          },
        }}
      >
        {verse.reference} - {verse.text}
      </Typography>
    </Box>
  );
};

export default BibleVerseScroll;
