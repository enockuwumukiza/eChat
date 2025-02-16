import { Send, AttachFile, Mood, Mic, AddCircle,Image,
  Audiotrack,
  Videocam, } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React, { useState, memo, useMemo, useEffect, useRef, FormEvent } from 'react';
import EmojiPicker from 'emoji-picker-react'
import { debounce } from 'lodash';
import { useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../store/store';
import { useSendSingleMessageMutation, useSendGroupMessageMutation} from '../store/slices/messagesApiSlice';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';

import TypingIndicator from '../utils/TypingIndicator';

import { renderPreview, generateTempMessage, generateTempFileMessage, updateMediaMessagesUI } from '../utils/FileUpload';
import VoiceRecorder from './VoiceRecorder'
import VideoRecorder from './VideoRecorder';
import messageNotification from '../../public/sounds/message-notification.mp3'

type FilePreview = {
  file: File;
  preview: string; 
};

const MessageInput = ({  setDisplayMessages,setDisplayGroupMessages }:{ setDisplayMessages:any, setDisplayGroupMessages:any}) => {

  const { authUser } = useAuth();
  const { socket } = useSocket();
 

  const [messageInput, setMessageInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);
  const [shoudlVideoShow, setShouldVideoShow] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);



  
  const [typingData, setTypingData] = useState<any>(null);
  const [typingGroupData, setTypingGroupData] = useState<any>(null);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [showFileUpload,setShowFileUpload] = useState<boolean>(false)

  // files

  const [normalFile, setNormalFile] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
 

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // refferences
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLDivElement | null>(null);
  const msgNotificationRef = useRef<HTMLAudioElement | null>(null);
  

  const receiverInfo: any = useSelector((state: RootState) => state.message.receiverInfo);
  const isSingleChat = useSelector((state: RootState) => state.display.isSingleChat);
  const isGroupChat = useSelector((state: RootState) => state.display.isGroupChat);
  const groupId = useSelector((state: RootState) => state.group.groupId);

  


  const typerName = useMemo(() => typingData?.authName?.split(' ')[0]?.toUpperCase(), [typingData]);
  const typerGroupName = useMemo(() => typingGroupData?.authName?.split(' ')[0]?.toUpperCase(), [typingGroupData]);


  const [sendSingleMessage, {isLoading, isSuccess}] = useSendSingleMessageMutation();
  const [sendGroupMessage, { isLoading: isGroupLoading,isSuccess:isGroupSuccess }] = useSendGroupMessageMutation();




  useEffect(() => {
    const handleShowEmojiPicker = (e: any) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }

    document.addEventListener('mousedown', handleShowEmojiPicker);

    return () => {
      document.removeEventListener('mousedown', handleShowEmojiPicker);
    }
  }, []);

  useEffect(() => {
    const handleShowFileUpload = (e: any) => {
      if (fileInputRef.current && !fileInputRef.current.contains(e.target)) {
        setShowFileUpload(false);
      }
    }

    document.addEventListener('mousedown', handleShowFileUpload);

    return () => {
      document.removeEventListener('mousedown', handleShowFileUpload);
    }
  },[]);

  useEffect(() => {
    socket.on('displaySingleTyping', (data:any) => {
      setTypingData(() => data);
      
    });


    socket.on('displayGroupTyping', (data:any) => {
        console.log('Group typing event received:', data);
      setTypingGroupData(() => data);
      console.log(`This is group typing data: ${JSON.stringify(typingGroupData)}`);
      console.log(`group typing data: ${JSON.stringify(data)}`);
      
    });

    socket.on('removeSingleTyping', () => {
      setTypingData(null);
    });

    socket.on('removeGroupTyping', () => {
       console.log('Group typing stopped');
      setTypingGroupData(null);
    });


    return () => {
      socket.off('displaySingleTyping');
      socket.off('removeSingleTyping');
      socket.off('displayGroupTyping');
      socket.off('removeGroupTyping');
    };
  }, [socket]);


  const typingHandler = debounce(() => {
    if (messageInput.trim()) {
      if (isSingleChat && receiverInfo?._id) {
        socket.emit('single-typing', { authName: authUser?.user?.name, receiverId: receiverInfo._id });
      } else if (isGroupChat && groupId) {
        socket.emit('group-typing', { authName: authUser?.user?.name, groupId, authId:authUser?.user?._id });
      }
    }
  }, 500);




  const onEmojiClick = (emojiObject:any) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  }

  const resetStates = () => {
     setMessageInput('');
      setSelectedFiles([]);
      setIsRecording(false);
      setShouldPlay(false);
      setAudio(null);
      setVideo(null);
      setNormalFile(null);
  }
  
  const handleFileClick = (fileId:any) => {
    // Access the input element using the name passed to register
    const fileInput = document.getElementById(`${fileId}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  
  };



   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      // Validate file size (5MB max)
      if (selectedFile.size <= 5 * 1024 * 1024) {
        switch (type) {
          case 'normalFile':
            setNormalFile(selectedFile);
            break;
          case 'audio':
            setAudio(selectedFile);
            break;
          case 'video':
            setVideo(selectedFile);
            break;
          case 'photo':
            setPhoto(selectedFile);
            break;
          default:
            break;
        }
        
        const file = selectedFile;
         const filePreview:FilePreview = {
            file,
            preview: URL.createObjectURL(file),
          };
        setSelectedFiles((prevFiles) => [...prevFiles, filePreview]);

        console.log(`Selected file: ${JSON.stringify(selectedFile)} file type: ${type}`);
        
      } else {
        toast.error('File size should be less than 5MB');
      }
     }
     
    
  };



  const handleSendMessage = async () => {

    let tempFileMessage:any;
    let tempMessage:any;

    const formData = new FormData();
    if (messageInput.trim() !== '') {
      tempMessage = generateTempMessage(messageInput.trim(), authUser, receiverInfo);
      resetStates();
      formData.append('content', messageInput.trim());
      
    }
    
    if (normalFile) {
      tempFileMessage = generateTempFileMessage(authUser, receiverInfo, normalFile);
      resetStates();
      formData.append('normalFile', normalFile);
    }
    if (audio) {
      tempFileMessage = generateTempFileMessage(authUser, receiverInfo, audio);
      resetStates();
      formData.append('audio', audio);
    }
    if (video) {
      tempFileMessage = generateTempFileMessage(authUser, receiverInfo, video);
      resetStates();
      formData.append('video', video);
      
    }
    if (photo) {
      tempFileMessage = generateTempFileMessage(authUser, receiverInfo, photo);
      resetStates();
      formData.append('photo', photo);
      

      
    };

    
    try {

      
      if (tempMessage) {
        setDisplayMessages((prev: any) => [...prev, tempMessage]);
      } else if(tempFileMessage) {
         updateMediaMessagesUI(setDisplayMessages, tempFileMessage);
      }
      
      const response = await sendSingleMessage({ receiverId: receiverInfo?._id, data: formData }).unwrap();
      // setDisplayMessages((prev: any) => [...prev, response?.message]);

      if (tempMessage) {
        setDisplayMessages((prev: any) =>
      prev.map((msg: any) => (msg._id === tempMessage._id ? response.message : msg))
        );
        
      } else if (tempFileMessage) {
         updateMediaMessagesUI(setDisplayMessages, tempFileMessage, response.message);
      }
      
      
      socket.emit('stop-single-typing', { receiverId: receiverInfo?._id });
      resetStates();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Error sending message');
    }
  };

 

  // const handleSendGroupMessage = async () => {

  //   const formData = new FormData();
  //   if (messageInput.trim() !== '') {
  //     formData.append('content', messageInput.trim());
  //   }
  //     if (normalFile) formData.append('normalFile', normalFile);
  //     if (audio) formData.append('audio', audio);
  //     if (video) formData.append('video', video);
  //   if (photo) {
  //     formData.append('photo', photo);
      
  //   };

  //   try {
  //     if (formData) {
  //       const response = await sendGroupMessage({ groupId, data: formData }).unwrap();
        
  //       setDisplayGroupMessages((prev:any) => {
  //         const newMessages = [response.message].filter(
  //           (msg) => !prev.some((existing:any) => existing._id === msg._id)
  //         );
  //         return [...prev, ...newMessages];
  //       });


  //       setMessageInput('');
  //       setSelectedFiles([]);
  //       setAudio(null);
  //       setVideo(null);
  //       setNormalFile(null);
      
  //       socket.emit('stop-group-typing', { groupId });
  //       toast.success('Message sent');
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || error?.message || 'Error sending message');
  //   }
  // };


  const handleSendGroupMessage = async () => {

    let tempFileMessage: any;
    let tempMessage: any;

    const formData = new FormData();
    if (messageInput.trim() !== '') {
      tempMessage = generateTempMessage(messageInput.trim(), authUser, groupId);
      resetStates();
      formData.append('content', messageInput.trim());
    }

    if (normalFile) {
      tempFileMessage = generateTempFileMessage(authUser, groupId, normalFile);
      resetStates();
      formData.append('normalFile', normalFile);
    }
    if (audio) {
      tempFileMessage = generateTempFileMessage(authUser, groupId, audio);
      resetStates();
      formData.append('audio', audio);
    }
    if (video) {
      tempFileMessage = generateTempFileMessage(authUser, groupId, video);
      resetStates();
      formData.append('video', video);
    }
    if (photo) {
      tempFileMessage = generateTempFileMessage(authUser, groupId, photo);
      resetStates();
      formData.append('photo', photo);
    }

    try {
      // Add temp messages to UI before sending to server
      if (tempMessage) {
        setDisplayGroupMessages((prev: any) => [...prev, tempMessage]);
      } else if (tempFileMessage) {
        updateMediaMessagesUI(setDisplayGroupMessages, tempFileMessage);
      }

      const response = await sendGroupMessage({ groupId, data: formData }).unwrap();

      // Remove the temporary message after receiving the server response
      setDisplayGroupMessages((prev: any) => {
        const updatedMessages = prev.filter((msg: any) => msg._id !== tempMessage?._id && msg._id !== tempFileMessage?._id);
        const newMessages = [response.message].filter(
          (msg) => !updatedMessages.some((existing: any) => existing._id === msg._id)
        );
        return [...updatedMessages, ...newMessages];
      });

      resetStates();

      socket.emit('stop-group-typing', { groupId });

    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Error sending message');
    }
  };


  const stopTyping = () => {
    if (isSingleChat) {
      socket.emit('stop-single-typing', { receiverId: receiverInfo?._id });
    } else if (isGroupChat) {
      socket.emit('stop-group-typing', { groupId });
    }
    
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles?.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
 
    if (isGroupChat) {
      await handleSendGroupMessage();
    } else if(isSingleChat){
      await handleSendMessage();
    }
    if (msgNotificationRef?.current && (isSuccess || isGroupSuccess)) {
      msgNotificationRef.current.src = messageNotification;
      msgNotificationRef.current.play();
    }
  };
  

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (messageInput.trim() !== "") {
        
        try {
        if (isGroupChat) {
          await handleSendGroupMessage();
        } else if (isSingleChat) {
          await handleSendMessage();
        }

        if (msgNotificationRef.current) {
          msgNotificationRef.current.src = messageNotification;
          msgNotificationRef.current.play();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        }
        
      }
    }
  };

  

  return (
    <div className={`fixed bottom-0 right-0 flex items-center justify-between md:justify-around lg:justify-around w-[100%] md:w-[100%] lg:w-[41.6%] bg-gradient-to-r from-purple-900 via-green-950 to-teal-950 py-3`}>
    {isSingleChat && typingData ? (
      <div className="relative">
        <TypingIndicator name={typerName} />
      </div>
    ) : isGroupChat && typingGroupData ? (
      <div className="relative">
        <TypingIndicator name={typerGroupName} />
      </div>
    ) : null}

  {showEmoji && (
    <div
      ref={pickerRef}
      className="absolute bottom-24 left-2"
    >
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  )}

  <Tooltip title="Emoji" placement="top">
    <IconButton className='w-10 text-5xl' onClick={() => setShowEmoji(!showEmoji)}>
          <Mood htmlColor="white"
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

      <form onSubmit={handleSubmit} className="flex items-center gap-1 md:gap-5 lg:gap-2 px-0">
       
      <Tooltip
      title="Upload"
      placement="top"
        >
          
      <IconButton onClick={() => setShowFileUpload(!showFileUpload)}>
            <AddCircle htmlColor="white"
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

    <textarea
      value={messageInput}
      onChange={(e) => {
        setMessageInput(e.target.value);
        typingHandler();
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(stopTyping, 2000);
          }}
          
          onKeyDown={handleKeyDown}
          
          className="input md:h-[70px] lg:h-[50px] input-bordered w-[100%] md:w-[100%] lg:w-[60%] font-bold lg:p-2 text-[16px] md:text-[35px] lg:text-[17px] text-center pt-3 md:pt-4 lg:pt-2"
          placeholder="Type a message"
    />

    <Tooltip
      title={messageInput || selectedFiles?.length ? 'Send' : 'Voice note'}
      placement="top"
    >
      {messageInput?.trim() || audio || video || selectedFiles?.length > 0 && !isLoading ? (
         <IconButton type='submit' disabled={isLoading} > 
          <Send htmlColor="white"
            
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
      ) : (
              <IconButton className="p-0" onClick={() => {
                // setIsRecording(!isRecording);
                setShouldPlay(!shouldPlay);
                
               }}>
                <Mic htmlColor={isRecording ? "red" : "white"}
                  
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
      )}
        </Tooltip>

        {
        !messageInput && (
            <Tooltip
          title="Record video"
          placement="top"
            >
              
          <IconButton className="right-2 md:right-4 lg:right-6" disabled={shoudlVideoShow}  onClick={() => setShouldVideoShow(!shoudlVideoShow)}>
                <Videocam htmlColor={shoudlVideoShow ? "red" : "white"}
                  
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
          )
        }

        {
          showFileUpload && (
            <div ref={fileInputRef} className="absolute bottom-32 left-5 bg-slate-950 rounded-3xl flex flex-col items-center space-y-6 p-6">
              {/* Document Upload */}
              <div className="flex items-center space-x-2 text-slate-100 hover:text-sky-900 transition ease-out hover:translate-y-1 hover:scale-105 hover:opacity-90 duration-300 delay-100">
                <Tooltip title="Attach Document" placement="top">
                  <IconButton
                    onClick={() => handleFileClick('normalFile')}
                    className="bg-white hover:bg-gray-200 rounded-lg shadow-lg transition-all p-3"
                  >
                    <AttachFile fontSize="large" htmlColor="gray" />
                  </IconButton>
                </Tooltip>
                <span className="mt-2 text-gray-700 text-sm font-medium">Attach Document</span>
                <input
                  type="file"
                    id='normalFile'
                    onChange={(e) => handleFileChange(e, 'normalFile')}
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  className="hidden"
                />
              </div>
        
              {/* Image Upload */}
              <div className="flex items-center space-x-2 text-slate-100 hover:text-sky-900 transition ease-out hover:translate-y-1 hover:scale-105 hover:opacity-90 duration-300 delay-100">
                <Tooltip title="Upload Image" placement="top">
                  <IconButton
                    onClick={() => handleFileClick('photo')}
                    className="bg-white hover:bg-blue-200 rounded-lg shadow-lg transition-all p-3"
                  >
                    <Image fontSize="large" htmlColor="blue" />
                  </IconButton>
                </Tooltip>
                <span className="mt-2 text-blue-600 text-sm font-medium">Upload Image</span>
                <input
                  type="file"
                    id='photo'
                    onChange={(e) => handleFileChange(e, 'photo')}  
                  accept="image/*"
                  className="hidden"
                />
              </div>
        
              {/* Audio Upload */}
              <div className="flex items-center space-x-2 text-slate-100 hover:text-sky-900 transition ease-out hover:translate-y-1 hover:scale-105 hover:opacity-90 duration-300 delay-100">
                <Tooltip title="Upload Audio" placement="top">
                  <IconButton
                    onClick={() => {
                      handleFileClick('audio') 
                      
                    }
                      
                    }
                    className="bg-white hover:bg-green-200 rounded-lg shadow-lg transition-all p-3"
                  >
                    <Audiotrack fontSize="large" htmlColor="green" />
                  </IconButton>
                </Tooltip>
                <span className="mt-2 text-green-600 text-sm font-medium">Upload Audio</span>
                <input
                  type="file"
                    id='audio'
                    onChange={(e) => handleFileChange(e, 'audio')}    
                  accept="audio/*"
                  className="hidden"
                />
              </div>
        
              {/* Video Upload */}
              <div className="flex items-center space-x-2 text-slate-100 hover:text-sky-900 transition ease-out hover:translate-y-1 hover:scale-105 hover:opacity-90 duration-300 delay-100">
                <Tooltip title="Upload Video" placement="top">
                  <IconButton
                    onClick={() => handleFileClick('video')}
                    className="bg-white hover:bg-red-200 rounded-lg shadow-lg transition-all p-3"
                  >
                    <Videocam fontSize="large" htmlColor="red" />
                  </IconButton>
                </Tooltip>
                <span className="mt-2 text-red-600 text-sm font-medium">Upload Video</span>
                <input
                  type="file"
                    id='video'
                   onChange={(e) => handleFileChange(e, 'video')}    
                  accept="video/*"
                  className="hidden"
                />
              </div>
            </div>
        
          )
        }
        {/* file picker */}
        {
          selectedFiles?.length > 0 && !isLoading && (
            <div className='absolute w-[20%] -top-[600%] -left-30'>
          
           <div className="file-uploader py-10 bg-gray-50 rounded-lg shadow-md max-w-lg mx-auto" style={{
                minWidth: '30vw',
             
                
                
              }}>
               
                <div className="previews mt-4 flex flex-wrap gap-4">
                  {selectedFiles.map((item, index) => renderPreview(item, index, removeFile))}
                </div>
              </div>

        </div>
          )
        }
        {shouldPlay &&
          <VoiceRecorder setAudio={setAudio} isRecording={isRecording} setIsRecording={setIsRecording} audioUrl={audioUrl} setAudioUrl={setAudioUrl} setShouldPlay={setShouldPlay} shouldPlay={shouldPlay} />
        }

        {
          shoudlVideoShow && <VideoRecorder setVideo={ setVideo } setShouldVideoShow={setShouldVideoShow} />
        }
        <audio className='hidden' ref={msgNotificationRef}/>
      </form>        
</div>

  );
};

export default memo(MessageInput);


