
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const JoinRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Pre-fill display name if available
  React.useEffect(() => {
    if (user.username) {
      setDisplayName(user.username);
    }
  }, [user.username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim() || !displayName.trim()) {
      toast.error('Room name and display name are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would check against a database
      const existingRooms = JSON.parse(localStorage.getItem('tempRooms') || '[]');
      const room = existingRooms.find((r: any) => r.name === roomName);
      
      if (!room) {
        toast.error('Room not found');
        setIsLoading(false);
        return;
      }
      
      // Check if room has expired
      if (new Date(room.expiresAt) < new Date()) {
        toast.error('This room has expired');
        setIsLoading(false);
        return;
      }
      
      // Check passcode if room has one
      if (room.passcode && room.passcode !== passcode) {
        toast.error('Invalid passcode');
        setIsLoading(false);
        return;
      }
      
      // Success! Navigate to the room
      toast.success(`Joining ${roomName}...`);
      navigate(`/chat/${room.id}`);
      
    } catch (error) {
      toast.error('Failed to join room');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="room-name">Room Name</Label>
        <Input
          id="room-name"
          placeholder="Enter the room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passcode">Passcode</Label>
        <Input
          id="passcode"
          type="password"
          placeholder="Enter room passcode (if required)"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Leave empty if joining a public room
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="display-name">Your Display Name</Label>
        <Input
          id="display-name"
          placeholder="How others will see you"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Joining Room...' : 'Join Room'}
      </Button>
    </form>
  );
};

export default JoinRoomForm;
