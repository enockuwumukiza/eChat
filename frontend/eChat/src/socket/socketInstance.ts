import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

let socket: Socket | null = null;

export const socketInstance = ({userId}:any) => {
  
  if (!socket) {
    socket = io('http://localhost:5000', {
      auth: {
           token: import.meta.env.VITE_WS_TOKEN
        },
        query: { userId },
        autoConnect:false
      });
    }

  return socket;
};
