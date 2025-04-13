
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  expiresIn?: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ 
  id,
  name, 
  lastMessage, 
  timestamp, 
  unread = 0,
  expiresIn
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/chat/${id}`);
  };
  
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors card-hover mb-2"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
              <span className="text-xs text-gray-500">{timestamp}</span>
            </div>
            
            <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
            
            {expiresIn && (
              <div className="text-xs text-orange-500 flex items-center mt-1">
                <Clock size={12} className="mr-1" />
                <span>Expires in: {expiresIn}</span>
              </div>
            )}
          </div>
        </div>
        
        {unread > 0 && (
          <div className="ml-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
            <span className="text-xs text-white">{unread}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatItem;
