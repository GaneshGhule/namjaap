import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ScrollingContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  background: 'rgba(25, 118, 210, 0.1)',
  padding: '12px 0',
  margin: '20px 0',
  borderRadius: '8px',
  '& .scrolling-text': {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'scrollText 15s linear infinite',
    paddingLeft: '100%',
  },
  '@keyframes scrollText': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-100%)',
    },
  },
}));

const ScrollingChant = ({ chantText }) => {
  const repeatedChant = `${chantText} || `.repeat(5).trim();

  return (
    <ScrollingContainer>
      <Typography 
        variant="h6" 
        className="scrolling-text"
        sx={{ 
          color: 'primary.main',
          fontWeight: 'bold',
        }}
      >
        {repeatedChant}
      </Typography>
    </ScrollingContainer>
  );
};

export default ScrollingChant;
