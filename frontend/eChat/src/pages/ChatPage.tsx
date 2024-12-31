import React, { useEffect, memo, useRef, useState } from 'react';
import axios from 'axios'
import { Videocam, Search, MoreVertOutlined, Call,Download } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { RootState } from '../store/store';
import MessageInput from '../components/MessageInput';
import { useLazyGetGroupMembersQuery } from '../store/slices/groupApiSlice';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { setNotifications } from '../store/slices/notificationSlice';
import {  setIsGroupOptionsShown, setIsUserInfoShown } from '../store/slices/displaySlice';
import NoChatSelected from '../utils/NoChatSelected';
import  generateAnchorTag  from '../utils/anchorTagGenerator';
import { setOnlineUsers } from '../store/slices/socketSlice';
import { handleDownload } from '../utils/donwloadFiles';
import FileLink from '../utils/donwloadFiles';
import { formatTime } from '../utils/formatTime';
import { renameFile } from '../utils/donwloadFiles';

const ChatPage: React.FC = () => {

  
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { authUser } = useAuth();
  const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
  const groupId = useSelector((state: RootState) => state.group.groupId);
  const receiverInfo:any = useSelector((state: RootState) => state.message.receiverInfo);
 
  const groupsData: any = useSelector((state: RootState) => state.group.groupData);

  
  const isUserInfoShown = useSelector((state: RootState) => state.display.isUserInfoShown);
  const isGroupOptionsShown = useSelector((state: RootState) => state.display.isGroupOptionsShown);

  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);


  const isReceiverOnline = onlineUsers?.includes(receiverInfo?._id);

  const [displayMessages, setDisplayMessages] = useState<any[]>([]);
  const [displayGroupMessages, setDisplayGroupMessages] = useState<any[]>([]);

  
  const messageRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the latest message
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages, displayGroupMessages]);
  
  useEffect(() => {
    if (authUser) {
      socket.connect();

      socket.on('receive-message', (data) => {
        if (data.chatType === 'Conversation') {
          setDisplayMessages((prev) => [...prev, data])
         
        }
      });
      socket.on('member-joined', (data: any) => {
        console.log(`From group socket: ${data}`);
      });

      socket.on('group-message', (data) => {
        if (data?.chatType === 'Group') {
          setDisplayGroupMessages((prev:any) => {
          const newMessages = [data].filter(
            (msg) => !prev.some((existing:any) => existing._id === msg._id)
          );

          return [...prev, ...newMessages];
        });
        } 
        });
      
      socket.on('getOnlineUsers', (data: any) => {
        dispatch(setOnlineUsers(data));
       
      })
      socket.on('message-notification', (data: any) => {
        dispatch(setNotifications(data));
      });
      socket.on('group-added', (data: any) => {
        console.log(`Member added to group: ${JSON.stringify(data)} `)
      });
      socket.on('member-left', (data: any) => {
        console.log(`Member left the group: ${JSON.stringify(data)}`);
      })
      

      return () => {
        socket.off('receive-message');
        socket.off('group-message');
        socket.off('getOnlineUsers');
        socket.off('message-notification');
        socket.off('member-joined');
        socket.disconnect();
      };
    }
  }, [socket]);

  // Fetch messages

  useEffect(() => {
    (
      async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/messages/single/${receiverInfo?._id}`, {
            withCredentials: true,
            headers: {
            
            }
          });

           if (response?.data?.messages) {
             setDisplayMessages(response.data.messages);
           } else {
             setDisplayMessages([]);
          }
        } catch (error: any) {
          console.error(`Error feching with axios: ${error}`)
          
        }
      }
    )();

  }, [receiverInfo?._id]);
  
  useEffect(() => {
    (
      async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/groups/messages/${groupId}`, {
            withCredentials: true,
            headers: {
            
            }
          });

           if (response?.data?.messages) {
             setDisplayGroupMessages(response?.data?.messages);
           } else {
             setDisplayGroupMessages([]);
          }

        } catch (error: any) {
          console.error(`Error feching group data with axios: ${error}`)
        }
      }
    )();

  },[groupId]);

  
  const [triggerGetGroupMembers, { data: members }] = useLazyGetGroupMembersQuery();

  useEffect(() => {
      if (groupId) {
        triggerGetGroupMembers(groupId);
      }
  }, [triggerGetGroupMembers, groupId]);
  

  const messagesToDisplay = (isGroupChat && groupId) ? displayGroupMessages : (isSingleChat && receiverInfo?._id) ? displayMessages : [];

  return (
    <div>
      {
        (isSingleChat && receiverInfo) || (isGroupChat && groupId) ? (
          <div className="fixed flex flex-col right-0 w-[41.6%] h-full bg-base-100 shadow-lg">
            {/* Header */}
            
            <div className="sticky top-0 bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-4 flex justify-between items-center shadow-md">
              <h6 className='absolute  text-sky-300 top-14 right-[80%]'>{isSingleChat &&( isReceiverOnline ? "online":  "offline" )}</h6>
        <div className="flex items-center gap-4">
          <img
            className="w-12 h-12 rounded-full"
            src={receiverInfo?.profilePicture || '/default-avatar.png'}
            alt="Chat Avatar"
          />
          <div>
            {isGroupChat && !isSingleChat ? (
              <div className="flex flex-wrap gap-2 text-sm text-white">
                {members?.groupMembers?.members?.map((member: any, index: any) => (
                  <span key={index} className="bg-teal-800 rounded-md px-2 py-1">
                    {member?.userId?.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            ) : (
              <h1 className="text-xl font-bold text-white">
                {receiverInfo?.name.split(' ')[0]}
              </h1>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Tooltip title="Video Call" placement="top">
            <IconButton className="hover:bg-teal-800">
              <Videocam fontSize="medium" htmlColor="white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voice Call" placement="top">
            <IconButton className="hover:bg-teal-800">
              <Call fontSize="medium" htmlColor="white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search" placement="top">
            <IconButton className="hover:bg-teal-800">
              <Search fontSize="medium" htmlColor="white" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options" placement="top">
            <IconButton
              onClick={() => {
                (isGroupChat && !isSingleChat && groupsData?.groups) ? dispatch(setIsGroupOptionsShown(!isGroupOptionsShown)) : receiverInfo && dispatch(setIsUserInfoShown(!isUserInfoShown)); 
                
              }}
              className="hover:bg-teal-800">
              <MoreVertOutlined fontSize="medium" htmlColor="white" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Chat Body */}
      <div className="p-4 bg-gray-900 h-[70%] overflow-y-auto space-y-4">
        {(messagesToDisplay?.length > 0 ? (
                messagesToDisplay?.map((msg: any) => (
            
            <div key={msg?._id} className={`chat ${msg?.sender?._id === authUser?.user?._id || msg?.sender === authUser?.user?._id ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="w-12 rounded-full">
                  <img
                    alt="User Avatar"
                    src={msg?.sender?.profilePicture || "https://media.istockphoto.com/id/1750451240/photo/sleeping-girl-sitting-on-the-bed-in-the-room.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hc3ERVBXnML49koFzJn1McA-lLHbfS97jsxSPKhsDpo="}
                  />
                </div>
              </div>
              <div className="chat-header text-white">
                {msg?.sender?.name === authUser?.user?.name ? "You" : msg?.sender?.name}
                <span className="text-xs font-bold ml-2">
                  {formatTime(msg?.createdAt)}
                </span>
              </div>
              <div className={`chat-bubble bg-${msg?.sender?._id === authUser?.user?._id || msg?.sender === authUser?.user?._id ? "teal-800" : "gray-950"} text-white shadow-md`}>
                {msg?.messageType === 'text' ? generateAnchorTag(msg?.content) : msg?.messageType === 'image' ?
                  <img src={msg?.fileUrl?.url} />
                 : msg?.messageType === 'audio' ? 
                          <><audio src={msg?.fileUrl?.url} controls />
                          <span className='text-sm italic text-blue-600'>{msg?.fileUrl?.name}</span></>
                  : msg?.messageType === 'video' ? 
                            <><video src={msg?.fileUrl?.url} controls style={{ maxHeight: '200px' }} /> <span className='text-sm mx-w-[20px] italic text-blue-600'>{renameFile(msg?.fileUrl?.name) }</span></>
                            : <FileLink fileUrl={{ url: msg?.fileUrl?.url }} fileName={msg?.fileUrl?.name} />
                      }
                {
                  msg?.messageType !== 'text' && (
                    <IconButton
                     onClick={() => handleDownload(msg?.fileUrl?.url, msg?.fileUrl?.name)}
                      color="primary"
                    
                      size="small"
                    >
                      <Download />
                    </IconButton>
                  )
                }
              </div>
              <div className="chat-footer text-gray-400 text-xs">
                {msg?.status === "sent" ? "Delivered" : "Pending"}
              </div>
              <div ref={messageRef} />
              
                  </div>
                  
            

          ))
        ) : (
          <p>No messages with <span className="text-teal-500">{receiverInfo?.name}</span> available </p>
              ))
              }
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-800">
        <MessageInput  setDisplayMessages={ setDisplayMessages} setDisplayGroupMessages={setDisplayGroupMessages} />
      </div>
    </div>
        ):<NoChatSelected/>
      }
    </div>
  );
};

export default memo(ChatPage);
