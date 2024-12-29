import express from "express";
import { verifyToken } from "../middlewares/VerifyToken";
import {
     sendGroupMessage,
     sendSingleMessage,
    searchMessages,
    getMessagesByChat,
    toggleLikeMessage,
    togglePinMessage,
    deleteMessage,
    markMessagesAsRead,
    getSingleMessage,
} from '../controllers/message.controller'
import { uploaderForChats } from "../middlewares/uploader";

const messageRoutes = express.Router();

messageRoutes.post('/group/:groupId',verifyToken,uploaderForChats, sendGroupMessage);
messageRoutes.post('/single/:receiverId',verifyToken,uploaderForChats, sendSingleMessage);
messageRoutes.put('/read/:id', verifyToken, markMessagesAsRead);

messageRoutes.put('/like/:id', verifyToken, toggleLikeMessage);
messageRoutes.put('/pin/:id', verifyToken, togglePinMessage);
messageRoutes.get('/single/:id', verifyToken, getSingleMessage);
messageRoutes.post('/search/:id', verifyToken, searchMessages);
messageRoutes.route('/:id')
    .get(verifyToken, getMessagesByChat);
messageRoutes.delete('/:id', verifyToken, deleteMessage);




export {
    messageRoutes
}