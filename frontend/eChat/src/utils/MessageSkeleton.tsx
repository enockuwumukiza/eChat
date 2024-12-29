import React from 'react';

const MessageSkeleton = () => {
  return (
    <div className="fixed flex flex-col right-0 w-[41.6%] h-full bg-base-100 shadow-lg rounded-lg p-4 space-y-6">
      {/* Header Skeleton */}
      <div className="sticky top-0 bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-4 flex justify-between items-center shadow-md z-10 animate-pulse">
        <div className="absolute text-sky-300 top-14 right-[80%] w-24 h-4 bg-gray-300 rounded"></div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
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
      <div className="chat chat-end flex items-center space-x-4 ml-auto">
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
      <div className="chat chat-end flex items-center space-x-4 ml-auto">
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
