import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';

export default function App() {
  const [count, setCount] = useState(0);
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const saveTimeout = useRef(null);
  const speechQueue = useRef([]);
  const today = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split(',')[0];

  // Initialize voice recognition
  useEffect(() => {
    const voiceStart = () => {
      console.log('Voice recognition started');
    };

    const voiceEnd = () => {
      console.log('Voice recognition ended');
      // Restart if still listening
      if (listening) {
        startListening();
      }
    };

    const voiceResults = (e) => {
      if (e.value && e.value[0]) {
        const spokenWords = e.value[0].toLowerCase();
        if (spokenWords.includes('om')) {
          handleIncrement();
        }
      }
    };

    const voiceError = (e) => {
      console.error('Voice error:', e);
      setError('Voice recognition error. Please try again.');
      setListening(false);
    };

    // Set up voice recognition handlers
    Voice.onSpeechStart = voiceStart;
    Voice.onSpeechEnd = voiceEnd;
    Voice.onSpeechResults = voiceResults;
    Voice.onSpeechError = voiceError;

    // Load history on mount
    loadHistory();

    // Cleanup
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [listening]);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('chantHistory');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      setError('Failed to load history');
      console.error('Error loading history:', e);
    }
  };

  const saveTodayCount = async () => {
    try {
      // Clear any pending saves
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      // Debounce save operation
      saveTimeout.current = setTimeout(async () => {
        const newHistory = {
          ...history.reduce((acc, item) => ({ ...acc, [item.date]: item.count }), {}),
          [today]: count
        };
        const updatedList = Object.entries(newHistory).map(([date, count]) => ({ date, count }));
        await AsyncStorage.setItem('chantHistory', JSON.stringify(updatedList));
        setHistory(updatedList);
      }, 1000);
    } catch (e) {
      setError('Failed to save count');
      console.error('Error saving count:', e);
    }
  };

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    saveTodayCount();
  };

  const startListening = async () => {
    try {
      setError('');

      // Check if voice recognition is available
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        setError('Voice recognition is not available on this device');
        return;
      }

      // Stop any existing session
      await Voice.stop();
      
      // Start new session
      await Voice.start('en-US');
      setListening(true);
    } catch (e) {
      console.error('Error starting voice recognition:', e);
      if (e.message?.includes('permission')) {
        setError('Microphone permission is required. Please enable it in your device settings.');
      } else {
        setError('Failed to start voice recognition. Please try again.');
      }
      setListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setListening(false);
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
      setError('Failed to stop voice recognition');
    }
  };

  const resetCount = () => {
    Alert.alert(
      'Reset Count',
      'Are you sure you want to reset the count?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCount(0);
            saveTodayCount();
          }
        }
      ]
    );
  };

  const dismissError = () => {
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chant Counter</Text>
      
      {error ? (
        <TouchableOpacity style={styles.errorContainer} onPress={dismissError}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.dismissText}>(tap to dismiss)</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity 
        onPress={handleIncrement}
        style={styles.counterButton}
        activeOpacity={0.7}
      >
        <Text style={styles.counter}>{count}</Text>
        <Text style={styles.tapInstruction}>
          {listening ? 'Listening for "Om"...' : 'Tap to count manually'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, listening && styles.buttonActive]} 
          onPress={listening ? stopListening : startListening}
        >
          <Text style={styles.buttonText}>
            {listening ? 'Stop Listening' : 'Start Listening'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={resetCount}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheader}>History</Text>
      <FlatList
        data={history.sort((a, b) => (a.date < b.date ? 1 : -1))}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <Text style={styles.historyItem}>
            {item.date}: {item.count} chants
          </Text>
        )}
        style={styles.historyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#fff' 
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center'
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center'
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center'
  },
  dismissText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5
  },
  counterButton: {
    backgroundColor: '#f0f0f0',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  counter: { 
    fontSize: 72, 
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10
  },
  tapInstruction: {
    fontSize: 16,
    color: '#666'
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginBottom: 30
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center'
  },
  buttonActive: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  subheader: { 
    fontSize: 22, 
    marginBottom: 10,
    fontWeight: '600'
  },
  historyList: {
    flex: 1
  },
  historyItem: { 
    padding: 12,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
});
