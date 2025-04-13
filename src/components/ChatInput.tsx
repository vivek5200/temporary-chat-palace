
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 border-t bg-white p-3 sticky bottom-0"
    >
      <Button 
        type="button" 
        size="icon" 
        variant="ghost"
        className="text-gray-500 hover:text-gray-700"
        disabled={disabled}
      >
        <Smile className="h-5 w-5" />
      </Button>
      
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
        disabled={disabled}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || disabled}
        className={`text-white ${!message.trim() ? 'opacity-50' : ''}`}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
