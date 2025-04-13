import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Feather';

// Import components
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { roomId, chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<{ name: string; expiresAt?: Date } | null>(null);
  const [username, setUsername] = useState<string>('User');
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    const loadRoomData = async () => {
      // Get current user
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUsername(user.username || 'User');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
      
      // For demo purposes, we're mocking the data
      // In a real app, this would come from an API or AsyncStorage
      if (roomId) {
        // Temporary room data
        const roomData = {
          id: roomId,
          name: 'Project Discussion',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        };
        setRoomInfo(roomData);
        
        // Mock messages for temporary room
        const mockMessages = [
          {
            id: '1',
            content: `Welcome to ${roomData.name}! This room will expire in 1 hour.`,
            sender: 'System',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            content: 'Hi everyone! Let\'s discuss the project updates.',
            sender: 'Alice',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString()
          },
          {
            id: '3',
            content: 'I\'ve made some progress on the design.',
            sender: 'Bob',
            timestamp: new Date(Date.now() - 3 * 60000).toISOString()
          }
        ];
        setMessages(mockMessages);
      } else if (chatId) {
        // Personal chat data
        const chatData = {
          id: chatId,
          name: 'Alice Johnson'
        };
        setRoomInfo(chatData);
        
        // Mock messages for personal chat
        const mockMessages = [
          {
            id: '1',
            content: 'Hey, how are you doing?',
            sender: 'Alice',
            timestamp: new Date(Date.now() - 10 * 60000).toISOString()
          },
          {
            id: '2',
            content: 'I\'m good, thanks for asking! How about you?',
            sender: username,
            timestamp: new Date(Date.now() - 8 * 60000).toISOString()
          },
          {
            id: '3',
            content: 'Doing well! Do you have time to catch up this week?',
            sender: 'Alice',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString()
          }
        ];
        setMessages(mockMessages);
      }
    };
    
    loadRoomData();
  }, [roomId, chatId, username]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: text.trim(),
      sender: username,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const formatTimestamp = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };
  
  const handleOptionsPress = () => {
    Alert.alert(
      'Chat Options',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave Chat', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };
  
  const calculateExpiryTime = (expiresAt?: Date): string | null => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    return `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{roomInfo?.name || 'Chat'}</Text>
            {roomInfo?.expiresAt && (
              <View style={styles.expiryContainer}>
                <Icon name="clock" size={12} color="#F5A623" />
                <Text style={styles.expiryText}>
                  Expires in {calculateExpiryTime(roomInfo.expiresAt)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={handleOptionsPress}>
          <Icon name="more-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <MessageBubble
            content={item.content}
            sender={item.sender}
            timestamp={formatTimestamp(item.timestamp)}
            isSelf={item.sender === username}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
          </View>
        )}
      />
      
      {/* Chat input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ChatInput onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  expiryText: {
    fontSize: 12,
    color: '#F5A623',
    marginLeft: 4,
  },
  messagesList: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
});

export default ChatPage;
