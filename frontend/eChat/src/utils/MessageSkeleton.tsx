import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="fixed top-[14.6%] flex flex-col right-0 w-[100%] md:w-[100%] lg:w-[41.6%] h-full bg-base-100 shadow-lg rounded-lg p-4 space-y-6">
     
      {/* Sender Skeleton */}
            <div className="chat chat-start flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Receiver Skeleton */}
            <div className="chat chat-end  flex items-center space-x-4 ml-auto">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
      </div>
       {/* Sender Skeleton */}
            <div className="chat chat-start flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Receiver Skeleton */}
            <div className="chat chat-end  flex items-center space-x-4 ml-auto">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
      </div>
      
       {/* Sender Skeleton */}
            <div className="chat chat-start flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Receiver Skeleton */}
            <div className="chat chat-end  flex items-center space-x-4 ml-auto">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
      </div>
      
       {/* Sender Skeleton */}
            <div className="chat chat-start flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Receiver Skeleton */}
            <div className="chat chat-end  flex items-center space-x-4 ml-auto">
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
     
    </div>
  );
};

export default MessageSkeleton;
