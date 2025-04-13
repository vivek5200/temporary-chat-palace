
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // The Index page simply redirects to the splash screen
  return <Navigate to="/splash" replace />;
};

export default Index;
