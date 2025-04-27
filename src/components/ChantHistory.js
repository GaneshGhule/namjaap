import React from 'react';
import { 
  Paper, 
  Typography, 
  Button,
  Box,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ChantHistory = ({ history, onClearAll, onClearDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  if (history.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h6">No history available</Typography>
      </Box>
    );
  }

  const groupedByDate = history.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = {
        entries: [],
        totalCount: 0,
        totalMala: 0,
        totalTime: 0
      };
    }
    acc[entry.date].entries.push(entry);
    acc[entry.date].totalCount += entry.count;
    acc[entry.date].totalMala += Math.floor(entry.count / 108);
    acc[entry.date].totalTime += entry.timeSpent;
    return acc;
  }, {});

  return (
    <Box sx={{ width: '100%', mb: { xs: 8, sm: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        px: { xs: 1, sm: 2 }
      }}>
        <Typography variant="h6">Chanting History</Typography>
        {history.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onClearAll}
            size={isMobile ? "small" : "medium"}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      {Object.entries(groupedByDate)
        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
        .map(([date, data]) => (
          <Paper 
            key={date} 
            elevation={2} 
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            <Box sx={{ 
              p: 2, 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {new Date(date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Total: {data.totalCount} chants ({data.totalMala} mala)
                </Typography>
                <Typography variant="body2">
                  Time: {formatTime(data.totalTime)}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => onClearDate(date)}
                sx={{ color: 'white' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <List dense sx={{ p: 0 }}>
              {data.entries.map((entry, index) => (
                <React.Fragment key={`${date}-${index}`}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    sx={{ 
                      borderBottom: index < data.entries.length - 1 ? '1px solid rgba(0,0,0,0.12)' : 'none',
                      px: { xs: 2, sm: 3 },
                      py: 1.5
                    }}
                  >
                    <ListItemText
                      primary={entry.chantText}
                      secondary={
                        <>
                          Count: {entry.count} ({Math.floor(entry.count / 108)} mala)
                          <br />
                          Time: {formatTime(entry.timeSpent)}
                        </>
                      }
                      primaryTypographyProps={{
                        sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                      }}
                      secondaryTypographyProps={{
                        sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ))}
      
      {history.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="body1">
            No history available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChantHistory;
