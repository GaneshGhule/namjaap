import React from 'react';
import { Button, useTheme, useMediaQuery } from '@mui/material';

const ChantButton = ({ onClick, disabled }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onClick}
      disabled={disabled}
      fullWidth={isMobile}
      sx={{ 
        fontSize: { xs: '1.5rem', sm: '1.2rem' },
        padding: { xs: '20px', sm: '15px 30px' },
        margin: { xs: '10px 0', sm: '10px' },
        borderRadius: { xs: '0', sm: '4px' },
        position: { xs: 'fixed', sm: 'static' },
        bottom: { xs: 0, sm: 'auto' },
        left: { xs: 0, sm: 'auto' },
        right: { xs: 0, sm: 'auto' },
        zIndex: { xs: 1000, sm: 1 },
      }}
    >
      Count Chant (+1)
    </Button>
  );
};

export default ChantButton;
