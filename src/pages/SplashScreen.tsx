
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    
    // Redirect after a short delay
    const timer = setTimeout(() => {
      if (user) {
        navigate('/home');
      } else {
        navigate('/auth');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="animate-scale-in">
        <Logo size="lg" />
      </div>
      <p className="mt-6 text-gray-500 animate-fade-in" style={{animationDelay: '500ms'}}>
        Create temporary chat rooms, instantly
      </p>
    </div>
  );
};

export default SplashScreen;
