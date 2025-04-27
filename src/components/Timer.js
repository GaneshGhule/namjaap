import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Timer = ({ isRunning, onToggle, onReset }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', margin: '20px 0' }}>
      <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>
        {formatTime(time)}
      </Typography>
      <Button
        variant="contained"
        color={isRunning ? "error" : "success"}
        onClick={onToggle}
        sx={{ margin: '10px' }}
        startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
      >
        {isRunning ? 'Pause' : 'Start'}
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          setTime(0);
          onReset();
        }}
        sx={{ margin: '10px' }}
        startIcon={<RestartAltIcon />}
      >
        Reset
      </Button>
    </Paper>
  );
};

export default Timer;
