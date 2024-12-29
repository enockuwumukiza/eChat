import React from 'react';
import { Link } from 'react-router-dom'; 
import { Button } from '@mui/material'; 
import { AiOutlineMessage } from 'react-icons/ai'; 

const NoChatSelected = () => {
    return (
        <div className="absolute right-0 flex flex-col justify-center items-center h-full bg-base-200 p-8 rounded-xl shadow-xl w-11/12 sm:w-2/5 lg:w-2/5 mx-auto">
            {/* Icon with DaisyUI */}
            <div className="flex justify-center items-center bg-primary text-white p-6 rounded-full mb-6 shadow-md">
                <AiOutlineMessage className="h-16 w-16" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">No Chat Selected</h2>

            {/* Text description */}
            <p className="text-gray-600 text-lg text-center mb-6">
                It looks like you haven't selected a chat yet. Choose one from the sidebar to start messaging.
            </p>

            {/* Button */}
            <Link
                to="/chats" // Link to your chats page or list of conversations
                className="w-full"
            >
                <Button
                    variant="contained"
                    color="primary"
                    className="w-full py-3 text-lg font-semibold rounded-full shadow-md hover:bg-blue-600 transition duration-300"
                >
                    View Chats
                </Button>
            </Link>
        </div>
    );
};

export default NoChatSelected;
