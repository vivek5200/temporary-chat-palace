
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Platform,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      Keyboard.dismiss();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.button}>
          <Icon name="smile" size={24} color="#666" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        
        <TouchableOpacity style={styles.button}>
          <Icon name="paperclip" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.sendButton} 
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Icon name="send" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 16,
    maxHeight: 100,
  },
  button: {
    padding: 8,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;
