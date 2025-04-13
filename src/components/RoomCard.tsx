
import React from 'react';
import { Card } from "@/components/ui/card";
import { PlusCircle, Key } from 'lucide-react';

interface RoomCardProps {
  icon: "plus-circle" | "key";
  title: string;
  description: string;
  onPress: () => void;
  accentColor?: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  icon,
  title,
  description,
  onPress,
  accentColor = '#4A90E2'
}) => {
  return (
    <Card 
      className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mx-2 flex-1"
      onClick={onPress}
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: accentColor + '20' }} // 20% opacity
      >
        {icon === "plus-circle" ? (
          <PlusCircle size={24} color={accentColor} />
        ) : (
          <Key size={24} color={accentColor} />
        )}
      </div>
      <h3 className="font-semibold text-center">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </Card>
  );
};

export default RoomCard;
