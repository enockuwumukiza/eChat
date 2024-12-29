import React, { useEffect, memo,useRef,useState } from 'react';
import { Videocam, Search, MoreVertOutlined, Call,Download } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { RootState } from '../store/store';
import MessageInput from '../components/MessageInput';
import { useLazyGetGroupMembersQuery, useLazyGetGroupMessagesQuery} from '../store/slices/groupApiSlice';
import { useLazyGetSingleMessageQuery } from '../store/slices/messagesApiSlice';
import { setMessages, setGroupMessages } from '../store/slices/messageSlice';
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




const ChatPage: React.FC = () => {

  
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { authUser } = useAuth();
  const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
  const groupId = useSelector((state: RootState) => state.group.groupId);
  const receiverInfo:any = useSelector((state: RootState) => state.message.receiverInfo);
  const currentMessages = useSelector((state: RootState) => state.message.messages);
  const currentGroupMessages = useSelector((state: RootState) => state.message.groupMessages);
 
  const groupsData: any = useSelector((state: RootState) => state.group.groupData);

  
  const isUserInfoShown = useSelector((state: RootState) => state.display.isUserInfoShown);
  const isGroupOptionsShown = useSelector((state: RootState) => state.display.isGroupOptionsShown);

  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);

  const isReceiverOnline = onlineUsers?.includes(receiverInfo?._id);

  const [displayMessages, setDisplayMessages] = useState<any[]>([]);
  

  const messageRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the latest message
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayMessages]);

  // WebSocket handling
  useEffect(() => {
    if (authUser) {
      socket.connect();

      socket.on('receive-message', (data) => {
        if (data.chatType === 'Conversation') {
          dispatch(setMessages([data]));
         
        }
      });
      socket.on('member-joined', (data: any) => {
        console.log(`From group socket: ${data}`);
      });

      socket?.on('group-message', (data) => {
          dispatch(setGroupMessages([data]));  
        });
      
      socket.on('getOnlineUsers', (data: any) => {
        dispatch(setOnlineUsers(data));
       
      })
      socket.on('message-notification', (data: any) => {
        console.log(`New message notification: ${JSON.stringify(data)}`)
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
  const [triggerGetSingleMessage,{data:singleMessages}] = useLazyGetSingleMessageQuery();
  const [triggerGetGroupMessages,{data:groupMessages}] = useLazyGetGroupMessagesQuery();

  

  const [triggerGetGroupMembers, { data: members }] = useLazyGetGroupMembersQuery();

  useEffect(() => {
      if (groupId) {
        triggerGetGroupMembers(groupId);
      }
  }, [triggerGetGroupMembers, groupId]);
  
  useEffect(() => {
    if (receiverInfo?._id && !isGroupChat) {
      triggerGetSingleMessage(receiverInfo?._id);
      if (singleMessages?.messages) {
          dispatch(setMessages(singleMessages?.messages));
        }
    }
  }, [triggerGetSingleMessage, receiverInfo,singleMessages, dispatch]);

  useEffect(() => {
    if (groupId && isGroupChat && !isSingleChat) {
      triggerGetGroupMessages(groupId);
      if (groupMessages?.messages) {
          dispatch(setGroupMessages(groupMessages?.messages));
        }
    }
  }, [triggerGetGroupMessages, groupId, dispatch, groupMessages]);

  useEffect(() => {
    setDisplayMessages((isGroupChat) ? currentGroupMessages : currentMessages);
  }, [currentGroupMessages, currentMessages, isSingleChat && receiverInfo, (isGroupChat && groupId)]);


  return (
    <div>
      {
        (isSingleChat && receiverInfo) || (isGroupChat && groupId) ? (
          <div className="fixed flex flex-col right-0 w-[41.6%] h-full bg-base-100 shadow-lg">
            {/* Header */}
            
            <div className="sticky top-0 bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-4 flex justify-between items-center shadow-md z-10">
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
        {displayMessages.length > 0 ? (
                displayMessages.map((msg: any) => (
            
            <div key={msg._id} className={`chat ${msg?.sender?._id === authUser?.user?._id || msg?.sender === authUser?.user?._id ? "chat-end" : "chat-start"}`}>
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
                    <audio  src={msg?.fileUrl?.url} controls/>
                  : msg?.messageType === 'video' ? 
                      <video src={msg?.fileUrl?.url} controls /> 
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
          <p>No messages available</p>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-800">
        <MessageInput />
      </div>
    </div>
        ):<NoChatSelected/>
      }
    </div>
  );
};

export default memo(ChatPage);
