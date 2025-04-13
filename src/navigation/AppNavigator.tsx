
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SplashScreen from '../pages/SplashScreen';  // Using the web pages instead of screens
import AuthPage from '../pages/AuthPage';
import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import NotFound from '../pages/NotFound';

const AppNavigator: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
        <Route path="/" element={<SplashScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppNavigator;
