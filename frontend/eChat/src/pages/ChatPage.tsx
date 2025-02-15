import React, { useEffect, memo, useRef, useState } from 'react';
import axios from 'axios'
import { Videocam, Search, MoreVertOutlined, Call,Download,DoneAllOutlined,Group, Favorite,ArrowBack } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { RootState } from '../store/store';
import MessageInput from '../components/MessageInput';
import { useLazyGetGroupMembersQuery } from '../store/slices/groupApiSlice';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import {  setIsGroupOptionsShown, setIsUserInfoShown,setIsChatPageShown } from '../store/slices/displaySlice';
import NoChatSelected from '../utils/NoChatSelected';
import  generateAnchorTag  from '../utils/anchorTagGenerator';
import { setOnlineUsers } from '../store/slices/socketSlice';
import { handleDownload } from '../utils/donwloadFiles';
import FileLink from '../utils/donwloadFiles';
import { formatTime } from '../utils/formatTime';
import { renameFile } from '../utils/donwloadFiles';
import { setIsAudioCallEnabled, setIsVideoCallEnabled } from '../store/slices/displaySlice';
import incomingMsgNotification from '../../public/sounds/incoming-msg-notification.mp3'
import SimpleHeader from '../components/SimpleHeader';
import MessageCard from '../utils/MessageCard';
import PinnedMessage from '../utils/PinnedMessage';
import MessageSkeleton from '../utils/MessageSkeleton';
import { setGroupMembers } from '../store/slices/groupSlice';

const ChatPage: React.FC = () => {

  
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { authUser } = useAuth();
  const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
  const groupId = useSelector((state: RootState) => state.group.groupId);
  const receiverInfo:any = useSelector((state: RootState) => state.message.receiverInfo);
 
  const groupsData: any = useSelector((state: RootState) => state.group.groupData);
  const currentWindowWidth = useSelector((state: RootState) => state.display.currentWindowWidth);
  const isChatPageShown = useSelector((state: RootState) => state.display.isChatPageShown);


  
  const isUserInfoShown = useSelector((state: RootState) => state.display.isUserInfoShown);
  const isGroupOptionsShown = useSelector((state: RootState) => state.display.isGroupOptionsShown);
  const isAudioCallEnabled = useSelector((state: RootState) => state.display.isAudioCallEnabled);
  const isVideoCallEnabled = useSelector((state: RootState) => state.display.isVideoCallEnabled);

  const onlineUsers = useSelector((state: RootState) => state.socket.onlineUsers);


  const isReceiverOnline = onlineUsers?.includes(receiverInfo?._id);

  const [displayMessages, setDisplayMessages] = useState<any[]>([]);
  const [displayGroupMessages, setDisplayGroupMessages] = useState<any[]>([]);

  

  const [isMessageHoveredId, setIsMessageHoveredId] = useState<string | null>(null);

  const [mesesageLoading, setMessageLoading] = useState<boolean>(false);

  
  const messageRef = useRef<HTMLDivElement | null>(null);
  const incomingMsgNotificationRef = useRef<HTMLAudioElement | null>(null);
  



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
        if (incomingMsgNotificationRef.current) {
          incomingMsgNotificationRef.current.src = incomingMsgNotification;
          incomingMsgNotificationRef.current.play();
        }
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
          if (receiverInfo?._id) {
            setDisplayMessages([]);
            setMessageLoading(true);
            const response = await axios.get(`https://echat-fieq.onrender.com/api/messages/single/${receiverInfo?._id}`, {
            withCredentials: true,
            headers: {
            
            }
          });

           if (response?.data?.messages) {
             setDisplayMessages(response.data.messages);
             setMessageLoading(false);
           } else {
             setDisplayMessages([]);
             setMessageLoading(false);
            }
            
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
          
          if (groupId) {
            setDisplayGroupMessages([]);
            setMessageLoading(true);
            const response = await axios.get(`https://echat-fieq.onrender.com/api/groups/messages/${groupId}`, {
            withCredentials: true,
            headers: {
            
            }
          });

           if (response?.data?.messages) {
             setDisplayGroupMessages(response?.data?.messages);
             setMessageLoading(false);
           } else {
             setDisplayGroupMessages([]);
             setMessageLoading(false);
            }
            
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
        dispatch(setGroupMembers(members));
      }
  }, [triggerGetGroupMembers, groupId]);
  

  const messagesToDisplay = (isGroupChat && groupId) ? displayGroupMessages : (isSingleChat && receiverInfo?._id) ? displayMessages : [];




  const NotChatShouldShow = () => {
    return Number(currentWindowWidth) > 1280 ? <NoChatSelected /> : <>
      <SimpleHeader/>
    </>
  }

  return (
    <div className={ isChatPageShown ? "":"hidden" }>
      <div className={`${Number(currentWindowWidth) > 1280 ? "" : '-left-[4%] '}`} >
      {
        (isSingleChat && receiverInfo) || (isGroupChat && groupId) ? (
          <div className={`fixed ${Number(currentWindowWidth) > 1280 ? "h-full":'h-[120%] -left-4 px-3 md:left-0 md:px-0'}  flex-col right-0 w-[108%] md:w-[100%] lg:w-[41.6%] bg-base-100 shadow-lg cursor-pointer `}>
            {/* Header */}
             
              <div className={`sticky top-0 bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 p-10 md:p-8 lg:p-4 flex justify-between items-center shadow-md`}>
              <h6 className='absolute  text-sky-300 top-[57%] md:top-[60%] lg:top-14 right-[58%] md:right-[68%] lg:right-[78%] text-[20px] md:text-[33px] lg:text-[16px] '>{isSingleChat &&( isReceiverOnline ? "online":  "offline" )}</h6>
                <div className="flex justify-start -ml-10 md:-ml-0">
              
             {
                isChatPageShown && Number(currentWindowWidth) < 1280 && <Tooltip title="Go Back">
                  <IconButton className='' onClick={() => dispatch(setIsChatPageShown(false))}>
                        <ArrowBack htmlColor='white'
                        
                          sx={{
                          fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                            },
                            marginTop:"-10px"
                          }}
                        
                          
                        />
                  </IconButton>
                </Tooltip>
            }
          
          {
                  isSingleChat && receiverInfo ? <img
            className="w-12 h-12 rounded-full mr-3 md:mr-4 lg:mr-0"
            src={ receiverInfo?.profilePicture || '/default-avatar.png'}
            alt="Chat Avatar"
                    /> : isGroupChat && groupId ? <Group htmlColor='white'
                        
                        sx={{
                          fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                          },
                          marginRight:"10px"
                        }}
                    /> : ""
          }
          <div>
            {isGroupChat && !isSingleChat ? (
              <div className="absolute flex gap-1 text-xs md:text-lg text-white items-center">
                {members?.groupMembers?.members?.slice(0, 3)?.map((member: any, index: any) => (
                  <span 
                    key={index} 
                    className="bg-teal-800 px-0 lg:px-2 py-1 rounded-md hover:bg-teal-700 transition-all duration-300"
                    title={member?.userId?.name} // Shows full name on hover
                  >
                    {member?.userId?.name.split(' ')[0]}
                  </span>
                ))}

                {members?.groupMembers?.members?.length > 3 && (
                  <span className="font-semibold text-sm bg-gray-700 px-2 py-1 rounded-md">
                    +{members?.groupMembers?.members?.length - 3}
                  </span>
                )}
              </div>

            ) : (
              <h1 className="text-[18px] md:text-[30px] lg:text-[20px] font-bold text-white mt-2 -ml-[10%]  md:ml-[2%] lg:ml-[20%] md:mb-2  lg:mt-3">
                {receiverInfo?.name.split(' ')[0].split('').length > 10 ? `${receiverInfo?.name.split(' ')[0].slice(0, 8)}...` : receiverInfo?.name.split(' ')[0]} 
              </h1>
            )}
          </div>
        </div>
        <div className={`flex justify-between absolute -right-[4%] md:right-[0%] lg:right-[0%] gap-1 md:gap-2 lg:gap-4`}>
                  {
                    isSingleChat && !isGroupChat &&

                    <Tooltip title="Video Call" placement="top">
                    <IconButton className={`hover:bg-teal-800`} onClick={() => dispatch(setIsVideoCallEnabled(!isVideoCallEnabled))}>
                      <Videocam htmlColor="white"
                        
                        sx={{
                          fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                          },
                        }}
                      />
            </IconButton>
          </Tooltip>
          }
                  {
                    isSingleChat && !isGroupChat &&
                      <Tooltip
                    title="Voice Call" placement="top">
                    <IconButton className={`hover:bg-teal-800`}   onClick={() => dispatch(setIsAudioCallEnabled(!isAudioCallEnabled))}>
                      <Call htmlColor="white"
                        
                        sx={{
                          fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                          },
                        }}
                      />
            </IconButton>
          </Tooltip>
                }
          <Tooltip title="Search" placement="top">
            <IconButton className="hover:bg-teal-800">
                      <Search htmlColor="white"
                      
                        sx={{
                          fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                          },
                        }}
                      />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options" placement="top">
            <IconButton
              onClick={() => {
                (isGroupChat && !isSingleChat && groupsData?.groups) ? dispatch(setIsGroupOptionsShown(!isGroupOptionsShown)) : receiverInfo && dispatch(setIsUserInfoShown(!isUserInfoShown)); 
                
              }}
              className="hover:bg-teal-800">
                      <MoreVertOutlined htmlColor="white"
              
                        sx={{
                          fontSize: {
                            xs: "30px",
                            sm: "40px",
                            md: "70px",
                            lg: "35px",
                          },
                        }}
                      />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Chat Body */}
              <div className="p-4 bg-gray-900 h-[70%] overflow-y-auto space-y-4 pb-[25%] md:pb-[14%] lg:pb-[7%]">
                {
                  mesesageLoading && <MessageSkeleton/>
                }
                {(messagesToDisplay?.length > 0 ? (
                  
                
                messagesToDisplay?.map((msg: any, index:any) => (
                  
                  <div key={index}>
                    
                      {
                          msg?.isPinned && <PinnedMessage 
                              message={{ text: msg?.content }} 
                              onUnpin={() => console.log("Message unpinned")} 
                              onDelete={() => console.log("Message deleted")} 
                            />

                        }
                    
                     <div key={msg?._id} className={`chat ${msg?.sender?._id === authUser?.user?._id || msg?.sender === authUser?.user?._id ? "chat-end" : "chat-start"}`}
                    
                    
                  
                  >
              <div className="chat-image avatar">
                <div className="w-12 md:w-20 lg:w-12 rounded-full">
                  <img
                    alt="User Avatar"
                    src={msg?.sender?.profilePicture || "https://media.istockphoto.com/id/1750451240/photo/sleeping-girl-sitting-on-the-bed-in-the-room.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hc3ERVBXnML49koFzJn1McA-lLHbfS97jsxSPKhsDpo="}
                  />
                </div>
              </div>
              <div className="chat-header text-white">
                      {msg?.sender?.name === authUser?.user?.name ? <span className="font-semibold italic text-sky-700">You</span> : <span className="font-semibold italic text-sky-700">{msg?.sender?.name.split(' ')[0]}</span>}
                <span className="text-xs font-bold ml-2">
                  {formatTime(msg?.createdAt)}
                </span>
              </div>
                    <div className={`chat-bubble bg-${msg?.sender?._id === authUser?.user?._id || msg?.sender === authUser?.user?._id ? "teal-800" : "gray-950"} text-white shadow-md text-xl md:text-3xl lg:text-xl`}
                      
                      onMouseEnter={() => setIsMessageHoveredId(msg?._id)}
                     onMouseLeave={() => setIsMessageHoveredId(null)}
                      >
                       
                        {
                          isMessageHoveredId && isMessageHoveredId === msg?._id && <MessageCard msg={msg} id={msg?._id} isGroupChat={isGroupChat} isSingleChat={isSingleChat} setDisplayMessages={setDisplayMessages} setDisplayGroupMessages={setDisplayGroupMessages}  />
                        }
                        {
                          msg?.isLiked && <Favorite  className="text-red-500 mr-2" />
                        }

                      
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
                {msg?.status === "sent" && msg?.sender?._id === authUser?.user?._id ? <DoneAllOutlined/> : ""}
                    </div>
                    <audio className='hidden' ref={incomingMsgNotificationRef}/>
              <div ref={messageRef}/>
              
                    </div>
                    
                    
                  </div>
                  
            

          ))
        ) : (
          isGroupChat && groupId ? <p className='text-slate-200'>No messages available </p>: isSingleChat && receiverInfo ? <p className='text-slate-200'>No messages with <span className="text-teal-500">{receiverInfo?.name}</span> available </p>:""
              ))
              }
      </div>

      {/* Message Input */}
      <div className="p-0 bg-gray-800">
        <MessageInput  setDisplayMessages={ setDisplayMessages} setDisplayGroupMessages={setDisplayGroupMessages} />
      </div>
    </div>
          ) : <NotChatShouldShow/>
          
      }
    </div>
    </div>
  );
};

export default memo(ChatPage);
