
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical, Clock } from 'lucide-react';
import ChatInput from '@/components/chat/ChatInput';
import ChatBubble from '@/components/chat/ChatBubble';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<{ name: string; expiresAt?: Date } | null>(null);
  const [username, setUsername] = useState<string>('User');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadRoomData = async () => {
      // Get current user
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setUsername(user.username || 'User');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
      
      // For demo purposes, we're mocking the data
      // In a real app, this would come from an API
      if (roomId) {
        // Temporary room data
        const roomData = {
          id: roomId,
          name: 'Project Discussion',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        };
        setRoomInfo(roomData);
        
        // Mock messages for room
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
      }
    };
    
    loadRoomData();
  }, [roomId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleBackPress = () => {
    navigate(-1);
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
    toast.warning("Leave chat?", {
      action: {
        label: "Leave",
        onClick: () => navigate('/home')
      },
    });
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <header className="flex items-center justify-between p-3 border-b bg-white">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackPress} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="font-semibold">{roomInfo?.name || 'Chat'}</h1>
            {roomInfo?.expiresAt && (
              <div className="flex items-center text-xs text-orange-500">
                <Clock size={12} className="mr-1" />
                <span>Expires in {calculateExpiryTime(roomInfo.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleOptionsPress}>
          <MoreVertical size={20} />
        </Button>
      </header>
      
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={formatTimestamp(message.timestamp)}
              isSelf={message.sender === username}
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
