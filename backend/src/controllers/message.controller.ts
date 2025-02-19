import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Message } from '../models/message.model';
import { Group } from '../models/group.model';
import {io, getReceiverSocketId } from '../socket/socket';
import { Socket } from 'socket.io';
import { HttpStatusCodes } from '../utils/httpStatusCodes';
import { Conversation } from '../models/conversation.model';
import { User } from '../models/user.model';
import { uploadFileHandler } from '../utils/uploadFileHandler';

import { IImage, IVideo, IAudio, INormalFile,FileFields } from '../utils/globalTypes';

// Send a group message
const sendGroupMessage = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body;
  const { groupId } = req.params;

  // Validate group existence
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Group not found' });
    return;
  }

  const senderId = req?.user?._id;
  let messageType = "text";
  if (!senderId) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Not Authorized -- login to send message'
    });
    return;
  }


  const files = req?.files as FileFields;
    
    let image: IImage | File[] | undefined;
    let audio: IAudio | File[] | undefined;
    let video: IVideo | File[] | undefined;
    let normalFile: INormalFile | File[] | undefined;
    
    

    if (files) {
      
      if (files?.photo && files?.photo?.length > 0) {

        try {
          
          const result = await uploadFileHandler(files?.photo[0], 'image');
          messageType = 'image';
          if (result) {
            image = {
          
              id: result?.public_id,
              url: result?.secure_url,
              name:files?.photo[0]?.originalname?.toString(),
          }
          }
        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error sending image: ${error?.message}` });
          return;
        }
      }
      if (files?.audio && files?.audio?.length > 0) {
        try {
          const result = await uploadFileHandler(files?.audio[0], 'raw');
          messageType = 'audio';

          if (result) {
            audio = {
            id: result.public_id,
            url: result.secure_url,
            name:files?.audio[0]?.originalname?.toString(),
          }
          }
        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `error sending audio ${error?.message}`
          });
          return;
        }
      }
      if (files?.video && files?.video?.length > 0) {
        try {
          const result = await uploadFileHandler(files?.video[0], 'video');
          messageType = 'video';
          if (result) {
            video = {
            id: result?.public_id,
              url: result?.secure_url,
            name:files?.video[0]?.originalname?.toString(),
          };
          }

        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `error sending video: ${error?.message}`
          });
          return;
        }
      }
      if (files?.normalFile && files?.normalFile?.length > 0) {
        try {
          const result = await uploadFileHandler(files.normalFile[0], 'raw');

          messageType = 'file';

          if (result) {
            normalFile = {
              id: result?.public_id,
              url: result?.secure_url,
              name:files.normalFile[0]?.originalname?.toString(),
            }
          }
        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message:`Error sending file: ${error?.message}`
          })
        }
      }
       
    }


    const fileUrl = messageType === 'image' ? image :
                    messageType === 'audio'   ? audio :
                    messageType === 'video'  ? video :
                    messageType === 'file' ? normalFile: undefined

  try {
    // Create and save the message
    const newMessage = new Message({
      sender: senderId,
      groupId,
      content,
      chatType: 'Group',
      chat: group._id,
      messageType,
      fileUrl,
    });

    await newMessage.save();

    // Update latest message in group
    if (group && newMessage) {
      await group.updateOne({ latestMessage: newMessage._id });
    }

    // Add message ID to the group's messages array
    group.messages.push(newMessage._id as mongoose.Types.ObjectId);
    await group.save();

    // Populate sender information
    const message = await Message.findById(newMessage._id).populate('sender');

     const membersOfGroup = group?.members;
    for (const member of membersOfGroup) {
      const memberSocket: Socket | undefined = io.sockets.sockets.get(getReceiverSocketId(member?.userId as any));
      if (memberSocket) {
        memberSocket.join(group?._id as any);
        io.to(group?._id as any).emit('group-message', message);
        
    }
    }

    res.status(HttpStatusCodes.CREATED).json({ message, group });
    
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send message' });
  }
});


// Send a single message
const sendSingleMessage = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { content,status } = req.body;
  const { receiverId } = req.params;
  const senderId = req?.user?._id;
  let messageType: string = 'text';

  const receiver = await User.findById(receiverId);
  const receiverName = receiver?.name;
  const receiverImage = receiver?.profilePicture;

  if (!senderId) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({
      message: 'Not authorized -- login to send a message.',
    });
    return;
  }

  if (!receiverId) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      message: 'Receiver ID is required.',
    });
    return;
  }


  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [],
      });
    }
  

    const files = req?.files as FileFields;
    
    let image: IImage | File[] | undefined;
    let audio: IAudio | File[] | undefined;
    let video: IVideo | File[] | undefined;
    let normalFile: INormalFile | File[] | undefined;
    
    

    if (files) {
      
      if (files?.photo && files?.photo?.length > 0) {

        try {
          
          const result = await uploadFileHandler(files?.photo[0], 'image');
          messageType = 'image';
          if (result) {
            image = {
          
              id: result?.public_id,
              url: result?.secure_url,
              name:files?.photo[0]?.originalname?.toString(),
          }
          }
        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error sending image: ${error?.message}` });
          return;
        }
      }
      if (files?.audio && files?.audio?.length > 0) {
        try {
          const result = await uploadFileHandler(files?.audio[0], 'raw');
          messageType = 'audio';

          if (result) {
            audio = {
            id: result.public_id,
            url: result.secure_url,
            name:files?.audio[0]?.originalname?.toString(),
          }
          }
        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `error sending audio ${error?.message}`
          });
          return;
        }
      }
      if (files?.video && files?.video?.length > 0) {
        try {
          const result = await uploadFileHandler(files?.video[0], 'video');
          messageType = 'video';
          if (result) {
            video = {
            id: result?.public_id,
              url: result?.secure_url,
            name:files?.video[0]?.originalname?.toString(),
          };
          }

        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: `error sending video: ${error?.message}`
          });
          return;
        }
      }
      if (files?.normalFile && files?.normalFile?.length > 0) {
        try {
          const result = await uploadFileHandler(files.normalFile[0], 'raw');

          messageType = 'file';

          if (result) {
            normalFile = {
              id: result?.public_id,
              url: result?.secure_url,
              name:files.normalFile[0]?.originalname?.toString(),
            }
          }
        } catch (error:any) {
          res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message:`Error sending file: ${error?.message}`
          })
        }
      }
       
    }


    const fileUrl = messageType === 'image' ? image :
                    messageType === 'audio'   ? audio :
                    messageType === 'video'  ? video :
                    messageType === 'file' ? normalFile: undefined

    const newMessage = new Message({
      sender: senderId,
      chatType: 'Conversation',
      chat: conversation._id,
      messageType,
      receiver: receiverId,
      content,
      status,
      fileUrl
    });

    const savedMessage = await newMessage.save();
    const message = await newMessage.populate([
      { path: 'sender', populate:{path:'profilePicture'} },
      { path: 'receiver', populate:{path:'profilePicture'} }
    ]);
    conversation.latestMessage = savedMessage._id as mongoose.Types.ObjectId;
    conversation.messages.push(savedMessage._id as mongoose.Types.ObjectId);
    await conversation.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive-message', message);
      io.to(receiverSocketId).emit('message-notification', { message: message?.content,sender:req?.user?._id, receiver:{id:receiverId, name:receiverName, photo:receiverImage} });


    } else {
      console.warn(`Receiver socket ID not found for user: ${receiverId}`);
    }

   
    res.status(HttpStatusCodes.CREATED).json({
      message
    });

  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to send message.',
    });
  }
});



const getSingleMessage = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id: userToChat } = req.params;
  const senderId = req?.user?._id;

  // Find the conversation between the sender and receiver
  const conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, userToChat],
    },
  }).populate({
    path: 'messages', // Populate messages
    populate: [
      { path: 'sender', select: 'name email phone', populate:{path:'profilePicture'} }, // Populate sender details (name, email, etc.)
      { path: 'receiver', select: 'name email phone', populate:{path:'profilePicture'} }, // Populate receiver details (name, email, etc.)
    ],
  });

  // if (!conversation) {
  //   res.status(HttpStatusCodes.OK).json([]);
  // }

  const messages = conversation?.messages;

  res.json({ messages });
});

const getLastMessage = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id: userToChat } = req.params;
  const senderId = req?.user?._id;

  // Find the conversation between the sender and receiver
  const conversation = await Conversation.findOne({
    participants: {
      $all: [senderId, userToChat],
    },
  }).populate({
    path: 'latestMessage', // Populate messages
   
  });

  // if (!conversation) {
  //   res.status(HttpStatusCodes.OK).json([]);
  // }


  const latestMessage = conversation?.latestMessage;
  res.json({ latestMessage });
});


// Get all messages for a chat
const getMessagesByChat = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: chatId } = req.params;

  const messages = await Message.find({ chat: chatId, isDeleted: false })
    .populate('sender', 'name profilePicture')
    .populate('receiver', 'name profilePicture')
    .sort({ createdAt: 1 });

  if (!messages.length) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'No messages found.' });
    return;
  }

  res.status(HttpStatusCodes.OK).json(messages);
});

// Delete a single message (soft delete)
const deleteMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: messageId } = req.params;

  const message = await Message.findByIdAndDelete(messageId)
  if (!message) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Message not found.' });
    return;
  }

  message.isDeleted = true;
 
  res.status(HttpStatusCodes.OK).json({ message: 'Message deleted successfully.' });
});

// Delete multiple messages
const deleteMultipleMessages = expressAsyncHandler(async (req: Request, res: Response) => {
  const { messageIds } = req.body;

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid or empty message ID list.' });
    return;
  }

  const result = await Message.updateMany(
    { _id: { $in: messageIds }, isDeleted: false },
    { isDeleted: true }
  );

  res.status(HttpStatusCodes.OK).json({
    message: 'Messages deleted successfully.',
    count: result.modifiedCount,
  });
});

// Toggle the like state of a message
const toggleLikeMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Message not found.' });
    return;
  }

  message.isLiked = !message.isLiked;
  await message.save();

  res.status(HttpStatusCodes.OK).json({ message: 'Message like state updated.', data: message });
});

// Toggle the pin state of a message
const togglePinMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: messageId } = req.params;

  const message = await Message.findById(messageId);
  if (!message) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Message not found.' });
    return;
  }

  message.isPinned = !message.isPinned;
  await message.save();

  res.status(HttpStatusCodes.OK).json({ message: 'Message pin state updated.', data: message });
});

// Mark all messages in a chat as read
const markMessagesAsRead = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: chatId } = req.params;
  const userId = req?.user?._id;

  const result = await Message.updateMany(
    { chat: chatId, readBy: { $ne: userId }, isDeleted: false },
    { $addToSet: { readBy: userId }, status: 'read' }
  );

  res.status(HttpStatusCodes.OK).json({ message: 'Messages marked as read.', count: result.modifiedCount });
});

// Search messages in a chat
const searchMessages = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: chatId } = req.params;
  const { keyword } = req.query;

  if (!keyword) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Search keyword is required.' });
    return;
  }

  const messages = await Message.find({
    chat: chatId,
    content: { $regex: keyword, $options: 'i' },
    isDeleted: false,
  }).limit(50);

  if (!messages.length) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'No messages found.' });
    return;
  }

  res.status(HttpStatusCodes.OK).json(messages);
});

export {
  sendGroupMessage,
  sendSingleMessage,
  getMessagesByChat,
  deleteMessage,
  deleteMultipleMessages,
  toggleLikeMessage,
  togglePinMessage,
  markMessagesAsRead,
  getSingleMessage,
  getLastMessage,
  searchMessages,
};




