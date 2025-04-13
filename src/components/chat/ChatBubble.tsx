
import React from 'react';

interface MessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isSelf: boolean;
}

const ChatBubble: React.FC<MessageProps> = ({ content, sender, timestamp, isSelf }) => {
  return (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex flex-col">
        {!isSelf && (
          <span className="text-xs text-gray-500 mb-1 ml-1">{sender}</span>
        )}
        <div className={isSelf ? 'chat-bubble-self' : 'chat-bubble-other'}>
          {content}
          <div className={`text-[10px] text-gray-500 text-right mt-1`}>
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
