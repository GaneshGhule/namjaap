import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Grid,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TimerIcon from '@mui/icons-material/Timer';
import HistoryIcon from '@mui/icons-material/History';
import ChantButton from './components/ChantButton';
import CountDisplay from './components/CountDisplay';
import ChantHistory from './components/ChantHistory';
import Timer from './components/Timer';
import ScrollingChant from './components/ScrollingChant';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          color: 'white',
        },
      },
    },
  },
});

const predefinedChants = ['राम कृष्ण हरी', 'राधा'];
const INACTIVITY_TIMEOUT = 2000; // 2 seconds
const STORAGE_KEY = 'namjaap_history';

const saveToStorage = (data, source = 'unknown') => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log(`Saved to storage (from ${source}):`, data);
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    console.log('Loaded from storage:', data);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading from storage:', error);
    return [];
  }
};

function App() {
  const today = new Date().toISOString().split('T')[0];
  const lastDateRef = useRef(today);
  
  // Load initial state from storage
  const loadInitialState = () => {
    const savedData = loadFromStorage();
    const savedChants = localStorage.getItem('customChants');
    const customChants = savedChants ? JSON.parse(savedChants) : [];
    const allChants = [...predefinedChants, ...customChants];
    
    const todayEntries = savedData.filter(entry => entry.date === today);
    const currentEntry = todayEntries.find(entry => entry.chantText === allChants[0]);
    
    return {
      history: savedData,
      currentCount: currentEntry ? currentEntry.count % 108 : 0,
      todaysChantTime: currentEntry ? currentEntry.timeSpent : 0,
      selectedChant: currentEntry ? currentEntry.chantText : allChants[0],
      customChants
    };
  };

  const initialState = loadInitialState();
  const [selectedChant, setSelectedChant] = useState(initialState.selectedChant);
  const [customChants, setCustomChants] = useState(initialState.customChants);
  const [newChantText, setNewChantText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCount, setCurrentCount] = useState(initialState.currentCount);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(null);
  const [todaysChantTime, setTodaysChantTime] = useState(initialState.todaysChantTime);
  const [history, setHistory] = useState(initialState.history);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const appTheme = useTheme();
  const isMobile = useMediaQuery(appTheme.breakpoints.down('sm'));
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);
  const timerRef = useRef(null);

  // Check for day change
  useEffect(() => {
    const checkDayChange = () => {
      const now = new Date().toISOString().split('T')[0];
      if (now !== lastDateRef.current) {
        console.log('Day changed, resetting counts...');
        // Save any remaining counts before reset
        if (currentCount > 0) {
          const updatedHistory = [...history];
          const existingEntryIndex = updatedHistory.findIndex(
            entry => entry.date === lastDateRef.current && entry.chantText === selectedChant
          );

          if (existingEntryIndex >= 0) {
            updatedHistory[existingEntryIndex] = {
              ...updatedHistory[existingEntryIndex],
              count: updatedHistory[existingEntryIndex].count + currentCount,
              timeSpent: todaysChantTime,
              lastUpdated: Date.now()
            };
          } else {
            updatedHistory.unshift({
              date: lastDateRef.current,
              chantText: selectedChant,
              count: currentCount,
              malaCount: Math.floor(currentCount / 108),
              timeSpent: todaysChantTime,
              lastUpdated: Date.now()
            });
          }

          setHistory(updatedHistory);
          saveToStorage(updatedHistory, 'dayChange');
        }

        // Reset for new day
        setCurrentCount(0);
        setTodaysChantTime(0);
        setTimerStartTime(null);
        setIsTimerRunning(false);
        lastDateRef.current = now;
      }
    };

    // Check every minute for day change
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, [currentCount, history, selectedChant, todaysChantTime]);

  // Handle app visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = new Date().toISOString().split('T')[0];
        if (now !== lastDateRef.current) {
          // Trigger immediate day change check when app becomes visible
          const event = new Event('dayChange');
          window.dispatchEvent(event);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Add day change event listener
  useEffect(() => {
    const handleDayChange = () => {
      const now = new Date().toISOString().split('T')[0];
      if (now !== lastDateRef.current) {
        console.log('Day changed event triggered');
        loadInitialState();
      }
    };

    window.addEventListener('dayChange', handleDayChange);
    return () => window.removeEventListener('dayChange', handleDayChange);
  }, []);

  // Timer update effect
  useEffect(() => {
    if (isTimerRunning) {
      if (!timerStartTime) {
        setTimerStartTime(Date.now());
      }
      timerRef.current = setInterval(() => {
        setTodaysChantTime(prev => {
          const newTime = prev + 1000;
          // Update current entry's time in history
          const updatedHistory = [...history];
          const todayEntryIndex = updatedHistory.findIndex(
            entry => entry.date === today && entry.chantText === selectedChant
          );
          if (todayEntryIndex >= 0) {
            updatedHistory[todayEntryIndex] = {
              ...updatedHistory[todayEntryIndex],
              timeSpent: newTime
            };
            saveToStorage(updatedHistory, 'timerUpdate');
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timerStartTime, history, selectedChant]);

  // Handle chant selection change
  const handleChantChange = (newChant) => {
    // Save current count before changing
    if (currentCount > 0) {
      const updatedHistory = [...history];
      const existingEntryIndex = updatedHistory.findIndex(
        entry => entry.date === today && entry.chantText === selectedChant
      );

      if (existingEntryIndex >= 0) {
        updatedHistory[existingEntryIndex] = {
          ...updatedHistory[existingEntryIndex],
          count: updatedHistory[existingEntryIndex].count + currentCount,
          malaCount: Math.floor((updatedHistory[existingEntryIndex].count + currentCount) / 108),
          timeSpent: todaysChantTime,
          lastUpdated: Date.now()
        };
      } else {
        updatedHistory.unshift({
          date: today,
          chantText: selectedChant,
          count: currentCount,
          malaCount: Math.floor(currentCount / 108),
          timeSpent: todaysChantTime,
          lastUpdated: Date.now()
        });
      }

      setHistory(updatedHistory);
      saveToStorage(updatedHistory, 'chantChange');
    }

    // Reset all counters for new chant
    setSelectedChant(newChant);
    setCurrentCount(0);
    setTodaysChantTime(0);
    setIsTimerRunning(false);
    setTimerStartTime(null);

    // Load existing counts for the new chant if any
    const existingEntry = history.find(
      entry => entry.date === today && entry.chantText === newChant
    );
    if (existingEntry) {
      setCurrentCount(existingEntry.count % 108);
      setTodaysChantTime(existingEntry.timeSpent || 0);
    }
  };

  const checkInactivity = useCallback(() => {
    if (isTimerRunning && Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT) {
      setIsTimerRunning(false);
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (isTimerRunning) {
      inactivityTimerRef.current = setInterval(checkInactivity, 1000);
    } else {
      clearInterval(inactivityTimerRef.current);
    }
    return () => clearInterval(inactivityTimerRef.current);
  }, [isTimerRunning, checkInactivity]);

  const handleChantCount = () => {
    lastActivityRef.current = Date.now();
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    
    const newCount = currentCount + 1;
    
    // Check if we completed a mala
    if (newCount >= 108) {
      // Save completed mala to history
      const completedMalaCount = Math.floor(newCount / 108);
      const remainingCount = newCount % 108;
      
      const existingEntryIndex = history.findIndex(
        entry => entry.date === today && entry.chantText === selectedChant
      );

      let updatedHistory;
      if (existingEntryIndex >= 0) {
        updatedHistory = [...history];
        updatedHistory[existingEntryIndex] = {
          ...updatedHistory[existingEntryIndex],
          count: (updatedHistory[existingEntryIndex].count || 0) + (completedMalaCount * 108),
          malaCount: (updatedHistory[existingEntryIndex].malaCount || 0) + completedMalaCount,
          timeSpent: todaysChantTime,
          lastUpdated: Date.now()
        };
      } else {
        updatedHistory = [{
          date: today,
          chantText: selectedChant,
          count: completedMalaCount * 108,
          malaCount: completedMalaCount,
          timeSpent: todaysChantTime,
          lastUpdated: Date.now()
        }, ...history];
      }

      setHistory(updatedHistory);
      saveToStorage(updatedHistory, 'handleChantCount');
      setCurrentCount(remainingCount); // Set remaining count after completing mala
    } else {
      setCurrentCount(newCount);
    }
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
    lastActivityRef.current = Date.now();
  };

  const handleReset = () => {
    setCurrentCount(0);
    setIsTimerRunning(false);
    setTimerStartTime(null);
    setTodaysChantTime(0);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
      console.log('Cleared all history');
    }
  };

  const handleClearDate = (date) => {
    if (window.confirm(`Are you sure you want to clear history for ${new Date(date).toLocaleDateString()}?`)) {
      const updatedHistory = history.filter(entry => entry.date !== date);
      setHistory(updatedHistory);
      saveToStorage(updatedHistory, 'handleClearDate');
      console.log('Cleared history for date:', date);
    }
  };

  const getTodayTotalCount = () => {
    // Only get counts for current chant
    return history
      .filter(entry => entry.date === today && entry.chantText === selectedChant)
      .reduce((total, entry) => total + entry.count, 0);
  };

  const getTodayTotalMala = () => {
    // Only get mala count for current chant
    return history
      .filter(entry => entry.date === today && entry.chantText === selectedChant)
      .reduce((total, entry) => total + (entry.malaCount || 0), 0);
  };

  const getTodayTotalTime = () => {
    // Only get time for current chant
    return history
      .filter(entry => entry.date === today && entry.chantText === selectedChant)
      .reduce((total, entry) => total + (entry.timeSpent || 0), 0);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem 
          button 
          onClick={() => {
            setShowHistory(false);
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon><TimerIcon /></ListItemIcon>
          <ListItemText primary="Counter" />
        </ListItem>
        <ListItem 
          button 
          onClick={() => {
            setShowHistory(true);
            setDrawerOpen(false);
          }}
        >
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      </List>
    </Box>
  );

  const handleAddCustomChant = () => {
    if (newChantText.trim()) {
      const updatedChants = [...customChants, newChantText.trim()];
      setCustomChants(updatedChants);
      localStorage.setItem('customChants', JSON.stringify(updatedChants));
      setNewChantText('');
      setOpenDialog(false);
    }
  };

  const handleRemoveChant = (chant) => {
    if (predefinedChants.includes(chant)) {
      return; // Can't remove predefined chants
    }
    const updatedChants = customChants.filter(c => c !== chant);
    setCustomChants(updatedChants);
    localStorage.setItem('customChants', JSON.stringify(updatedChants));
    
    if (selectedChant === chant) {
      handleChantChange(predefinedChants[0]);
    }
  };

  const mainContent = !showHistory ? (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: 600,
      mx: 'auto'
    }}>
      <Box sx={{ minWidth: 120, marginBottom: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Chant</InputLabel>
          <Select
            value={selectedChant}
            label="Select Chant"
            onChange={(e) => {
              if (e.target.value === 'add_new') {
                setOpenDialog(true);
              } else {
                handleChantChange(e.target.value);
              }
            }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle2" color="textSecondary">
                Predefined Chants
              </Typography>
            </MenuItem>
            {predefinedChants.map((chant) => (
              <MenuItem key={chant} value={chant}>
                {chant}
              </MenuItem>
            ))}
            
            {customChants.length > 0 && (
              <MenuItem disabled>
                <Typography variant="subtitle2" color="textSecondary">
                  Custom Chants
                </Typography>
              </MenuItem>
            )}
            {customChants.map((chant) => (
              <MenuItem 
                key={chant} 
                value={chant}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {chant}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChant(chant);
                  }}
                  sx={{ ml: 1 }}
                >
                  ×
                </IconButton>
              </MenuItem>
            ))}
            
            <MenuItem value="add_new" sx={{ color: 'primary.main' }}>
              + Add New Chant
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Timer 
        isRunning={isTimerRunning}
        onToggle={handleTimerToggle}
        onReset={handleReset}
      />

      <ScrollingChant chantText={selectedChant} />

      <Box sx={{ textAlign: 'center', mb: { xs: 8, sm: 0 } }}>
        <ChantButton 
          onClick={handleChantCount}
          disabled={false}
        />
      </Box>

      <CountDisplay 
        currentCount={currentCount}
        malaCount={getTodayTotalMala()}
        totalCount={getTodayTotalCount()}
        totalTime={getTodayTotalTime()}
      />
    </Box>
  ) : (
    <ChantHistory 
      history={history} 
      onClearAll={handleClearAll}
      onClearDate={handleClearDate}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMobile ? (
        // Mobile Layout
        <>
          <AppBar position="fixed" sx={{ top: 0 }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Namjaap
              </Typography>
            </Toolbar>
          </AppBar>
          <Container 
            maxWidth="lg" 
            sx={{ 
              padding: '20px',
              mt: '64px',
              mb: '20px',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {mainContent}
          </Container>
        </>
      ) : (
        // Desktop Layout
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar sx={{ justifyContent: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  py: 2,
                  fontWeight: 'bold',
                  letterSpacing: 2,
                }}
              >
                Namjaap
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
              {/* Left Panel - Counter */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Select Chant</InputLabel>
                      <Select
                        value={selectedChant}
                        label="Select Chant"
                        onChange={(e) => {
                          if (e.target.value === 'add_new') {
                            setOpenDialog(true);
                          } else {
                            handleChantChange(e.target.value);
                          }
                        }}
                      >
                        <MenuItem disabled>
                          <Typography variant="subtitle2" color="textSecondary">
                            Predefined Chants
                          </Typography>
                        </MenuItem>
                        {predefinedChants.map((chant) => (
                          <MenuItem key={chant} value={chant}>
                            {chant}
                          </MenuItem>
                        ))}
                        
                        {customChants.length > 0 && (
                          <MenuItem disabled>
                            <Typography variant="subtitle2" color="textSecondary">
                              Custom Chants
                            </Typography>
                          </MenuItem>
                        )}
                        {customChants.map((chant) => (
                          <MenuItem 
                            key={chant} 
                            value={chant}
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            {chant}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveChant(chant);
                              }}
                              sx={{ ml: 1 }}
                            >
                              ×
                            </IconButton>
                          </MenuItem>
                        ))}
                        
                        <MenuItem value="add_new" sx={{ color: 'primary.main' }}>
                          + Add New Chant
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Timer 
                    isRunning={isTimerRunning}
                    onToggle={handleTimerToggle}
                    onReset={handleReset}
                  />

                  <ScrollingChant chantText={selectedChant} />

                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <ChantButton 
                      onClick={handleChantCount}
                      disabled={false}
                    />

                    <CountDisplay 
                      currentCount={currentCount}
                      malaCount={getTodayTotalMala()}
                      totalCount={getTodayTotalCount()}
                      totalTime={getTodayTotalTime()}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Right Panel - History */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    height: '100%',
                    bgcolor: 'background.paper',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 200px)'
                  }}
                >
                  <ChantHistory 
                    history={history} 
                    onClearAll={handleClearAll}
                    onClearDate={handleClearDate}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>

      {/* Add New Chant Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Chant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chant Text"
            fullWidth
            value={newChantText}
            onChange={(e) => setNewChantText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddCustomChant}
            disabled={!newChantText.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
