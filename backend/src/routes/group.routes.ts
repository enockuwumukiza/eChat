import express from 'express'
import { createGroup, addMemberToGroup, removeMemberFromGroup,getGroups, getGroupById, getGroupMembers, getGroupMessages } from '../controllers/group.controller'
import { verifyToken } from '../middlewares/VerifyToken';


const groupRoutes = express.Router();

groupRoutes.post('/',verifyToken, createGroup);
groupRoutes.get('/',verifyToken, getGroups);
groupRoutes.post('/add/:groupId', verifyToken,addMemberToGroup);
groupRoutes.get('/members/:groupId',verifyToken, getGroupMembers);
groupRoutes.get('/messages/:groupId', verifyToken,getGroupMessages);
groupRoutes.post('/remove/:groupId', verifyToken,removeMemberFromGroup);
groupRoutes.get('/:groupId', verifyToken,getGroupById);


export {
    groupRoutes
}