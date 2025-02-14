import { io, Socket } from 'socket.io-client';


let socket: Socket | null = null;

export const socketInstance = ({userId}:any) => {
  
  if (!socket) {
    socket = io('https://echat-fieq.onrender.com', {
      auth: {
           token: import.meta.env.VITE_WS_TOKEN
        },
        query: { userId },
        autoConnect: false,
        transports: ["websocket", "polling"]
      });
    }

  return socket;
};
