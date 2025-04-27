import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';

const CountDisplay = ({ currentCount, malaCount, totalCount }) => {
  return (
    <Grid container spacing={2} sx={{ margin: '20px 0' }}>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h6">Current Count</Typography>
          <Typography variant="h4">{currentCount}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h6">Mala Count</Typography>
          <Typography variant="h4">{malaCount}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h6">Today's Total</Typography>
          <Typography variant="h4">{totalCount}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CountDisplay;
