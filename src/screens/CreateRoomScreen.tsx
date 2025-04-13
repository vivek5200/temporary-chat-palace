
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Feather';

type CreateRoomScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateRoom'>;

const expiryOptions = [
  { label: '10 minutes', value: 10 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '3 hours', value: 180 },
];

const CreateRoomScreen: React.FC = () => {
  const navigation = useNavigation<CreateRoomScreenNavigationProp>();
  const [roomName, setRoomName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [selectedExpiry, setSelectedExpiry] = useState(30); // Default to 30 minutes
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      alert('Room name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a unique room ID
      const roomId = 'room_' + Date.now().toString();
      
      // Calculate expiry time
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + selectedExpiry);
      
      // Create room object
      const roomData = {
        id: roomId,
        name: roomName.trim(),
        passcode: passcode.trim() || null,
        createdAt: new Date().toISOString(),
        expiresAt: expiryTime.toISOString(),
        messages: []
      };
      
      // In a real app, you'd send this to an API
      // For now, we'll store it in AsyncStorage
      const existingRoomsJson = await AsyncStorage.getItem('tempRooms');
      const existingRooms = existingRoomsJson ? JSON.parse(existingRoomsJson) : [];
      
      // Add new room
      const updatedRooms = [...existingRooms, roomData];
      await AsyncStorage.setItem('tempRooms', JSON.stringify(updatedRooms));
      
      // Success feedback
      setTimeout(() => {
        setIsLoading(false);
        alert(`Room "${roomName}" created successfully! Share the passcode with others to let them join.`);
        navigation.navigate('Chat', { roomId });
      }, 1000);
    } catch (error) {
      console.error('Error creating room:', error);
      setIsLoading(false);
      alert('Error creating room. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Temporary Room</Text>
            <Text style={styles.subtitle}>Set up a new chat room that expires automatically</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a room name"
                value={roomName}
                onChangeText={setRoomName}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Passcode (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Set a passcode for this room"
                value={passcode}
                onChangeText={setPasscode}
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Leave blank for a public room
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Time</Text>
              <View style={styles.expiryOptions}>
                {expiryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.expiryOption,
                      selectedExpiry === option.value && styles.selectedExpiryOption
                    ]}
                    onPress={() => setSelectedExpiry(option.value)}
                  >
                    <Text 
                      style={[
                        styles.expiryOptionText,
                        selectedExpiry === option.value && styles.selectedExpiryOptionText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleCreateRoom}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating...' : 'Create Room'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  expiryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  expiryOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedExpiryOption: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  expiryOptionText: {
    color: '#555',
  },
  selectedExpiryOptionText: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateRoomScreen;
