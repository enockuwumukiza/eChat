import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage:React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-gray-800 to-purple-900 text-white">
            <div className="text-center max-w-lg mx-auto p-6 bg-opacity-60 rounded-lg shadow-2xl">
                {/* Icon with animation */}
                <motion.div 
                    className="flex justify-center mb-4"
                    animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <ErrorOutlineIcon fontSize="large" className="text-yellow-300" />
                </motion.div>
                
                {/* 404 Heading */}
                <h1 className="text-8xl font-extrabold mb-4 animate-pulse">
                    404
                </h1>

                {/* Subtitle */}
                <p className="text-2xl font-semibold text-gray-300 mb-6">
                    Oops! The page you're looking for doesn't exist.
                </p>

                {/* Go Back Button */}
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black font-bold py-2 px-8 rounded-lg shadow-md"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
