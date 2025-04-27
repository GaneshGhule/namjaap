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
});

const predefinedChants = ['राम कृष्ण हरी', 'राधा'];
const INACTIVITY_TIMEOUT = 5000; // 5 seconds

function App() {
  const [selectedChant, setSelectedChant] = useState(predefinedChants[0]);
  const [currentCount, setCurrentCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('chantHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const appTheme = useTheme();
  const isMobile = useMediaQuery(appTheme.breakpoints.down('sm'));
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chantHistory', JSON.stringify(history));
  }, [history]);

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
    setCurrentCount(prev => prev + 1);
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
    lastActivityRef.current = Date.now();
  };

  const handleReset = () => {
    if (currentCount > 0) {
      const today = new Date().toISOString().split('T')[0];
      const newEntry = {
        date: today,
        chantText: selectedChant,
        count: currentCount
      };
      setHistory(prev => [newEntry, ...prev]);
      setCurrentCount(0);
    }
    setIsTimerRunning(false);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  const handleClearDate = (date) => {
    if (window.confirm(`Are you sure you want to clear history for ${new Date(date).toLocaleDateString()}?`)) {
      setHistory(prev => prev.filter(entry => entry.date !== date));
    }
  };

  const getTodayTotalCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return history
      .filter(entry => entry.date === today)
      .reduce((total, entry) => total + entry.count, 0) + currentCount;
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
        <ListItem button onClick={() => setShowHistory(false)}>
          <ListItemIcon><TimerIcon /></ListItemIcon>
          <ListItemText primary="Counter" />
        </ListItem>
        <ListItem button onClick={() => setShowHistory(true)}>
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      </List>
    </Box>
  );

  const mainContent = !showHistory ? (
    <>
      <Box sx={{ minWidth: 120, marginBottom: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Chant</InputLabel>
          <Select
            value={selectedChant}
            label="Select Chant"
            onChange={(e) => setSelectedChant(e.target.value)}
          >
            {predefinedChants.map((chant) => (
              <MenuItem key={chant} value={chant}>
                {chant}
              </MenuItem>
            ))}
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
        malaCount={Math.floor(currentCount / 108)}
        totalCount={getTodayTotalCount()}
      />
    </>
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
      {isMobile && (
        <AppBar position="static">
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
            <Box sx={{ flexGrow: 0.6 }} />
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      <Container maxWidth="lg" sx={{ padding: '20px' }}>
        {!isMobile && (
          <Typography variant="h3" align="center" gutterBottom>
            Namjaap
          </Typography>
        )}
        {mainContent}
        {!isMobile && (
          <ChantHistory 
            history={history} 
            onClearAll={handleClearAll}
            onClearDate={handleClearDate}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
