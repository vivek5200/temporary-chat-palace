
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type JoinRoomScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JoinRoom'>;

const JoinRoomScreen: React.FC = () => {
  const navigation = useNavigation<JoinRoomScreenNavigationProp>();
  const [roomName, setRoomName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleJoinRoom = async () => {
    if (!roomName.trim()) {
      alert('Room name is required');
      return;
    }
    
    if (!displayName.trim()) {
      alert('Display name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll check AsyncStorage
      const existingRoomsJson = await AsyncStorage.getItem('tempRooms');
      const existingRooms = existingRoomsJson ? JSON.parse(existingRoomsJson) : [];
      
      // Find room
      const room = existingRooms.find((r: any) => 
        r.name.toLowerCase() === roomName.trim().toLowerCase()
      );
      
      if (!room) {
        setIsLoading(false);
        alert('Room not found. Please check the room name and try again.');
        return;
      }
      
      // Check if room has expired
      const expiryTime = new Date(room.expiresAt);
      if (expiryTime < new Date()) {
        setIsLoading(false);
        alert('This room has expired.');
        return;
      }
      
      // Check passcode if room has one
      if (room.passcode && room.passcode !== passcode) {
        setIsLoading(false);
        alert('Invalid passcode. Please check and try again.');
        return;
      }
      
      // Check if display name is already taken in this room
      const isDisplayNameTaken = (room.messages || []).some(
        (msg: any) => msg.sender.toLowerCase() === displayName.trim().toLowerCase()
      );
      
      if (isDisplayNameTaken) {
        setIsLoading(false);
        alert('This display name is already taken in this room. Please choose another one.');
        return;
      }
      
      // Success - join the room
      // Save display name in AsyncStorage for this session
      await AsyncStorage.setItem(
        `room_${room.id}_displayName`, 
        displayName.trim()
      );
      
      // Add a system message that user joined
      const joinMessage = {
        id: 'join_' + Date.now().toString(),
        content: `${displayName.trim()} joined the room`,
        sender: 'System',
        timestamp: new Date().toISOString()
      };
      
      room.messages = [...(room.messages || []), joinMessage];
      
      // Update room in AsyncStorage
      await AsyncStorage.setItem(
        'tempRooms', 
        JSON.stringify(existingRooms.map((r: any) => 
          r.id === room.id ? room : r
        ))
      );
      
      // Navigate to chat room
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('Chat', { roomId: room.id });
      }, 1000);
    } catch (error) {
      console.error('Error joining room:', error);
      setIsLoading(false);
      alert('Error joining room. Please try again.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Join Temporary Room</Text>
            <Text style={styles.subtitle}>Enter room details to join an existing chat</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter room name"
                value={roomName}
                onChangeText={setRoomName}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Passcode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter room passcode"
                value={passcode}
                onChangeText={setPasscode}
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Leave blank if the room doesn't have a passcode
              </Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Display Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="How you'll appear in the chat"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleJoinRoom}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Joining...' : 'Join Room'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    padding: 20,
    flex: 1,
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

export default JoinRoomScreen;
