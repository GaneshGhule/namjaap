import React from 'react';
import { Button, Box, useTheme, useMediaQuery } from '@mui/material';

const ChantButton = ({ onClick, disabled }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      width: '100%',
      position: { xs: 'fixed', sm: 'static' },
      bottom: { xs: 0, sm: 'auto' },
      left: { xs: 0, sm: 'auto' },
      p: { xs: 2, sm: 0 },
      bgcolor: { xs: 'background.paper', sm: 'transparent' },
      zIndex: { xs: 1000, sm: 1 },
      boxShadow: { xs: '0px -2px 4px rgba(0,0,0,0.1)', sm: 'none' }
    }}>
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: '100%',
          height: { xs: '60px', sm: '80px' },
          fontSize: { xs: '1.5rem', sm: '2rem' },
          borderRadius: 2,
          textTransform: 'none',
          boxShadow: 3,
          fontWeight: 'bold',
          '&:hover': {
            boxShadow: 5,
            transform: 'scale(1.02)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        Count Chant (+1)
      </Button>
    </Box>
  );
};

export default ChantButton;
