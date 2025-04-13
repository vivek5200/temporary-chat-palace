
import React from 'react';

interface MessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isSelf: boolean;
}

const ChatBubble: React.FC<MessageProps> = ({ content, sender, timestamp, isSelf }) => {
  // System messages get a different style
  const isSystem = sender === 'System';

  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex flex-col">
        {!isSelf && !isSystem && (
          <span className="text-xs text-gray-500 mb-1 ml-1">{sender}</span>
        )}
        <div className={`rounded-lg p-3 ${isSelf ? 'bg-primary text-white' : isSystem ? 'bg-gray-100 text-gray-600' : 'bg-white border'}`}>
          <p>{content}</p>
          <div className="text-[10px] text-right mt-1 opacity-70">
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
