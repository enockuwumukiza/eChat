// if (socket) {
//     socket.join(name); // Group name is used as the room identifier
//     console.log(`${user.name} joined the group: ${name}`);
// }

// socket.emit('join-group', { groupId });

// socket.on('join-group', ({ groupId }) => {
//   console.log(`Socket ${socket.id} joined group ${groupId}`);
//   socket.join(groupId);
// });

// const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');
// io.to(groupSocketId).emit('group-message', populatedMessage);


// socket.on("typing", ({ groupId, userId }) => {
//   io.to(groupId).emit("typing", { userId });
// });


// New Group created: { "data": { "newGroup": { "name": "Indians", "groupAdmin": "674b781174d01f3ad5ce96d8", "members": [{ "userId": "674b781174d01f3ad5ce96d8", "role": "admin", "_id": "676baa7b2c6c0746305296e5" }, { "userId": "674dcc6369a4b757ebd1f982", "role": "member", "_id": "676baa7b2c6c0746305296e6" }, { "userId": "674c548fa4b7f446a0892117", "role": "member", "_id": "676baa7b2c6c0746305296e7" }], "messages": [], "_id": "676baa7b2c6c0746305296e4", "createdAt": "2024-12-25T06:47:23.737Z", "updatedAt": "2024-12-25T06:47:23.737Z", "__v": 0 } } }



// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Handle socket connections
// io.on('connection', (socket) => {
//   console.log(`New socket connected: ${socket.id}`);

//   // Listen for 'join-group' events
//   socket.on('join-group', ({ groupId }) => {
//     console.log(`Socket ${socket.id} joined group ${groupId}`);
//     socket.join(groupId); // Add the socket to the specified group (room)
    
//     // Optionally notify other users in the group
//     socket.to(groupId).emit('user-joined', { socketId: socket.id, groupId });
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log(`Socket disconnected: ${socket.id}`);
//   });
// });

// // Start the server
// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });


// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000'); // Connect to the server

// // Join a group
// const groupId = 'group123';
// socket.emit('join-group', { groupId });

// // Listen for server messages
// socket.on('user-joined', ({ socketId, groupId }) => {
//   console.log(`User with socket ID ${socketId} joined group ${groupId}`);
// });

// // Additional event listeners (optional)
// socket.on('connect', () => {
//   console.log(`Connected to server with ID: ${socket.id}`);
// });

// socket.on('send-message', ({ groupId, message }) => {
//   io.to(groupId).emit('receive-message', { senderId: socket.id, message });
// });

// // on server
// socket.on('send-message', ({ groupId, message }) => {
//   io.to(groupId).emit('receive-message', { senderId: socket.id, message });
// });


// // on client
// // Emit a message
// socket.emit('send-message', { groupId: 'group123', message: 'Hello, Group!' });

// // Listen for messages
// socket.on('receive-message', ({ senderId, message }) => {
//   console.log(`Message from ${senderId}: ${message}`);
// });


// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Serve static files for the client
// app.use(express.static('public'));

// // Handle socket connections
// io.on('connection', (socket) => {
//   console.log(`Socket connected: ${socket.id}`);

//   // Listen for 'join-room' events
//   socket.on('join-room', ({ roomId }) => {
//     console.log(`Socket ${socket.id} is joining room ${roomId}`);
//     socket.join(roomId);
//     io.to(roomId).emit('room-notification', `User ${socket.id} joined room ${roomId}`);
//   });

//   // Listen for 'leave-room' events
//   socket.on('leave-room', ({ roomId }) => {
//     console.log(`Socket ${socket.id} is leaving room ${roomId}`);
//     socket.leave(roomId);
//     io.to(roomId).emit('room-notification', `User ${socket.id} left room ${roomId}`);
//   });

//   // Handle broadcasting messages in a room
//   socket.on('send-room-message', ({ roomId, message }) => {
//     console.log(`Message to room ${roomId}: ${message}`);
//     io.to(roomId).emit('room-message', { sender: socket.id, message });
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log(`Socket disconnected: ${socket.id}`);
//   });
// });

// // Start the server
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// socket.on('disconnect', () => {
//   // Clean up user from all rooms they belong to
//   socket.leave(roomId);
//   // Inform other users that this user has disconnected
//   socket.to(roomId).emit('user-left', { userId });
// });

// socket.on('reconnect', () => {
//   // Automatically rejoin previous rooms
//   socket.join(roomId);
//   socket.to(roomId).emit('user-rejoined', { userId });
// });



// const userRoomMap = {}; // This will map userId to the list of roomIds

// // When a user joins a room:
// const handleJoinRoom = (userId, roomId, socket) => {
//   if (!userRoomMap[userId]) {
//     userRoomMap[userId] = [];
//   }

//   // Check if the user is already in the room
//   if (!userRoomMap[userId].includes(roomId)) {
//     socket.join(roomId);
//     userRoomMap[userId].push(roomId);  // Add the room to the user's room list
//     socket.emit('joined-room', { roomId });
//     socket.to(roomId).emit('user-joined', { userId, roomId });
//   }
// };

// // When a user leaves a room:
// const handleLeaveRoom = (userId, roomId, socket) => {
//   if (userRoomMap[userId] && userRoomMap[userId].includes(roomId)) {
//     socket.leave(roomId);
//     userRoomMap[userId] = userRoomMap[userId].filter(id => id !== roomId);
//     socket.emit('left-room', { roomId });
//     socket.to(roomId).emit('user-left', { userId, roomId });
//   }
// };

// // Listen for socket events
// socket.on('join-room', ({ userId, roomId }) => {
//   handleJoinRoom(userId, roomId, socket);
// });

// socket.on('leave-room', ({ userId, roomId }) => {
//   handleLeaveRoom(userId, roomId, socket);
// });


// socket.on('send-message', ({ userId, roomId, message }) => {
//   // Broadcast message to all users in the room
//   socket.to(roomId).emit('receive-message', { userId, message });
// });


// socket.on('disconnect', () => {
//   // Handle disconnection and cleanup
//   const userId = getUserIdFromSocket(socket); // Get userId from socket
//   if (userRoomMap[userId]) {
//     userRoomMap[userId].forEach(roomId => {
//       socket.leave(roomId);
//       socket.to(roomId).emit('user-left', { userId });
//     });
//   }
// });



// import mongoose from "mongoose";
// import { Group } from "./models/Group"; // Adjust the import path as necessary

// const checkMemberRole = async (groupId: string, userId: string): Promise<string | null> => {
//   try {
//     // Find the group by ID
//     const group = await Group.findById(groupId).exec();
    
//     if (!group) {
//       console.log("Group not found.");
//       return null;
//     }

//     // Find the member in the group
//     const member = group.members.find(
//       (member) => member.userId.toString() === userId
//     );

//     if (!member) {
//       console.log("User is not a member of this group.");
//       return null;
//     }

//     // Return the member's role
//     console.log(`User role: ${member.role}`);
//     return member.role; // 'admin' or 'member'
//   } catch (error) {
//     console.error("Error checking member role:", error);
//     throw error;
//   }
// };
