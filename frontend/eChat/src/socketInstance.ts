import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null;

export const socketInstance = () => {
    if (!socket) {
        socket = io('https://echat-fieq.onrender.com', {
            autoConnect:false
        })
    }
    return socket
}