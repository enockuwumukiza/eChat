import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500">
      <div className="flex flex-col items-center space-y-4">
        {/* Circular Progress Indicator */}
        <CircularProgress
          size={80}
          style={{
            color: '#ffffff',
          }}
        />
        {/* Beautiful Spinner */}
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-white animate-bounce"></div>
          <div className="w-5 h-5 rounded-full bg-white animate-bounce delay-200"></div>
          <div className="w-5 h-5 rounded-full bg-white animate-bounce delay-400"></div>
        </div>
        {/* Text */}
        <p className="text-white font-bold text-xl animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loader;
