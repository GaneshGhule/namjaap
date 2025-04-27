import React from 'react';
import { Button, useTheme, useMediaQuery, Box } from '@mui/material';

const ChantButton = ({ onClick, disabled }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      width: '100%',
      position: { xs: 'fixed', sm: 'static' },
      bottom: { xs: 0, sm: 'auto' },
      left: { xs: 0, sm: 'auto' },
      right: { xs: 0, sm: 'auto' },
      padding: { xs: '10px', sm: 0 },
      backgroundColor: { xs: 'white', sm: 'transparent' },
      boxShadow: { 
        xs: '0px -2px 4px rgba(0,0,0,0.1)', 
        sm: 'none' 
      },
      zIndex: { xs: 1000, sm: 1 },
    }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onClick}
        disabled={disabled}
        fullWidth={isMobile}
        sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.2rem' },
          padding: { xs: '15px', sm: '15px 30px' },
          borderRadius: { xs: '8px', sm: '4px' },
          maxWidth: { xs: '100%', sm: '300px' },
          margin: '0 auto',
          display: 'block',
        }}
      >
        Count Chant (+1)
      </Button>
    </Box>
  );
};

export default ChantButton;
