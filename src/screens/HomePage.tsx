
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Feather';

// Import our components
import ChatItem from '../components/ChatItem';
import RoomCard from '../components/RoomCard';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface ChatItemType {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  expiresIn?: string;
}

const HomePage: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'personal' | 'temporary'>('personal');
  const [user, setUser] = useState<{ username?: string, email?: string }>({});
  const [personalChats, setPersonalChats] = useState<ChatItemType[]>([]);
  const [tempRooms, setTempRooms] = useState<ChatItemType[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (!userDataString) {
          navigation.replace('Auth');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
        navigation.replace('Auth');
      }
    };

    loadUserData();
    loadChats();
  }, [navigation]);

  const loadChats = () => {
    // Mock data - in a real app, this would come from an API
    const mockPersonalChats = [
      {
        id: 'personal-1',
        name: 'Alice Johnson',
        lastMessage: 'How are you doing today?',
        timestamp: '10:30 AM',
        unread: 2
      },
      {
        id: 'personal-2',
        name: 'Tech Support',
        lastMessage: 'Your ticket has been resolved.',
        timestamp: 'Yesterday',
        unread: 0
      }
    ];
    
    setPersonalChats(mockPersonalChats);
    
    // Load temporary rooms - in a real app, this would be from AsyncStorage or an API
    const mockTempRooms = [
      {
        id: 'temp-1',
        name: 'Project Discussion',
        lastMessage: 'Let\'s finalize the design',
        timestamp: '11:45 AM',
        expiresIn: '25 minutes'
      },
      {
        id: 'temp-2',
        name: 'Game Night',
        lastMessage: 'I\'ll send the invite link',
        timestamp: '1 hour ago',
        expiresIn: '3 hours'
      }
    ];
    
    setTempRooms(mockTempRooms);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            navigation.replace('Auth');
          }
        }
      ]
    );
  };

  const handleCreateRoom = () => {
    navigation.navigate('CreateRoom');
  };

  const handleJoinRoom = () => {
    navigation.navigate('JoinRoom');
  };

  const handleChatPress = (id: string, isTemp: boolean) => {
    if (isTemp) {
      // Navigate to temporary room chat
      navigation.navigate('Chat', { roomId: id });
    } else {
      // Navigate to personal chat
      navigation.navigate('Chat', { chatId: id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TempChat</Text>
        <View style={styles.userControls}>
          <Text style={styles.userGreeting}>Hi, {user.username || 'User'}!</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Icon name="log-out" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]} 
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
            Personal Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'temporary' && styles.activeTab]} 
          onPress={() => setActiveTab('temporary')}
        >
          <Text style={[styles.tabText, activeTab === 'temporary' && styles.activeTabText]}>
            Temporary Rooms
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Personal Chats Tab Content */}
      {activeTab === 'personal' && (
        <FlatList
          data={personalChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatItem 
              name={item.name}
              lastMessage={item.lastMessage}
              timestamp={item.timestamp}
              unread={item.unread}
              onPress={() => handleChatPress(item.id, false)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No personal chats yet</Text>
            </View>
          )}
        />
      )}
      
      {/* Temporary Rooms Tab Content */}
      {activeTab === 'temporary' && (
        <View style={styles.tempRoomsContainer}>
          <View style={styles.roomCardsContainer}>
            <RoomCard 
              icon="plus-circle"
              title="Create Room"
              description="Start a new temporary chat room"
              onPress={handleCreateRoom}
            />
            <RoomCard 
              icon="key"
              title="Join Room"
              description="Enter an existing chat room"
              onPress={handleJoinRoom}
              accentColor="#F5A623"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Your Temporary Rooms</Text>
          <FlatList
            data={tempRooms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatItem 
                name={item.name}
                lastMessage={item.lastMessage}
                timestamp={item.timestamp}
                expiresIn={item.expiresIn}
                onPress={() => handleChatPress(item.id, true)}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No temporary rooms yet. Create or join one to get started!
                </Text>
              </View>
            )}
          />
        </View>
      )}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  userControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userGreeting: {
    marginRight: 10,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  tempRoomsContainer: {
    flex: 1,
  },
  roomCardsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default HomePage;
