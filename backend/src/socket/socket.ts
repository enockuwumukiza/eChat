import { Server, Socket } from "socket.io";
import http from "http";
import express, { Express } from "express";

const app: Express = express();
const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "DELETE", "PUT"],
    optionsSuccessStatus: 200,
  },
});

// Map to keep track of userId to socketId mapping
const userSocketMap: Record<string, string> = {};
// Map to keep track of users' rooms (including both group and single chats)
const userRoomMap: Record<string, string[]> = {};


export const getReceiverSocketId = (receiverId: string): string => {
  return userSocketMap[receiverId];
};

export const getUserIdFromSocketId = (socketId: string): string | undefined => {
  return Object.keys(userSocketMap).find(userId => userSocketMap[userId] === socketId);
};

export const handleJoinRoom = (userId: string, roomId: string, socket: Socket) => {
  if (!userRoomMap[userId]) {
    userRoomMap[userId] = [];
  }

  
  if (!userRoomMap[userId].includes(roomId)) {
    socket.join(roomId);
    userRoomMap[userId].push(roomId); 
    socket.emit('joined-room', { roomId });
    socket.to(roomId).emit('user-joined', { userId, roomId });
   
  }
};

export const handleLeaveRoom = (userId: string, roomId: string, socket: Socket) => {
  if (userRoomMap[userId] && userRoomMap[userId].includes(roomId)) {
    socket.leave(roomId);
    userRoomMap[userId] = userRoomMap[userId].filter(id => id !== roomId); // Remove room from user's list
    socket.emit('left-room', { roomId });
    
  }
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  

  socket.broadcast.emit('user-connected', `New user is online socket_id : ${socket.id} possible user id ${getUserIdFromSocketId(socket?.id)}`);


  socket.on('single-typing', ({ authName, receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      
      socket.to(receiverSocketId).emit('displaySingleTyping', { authName });
      
    }
  });


  
   socket.on('group-typing', ({ authName, authId, groupId }) => {
    if (groupId && authId) {
      const memberSocket: Socket | undefined = io.sockets.sockets.get(getReceiverSocketId(authId as any));
      memberSocket?.join(groupId);
      
      memberSocket?.broadcast?.to(groupId).emit('displayGroupTyping', { authName });
      
    }
   });
   socket.on('stop-group-typing', ({ groupId }) => {
    if (groupId) {
      // Notify other members that typing has stopped
      socket.broadcast.emit('removeGroupTyping');
      
    }
  });

  socket.on('stop-single-typing', ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit('removeSingleTyping');
    }
  });

  socket.on('stop-group-typing', ({ groupId }) => {
    socket.broadcast.to(groupId).emit('removeGroupTyping');
  });

  // Retrieve userId from handshake query
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

 
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

 
  socket.on("disconnect", () => {
    const userId:any = getUserIdFromSocketId(socket.id);  

    if (userRoomMap[userId]) {
     
      userRoomMap[userId].forEach(roomId => {
        handleLeaveRoom(userId, roomId, socket);
      });
    }

    // Remove user from the map upon disconnection
    if (userId) {
      delete userSocketMap[userId];
    }

    // Emit updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server };


  