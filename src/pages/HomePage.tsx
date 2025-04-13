
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import ChatItem from '@/components/ChatItem';
import RoomCard from '@/components/RoomCard';

interface ChatItemType {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  expiresIn?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username?: string, email?: string }>({});
  const [personalChats, setPersonalChats] = useState<ChatItemType[]>([]);
  const [tempRooms, setTempRooms] = useState<ChatItemType[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = localStorage.getItem('user');
        if (!userDataString) {
          navigate('/auth');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/auth');
      }
    };

    loadUserData();
    loadChats();
  }, [navigate]);

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
    
    // Load temporary rooms - in a real app, this would be from localStorage or an API
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
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  const handleCreateRoom = () => {
    // In a real app, navigate to create room page
    toast.info('Create room feature coming soon');
  };

  const handleJoinRoom = () => {
    // In a real app, navigate to join room page
    toast.info('Join room feature coming soon');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold text-primary">TempChat</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hi, {user.username || 'User'}!</span>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut size={18} />
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <Tabs defaultValue="temporary" className="flex-1 overflow-hidden">
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          <TabsTrigger value="personal">Personal Chats</TabsTrigger>
          <TabsTrigger value="temporary">Temporary Rooms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="overflow-y-auto p-4">
          {personalChats.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">No personal chats yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {personalChats.map((chat) => (
                <ChatItem key={chat.id} {...chat} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="temporary" className="overflow-y-auto">
          <div className="flex p-4">
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
          </div>
          
          <h2 className="font-semibold px-4 mt-2">Your Temporary Rooms</h2>
          <div className="p-4 pt-2">
            {tempRooms.length === 0 ? (
              <div className="flex items-center justify-center h-40 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No temporary rooms yet. Create or join one!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tempRooms.map((room) => (
                  <ChatItem key={room.id} {...room} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
