import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { Group,IGroup } from "../models/group.model";
import {io,  getReceiverSocketId} from "../socket/socket";
import { User } from "../models/user.model";
import { Socket } from "socket.io";
import mongoose from "mongoose";
import { HttpStatusCodes } from "../utils/httpStatusCodes";

const createGroup = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, memberNames } = req.body;

  if (!name || !Array.isArray(memberNames) || memberNames.length === 0) {
    res.status(400).json({ error: "Invalid group data" });
    return;
  }

  const existingGroup = await Group.findOne({ name });
  if (existingGroup) {
    res.status(409).json({ message: `Group ${name} already exists!` });
    return;
  }

  try {
    const members: { userId: mongoose.Types.ObjectId; role: string }[] = [];

    if (!req.user || !req.user._id) {
      res.status(401).json({ error: "Unauthorized: No user data available" });
      return;
    }

    // Add the user who created the group as admin
    members.push({ userId: req.user._id as mongoose.Types.ObjectId, role: 'admin' });

    

    // Add other members to the group
    for (const memberName of memberNames) {
      const user = await User.findOne({ name: memberName });

      if (!user) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: `User ${memberName} not found.` });
        continue;
        
      }

      members.push({ userId: user._id as mongoose.Types.ObjectId, role: "member" });

    }

    if (members.length === 0) {
      res.status(400).json({ error: "No valid members found for the group" });
      return;
    }

    // Create the group with the members
    const newGroup = new Group({
      name,
      members,
      groupAdmin: req.user._id,
    });
    await newGroup.save();

    const membersOfGroup = newGroup?.members;
    for (const member of membersOfGroup) {
      const memberSocket: Socket | undefined = io.sockets.sockets.get(getReceiverSocketId(member?.userId as any));
      if (memberSocket) {
        memberSocket.join(newGroup?._id as any);
        const memberFound = await User.findById(member?.userId).exec();
        io.to(newGroup?._id as any).emit('member-joined', `${memberFound?.name} has joined ${newGroup?.name}`);
      }
    }


    res.status(201).json({ newGroup });
    
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the group" });
  }
});

const getGroups = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req?.user?._id;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        // Fetch groups where the user is a member
        const groups = await Group.find({ "members.userId": userId });
        
        if (!groups.length) {
            res.status(404).json({ message: 'No groups found for this user' });
            return;
        }

        res.json({ groups });
    } catch (error:any) {
        res.status(500).json({ message: 'Error fetching groups', error: error.message });
    }
});


const getGroupMembers = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;

    const groupMembers = await Group.findById(groupId).populate({
        path: 'members.userId'
    }).populate('groupAdmin')
    
    if (!groupMembers) {
        res.status(404).json({ message: `group and group members were not found` });
        return;
    }
    
    res.json({ groupMembers })
});

const getGroupMessages = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;

    try {
        const groupMessages = await Group.findById(groupId)
            .populate({
                path: 'messages',
                populate: { path: 'sender', model: 'User' },
            })
            .populate('latestMessage')
            .populate('groupAdmin'); 

        if (!groupMessages) {
            res.status(404).json({ message: `Group not found` });
            return;
        }

        const messages = groupMessages?.messages;

        res.json({ messages });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while retrieving group messages" });
    }
});


const getGroupById = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members.userId').populate('groupAdmin');
    if (!group) {
        res.status(404).json({ message: `group was not found` });
        return;
    }
    res.json({ group });
});

const addMemberToGroup = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
    const { memberName } = req.body;
    

    try {
      
        const group = await Group.findById(groupId).exec();

        const memberFound = group?.members.find((member:any) => member?.userId.equals(req?.user?._id));

        

        if (memberFound?.role !== 'admin') {
                res.status(401).json({
                message: 'Only admins can add members to group!'
            });
            return;
        }

        if (!memberName) {
                res.status(400).json({ message: 'Member name is required' });
                return;
            }
        const member = await User.findOne({ name: memberName });
            

      if (!member || !group) {
        res.status(404).json({ message: "User or group not found" });
        return;
      }

      if (group.members.some((m) => m.userId.equals(<mongoose.Types.ObjectId>member._id))) {
        res.status(400).json({ message: "User is already a member" });
        return;
      }

      group.members.push({ userId: member._id as mongoose.Types.ObjectId, role: "member" });
      await group.save();

      const memberSocket: Socket | undefined = io.sockets.sockets.get(getReceiverSocketId(member?._id as any));
      const memberSocketId = getReceiverSocketId(member?._id as any);

    if (memberSocket && memberSocketId) {
        memberSocket?.join(group?._id as string);
        io.to(memberSocketId).emit("group-added", { groupId, groupName: group.name });
        io.to(group?._id as string).emit('member-joined', `${member.name} has joined the chat`);
    
      }


    res.json({ message: "Member added successfully", group });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the member" });
  }
});


// Remove a member from a group
const removeMemberFromGroup = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { groupId } = req.params;
    const { memberName } = req.body;

    
    try {

        const group = await Group.findById(groupId);
        const memberFound = group?.members.find((member) => member?.userId === req?.user?._id);

        if (memberFound?.role !== 'admin') {
                res.status(401).json({
                message: 'Only admins can remove members from group!'
            });
            return;
        }
        const member = await User.findOne({ name: memberName });
        

        if (!member || !group) {
            res.status(404).json({ error: "User or group not found" });
            return;
        }

        const memberIndex = group.members.findIndex((m) => m.userId.equals(member._id as mongoose.Types.ObjectId));
        if (memberIndex === -1) {
            res.status(400).json({ error: "User is not a member" });
            return;
        }

        group.members.splice(memberIndex, 1);
        await group.save();

         const memberSocket: Socket | undefined = io.sockets.sockets.get(getReceiverSocketId(member?._id as any));
      const memberSocketId = getReceiverSocketId(member?._id as any);

      if (memberSocket && memberSocketId) {
          memberSocket?.leave(group?._id as string);
          io.to(group?._id as string).emit("member-left", { groupId, groupName: group.name });
          
      
      }

        res.json({ message: "Member removed successfully", group });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while removing the member" });
    }
});

export { createGroup, addMemberToGroup, removeMemberFromGroup, getGroups,getGroupById, getGroupMembers, getGroupMessages };

