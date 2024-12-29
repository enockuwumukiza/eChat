import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null;

export const socketInstance = () => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            autoConnect:false
        })
    }
    return socket
}