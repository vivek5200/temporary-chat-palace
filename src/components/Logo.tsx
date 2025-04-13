
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} text-primary flex items-center gap-2`}>
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
        <span className="text-sm">TC</span>
      </div>
      <span>TempChat</span>
    </div>
  );
};

export default Logo;
