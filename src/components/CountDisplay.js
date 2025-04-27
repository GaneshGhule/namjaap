import React from 'react';
import { Paper, Typography, Grid, Box, useTheme, useMediaQuery } from '@mui/material';

const CountDisplay = ({ currentCount, malaCount, totalCount, totalTime }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return (
    <Box sx={{ 
      width: '100%',
      mb: { xs: 10, sm: 4 }
    }}>
      <Grid 
        container 
        spacing={isMobile ? 1 : 2}
        sx={{ 
          margin: 0,
          width: '100%'
        }}
      >
        <Grid item xs={6} sm={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 1.5, sm: 3 },
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle2" : "h6"}
              sx={{ 
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: undefined }
              }}
            >
              Current
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h4"}
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              {currentCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 1.5, sm: 3 },
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle2" : "h6"}
              sx={{ 
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: undefined }
              }}
            >
              Mala
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h4"}
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              {malaCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 1.5, sm: 3 },
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle2" : "h6"}
              sx={{ 
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: undefined }
              }}
            >
              Today
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h4"}
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              {totalCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 1.5, sm: 3 },
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant={isMobile ? "subtitle2" : "h6"}
              sx={{ 
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: undefined }
              }}
            >
              Time
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"}
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              {formatTime(totalTime)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CountDisplay;
