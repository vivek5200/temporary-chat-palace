
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkUserAuth = async () => {
      try {
        const userString = localStorage.getItem('user');
        
        // Navigate after a 2 second delay
        setTimeout(() => {
          if (userString) {
            navigate('/home');
          } else {
            navigate('/auth');
          }
        }, 2000);
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/auth');
      }
    };
    
    checkUserAuth();
  }, [navigate]);
  
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-2">
          TC
        </div>
        <h1 className="text-4xl font-bold text-primary">TempChat</h1>
      </div>
      <p className="text-gray-500 mt-4">Create temporary chat rooms, instantly</p>
    </div>
  );
};

export default SplashScreen;
