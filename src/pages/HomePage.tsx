
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { PlusCircle, LogOut, KeyRound } from 'lucide-react';
import ChatList from '@/components/chat/ChatList';
import CreateRoomForm from '@/components/rooms/CreateRoomForm';
import JoinRoomForm from '@/components/rooms/JoinRoomForm';
import { timeUntilExpiry } from '@/lib/utils';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username?: string; email?: string }>({});
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);
  const [personalChats, setPersonalChats] = useState<any[]>([]);
  const [tempRooms, setTempRooms] = useState<any[]>([]);

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  // Load chats and rooms
  useEffect(() => {
    // In a real app, this would fetch from an API
    
    // For demo purposes, create some sample personal chats
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
    
    // Load temporary rooms from localStorage
    try {
      const storedRooms = JSON.parse(localStorage.getItem('tempRooms') || '[]');
      
      // Filter out expired rooms and format for display
      const validRooms = storedRooms.filter((room: any) => 
        new Date(room.expiresAt) > new Date()
      ).map((room: any) => ({
        id: room.id,
        name: room.name,
        lastMessage: room.messages && room.messages.length > 0 
          ? room.messages[room.messages.length - 1].content 
          : 'No messages yet',
        timestamp: room.messages && room.messages.length > 0
          ? new Date(room.messages[room.messages.length - 1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          : 'New room',
        isTemporary: true,
        expiresIn: timeUntilExpiry(room.expiresAt)
      }));
      
      setTempRooms(validRooms);
    } catch (e) {
      console.error("Error loading temp rooms:", e);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl text-primary">TempChat</h1>
          
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-sm">Hi, {user.username || 'User'}!</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 max-w-3xl">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="personal">Personal Chats</TabsTrigger>
            <TabsTrigger value="temporary">Temporary Rooms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <ChatList 
              chats={personalChats} 
              emptyMessage="No personal chats yet" 
            />
          </TabsContent>
          
          <TabsContent value="temporary">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-6 cursor-pointer card-hover" onClick={() => setCreateRoomOpen(true)}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <PlusCircle className="h-10 w-10 text-primary mb-2" />
                  <h3 className="font-semibold">Create Room</h3>
                  <p className="text-sm text-gray-500">Start a new temporary chat room</p>
                </div>
              </Card>
              
              <Card className="p-6 cursor-pointer card-hover" onClick={() => setJoinRoomOpen(true)}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <KeyRound className="h-10 w-10 text-accent mb-2" />
                  <h3 className="font-semibold">Join Room</h3>
                  <p className="text-sm text-gray-500">Enter an existing chat room</p>
                </div>
              </Card>
            </div>
            
            <h3 className="font-medium text-lg mb-3">Your Temporary Rooms</h3>
            <ChatList 
              chats={tempRooms} 
              emptyMessage="No temporary rooms yet. Create or join one to get started!" 
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Create Room Dialog */}
      <Dialog open={createRoomOpen} onOpenChange={setCreateRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Temporary Room</DialogTitle>
          </DialogHeader>
          <CreateRoomForm />
        </DialogContent>
      </Dialog>
      
      {/* Join Room Dialog */}
      <Dialog open={joinRoomOpen} onOpenChange={setJoinRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Temporary Room</DialogTitle>
          </DialogHeader>
          <JoinRoomForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
