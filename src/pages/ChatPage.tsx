
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Clock, MoreVertical } from 'lucide-react';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatTime, timeUntilExpiry, generateRandomId } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}').username || 'Anonymous';

  // Fetch room data
  useEffect(() => {
    if (!roomId) {
      setError('Invalid room ID');
      setLoading(false);
      return;
    }
    
    // In a real app, this would be an API call
    const tempRooms = JSON.parse(localStorage.getItem('tempRooms') || '[]');
    const foundRoom = tempRooms.find((r: any) => r.id === roomId);
    
    if (!foundRoom) {
      setError('Room not found');
      setLoading(false);
      return;
    }
    
    // Check if room has expired
    if (new Date(foundRoom.expiresAt) < new Date()) {
      setError('This room has expired');
      setLoading(false);
      return;
    }
    
    setRoom(foundRoom);
    setMessages(foundRoom.messages || []);
    setExpiryTime(timeUntilExpiry(foundRoom.expiresAt));
    setLoading(false);
    
    // Add a simulated welcome message if no messages
    if (!foundRoom.messages || foundRoom.messages.length === 0) {
      const welcomeMsg = {
        id: generateRandomId(),
        content: `Welcome to ${foundRoom.name}! This room will expire in ${timeUntilExpiry(foundRoom.expiresAt)}.`,
        sender: 'System',
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMsg]);
      
      // Update in localStorage
      foundRoom.messages = [welcomeMsg];
      localStorage.setItem('tempRooms', JSON.stringify(
        tempRooms.map((r: any) => r.id === roomId ? foundRoom : r)
      ));
    }
  }, [roomId]);
  
  // Update expiry countdown
  useEffect(() => {
    if (!room) return;
    
    const timer = setInterval(() => {
      setExpiryTime(timeUntilExpiry(room.expiresAt));
      
      // Check if room has expired
      if (new Date(room.expiresAt) < new Date()) {
        clearInterval(timer);
        toast.error('This room has expired');
        navigate('/home');
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [room, navigate]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (!roomId || !room) return;
    
    const newMessage = {
      id: generateRandomId(),
      content,
      sender: currentUser,
      timestamp: new Date().toISOString()
    };
    
    // Update local state
    setMessages(prev => [...prev, newMessage]);
    
    // Update in localStorage
    const tempRooms = JSON.parse(localStorage.getItem('tempRooms') || '[]');
    const updatedRooms = tempRooms.map((r: any) => {
      if (r.id === roomId) {
        return {
          ...r,
          messages: [...(r.messages || []), newMessage]
        };
      }
      return r;
    });
    
    localStorage.setItem('tempRooms', JSON.stringify(updatedRooms));
  };
  
  // Handle leaving the room
  const handleLeaveRoom = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading chat...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/home')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <header className="bg-white shadow-sm p-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLeaveRoom}
            className="text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="font-semibold">{room?.name}</h1>
            {expiryTime && (
              <p className="text-xs flex items-center gap-1 text-orange-500">
                <Clock className="h-3 w-3" /> Expires in {expiryTime}
              </p>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLeaveRoom}>
              Leave Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={formatTime(new Date(message.timestamp))}
              isSelf={message.sender === currentUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
