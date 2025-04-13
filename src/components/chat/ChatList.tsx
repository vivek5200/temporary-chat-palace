
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  isTemporary?: boolean;
  expiresIn?: string;
}

interface ChatListProps {
  chats: Chat[];
  emptyMessage: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, emptyMessage }) => {
  const navigate = useNavigate();

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="space-y-3">
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors card-hover"
          onClick={() => handleChatClick(chat.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                {chat.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                
                {chat.isTemporary && (
                  <div className="text-xs text-orange-500 mb-1">
                    Expires in: {chat.expiresIn}
                  </div>
                )}
                
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
            
            {chat.unread && chat.unread > 0 && (
              <div className="ml-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-xs text-white">{chat.unread}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ChatList;
