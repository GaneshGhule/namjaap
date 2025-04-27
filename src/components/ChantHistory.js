import React from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ChantHistory = ({ history, onClearAll, onClearDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const groupedByDate = history.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {});

  return (
    <Paper elevation={3} sx={{ margin: '20px 0', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Chanting History</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onClearAll}
          size={isMobile ? "small" : "medium"}
        >
          Clear All
        </Button>
      </Box>
      
      {Object.entries(groupedByDate).map(([date, entries]) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              {new Date(date).toLocaleDateString()}
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={() => onClearDate(date)}
              startIcon={<DeleteIcon />}
            >
              Clear Date
            </Button>
          </Box>
          <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>Chant Text</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Mala Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.chantText}</TableCell>
                    <TableCell align="right">{entry.count}</TableCell>
                    <TableCell align="right">{Math.floor(entry.count / 108)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
      
      {history.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
          No history available
        </Typography>
      )}
    </Paper>
  );
};

export default ChantHistory;
