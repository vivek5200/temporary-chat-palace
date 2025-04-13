
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { generateRandomId } from '@/lib/utils';

const CreateRoomForm: React.FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [expiry, setExpiry] = useState('60'); // Default 1 hour
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      toast.error('Room name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate a unique room ID
      const roomId = generateRandomId();
      
      // Calculate expiry time
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + parseInt(expiry));
      
      // In a real app, this would be stored in a database
      const roomData = {
        id: roomId,
        name: roomName,
        passcode: passcode || null, // If no passcode, it's a public room
        createdBy: JSON.parse(localStorage.getItem('user') || '{}').username || 'Anonymous',
        expiresAt: expiryTime.toISOString(),
        messages: []
      };
      
      // Store room in localStorage (in a real app, use a database)
      const existingRooms = JSON.parse(localStorage.getItem('tempRooms') || '[]');
      localStorage.setItem('tempRooms', JSON.stringify([...existingRooms, roomData]));
      
      toast.success('Room created successfully!');
      navigate(`/chat/${roomId}`);
    } catch (error) {
      toast.error('Failed to create room');
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
          placeholder="My Chat Room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="passcode">Passcode (optional)</Label>
        <Input
          id="passcode"
          type="password"
          placeholder="Leave empty for a public room"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          If provided, users will need this passcode to join the room
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiry">Room Expires In</Label>
        <Select defaultValue={expiry} onValueChange={value => setExpiry(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select expiry time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="180">3 hours</SelectItem>
            <SelectItem value="360">6 hours</SelectItem>
            <SelectItem value="1440">24 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Room...' : 'Create Room'}
      </Button>
    </form>
  );
};

export default CreateRoomForm;
