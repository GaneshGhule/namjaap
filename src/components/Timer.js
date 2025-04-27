import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Timer = ({ isRunning, onToggle, onReset }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Paper 
      elevation={2}
      sx={{ 
        width: '100%',
        p: { xs: 3, sm: 4 },
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 }
      }}>
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3rem' }
          }}
        >
          {formatTime(time)}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          gap: 2,
          width: '100%'
        }}>
          <Button
            variant="contained"
            color={isRunning ? "error" : "success"}
            onClick={onToggle}
            startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{ 
              flex: 1,
              height: { xs: '45px', sm: '50px' },
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => {
              setTime(0);
              onReset();
            }}
            startIcon={<RestartAltIcon />}
            sx={{ 
              flex: 1,
              height: { xs: '45px', sm: '50px' },
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Timer;
