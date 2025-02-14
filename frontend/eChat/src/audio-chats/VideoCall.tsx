import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket"; 
import { useAuth } from "../hooks/useAuth"; 
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  MdCall,
  MdCallEnd,
  MdCallReceived,
  MdClose,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVolumeOff,
  MdVolumeUp,
  MdVideocamOff,
} from "react-icons/md"

import { RootState } from "../store/store";
import { setIsVideoCallEnabled } from "../store/slices/displaySlice";

import ongoingVideoCallRingtone from '../../public/sounds/ongoing-call-ringtone.mp3'
import incomingVideoCallRingtone from '../../public/sounds/incoming-call-ringtone.mp3'
import { setReceiverInfo } from "../store/slices/messageSlice";


const VideoCall: React.FC = () => {

  const dispatch = useDispatch();

  const { socket } = useSocket();
  const { authUser } = useAuth();
  const receiverInfo: any = useSelector((state: RootState) => state.message.receiverInfo);
  const isVideoCallEnabled: any = useSelector((state: RootState) => state.display.isVideoCallEnabled);

  const availableUsers: any = useSelector((state: RootState) => state.users.users);

  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [customSender, setCustomSender] = useState<any>(null);
  const [caller, setCaller] = useState<string | null>(null);
  const [isCallGoingOn, setIsCallGoingOn] = useState<boolean>(false);
  const [isCallAnswered, setIsCallAnswered] = useState<boolean>(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [calleeRecordingTime, setCalleeRecordingTime] = useState<number>(0);

  

  const [isMuted, setIsMuted] = React.useState(false);
  const [isCameraOn, setIsCameraOn] = React.useState(false);



  

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);  

  const ongoingVideoCallRingtoneRef = useRef<HTMLVideoElement | null>(null);
  const incomingVideoCallRingtoneRef = useRef<HTMLVideoElement | null>(null);

  const videoChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const calleeAudioChunks = useRef<Blob[]>([]);
  const calleeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const calleeMediaRecorder = useRef<MediaRecorder | null>(null);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "turn:turn.bistri.com:80", username: "homeo", credential: "homeo" },
    ],
  };

  useEffect(() => {
    socket.connect();

    socket.on("callVUser2", (data: { offer: RTCSessionDescriptionInit,senderName:string, sender:any }) => {
      setIsReceivingCall(true);
      setIncomingOffer(data.offer);
      setCaller(data?.senderName);
      setCustomSender(data.sender);

      if (incomingVideoCallRingtoneRef.current) {
          incomingVideoCallRingtoneRef.current.src = incomingVideoCallRingtone;
          incomingVideoCallRingtoneRef.current.play();
        }
     
    });

    socket.on("callVAnswered2", async (data: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));

        setIsCallAnswered(true);
        setIsCalling(false);

        if (ongoingVideoCallRingtoneRef.current) {
            ongoingVideoCallRingtoneRef.current.pause();
            ongoingVideoCallRingtoneRef.current.currentTime = 0; // Reset to beginning
          }

        if (incomingVideoCallRingtoneRef.current) {
            incomingVideoCallRingtoneRef.current.pause();
            incomingVideoCallRingtoneRef.current.currentTime = 0;
        }
      }
      
      
    });

    socket.on("iceVCandidate", async (data: { candidate: RTCIceCandidate }) => {
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.once("callVEnded", () => {
      dispatch(setIsVideoCallEnabled(false));
      setIsCallAnswered(false);

     if (ongoingVideoCallRingtoneRef.current) {
          ongoingVideoCallRingtoneRef.current.pause();
          ongoingVideoCallRingtoneRef.current.currentTime = 0;
      }
      
      
      setCaller(null);
    
      endCall();
      
    });

    return () => {
      socket.off("callVUser2");
      socket.off("callVAnswered2");
      socket.off("iceVCandidate");
      socket.off("callVEnded");
    };
  }, [socket, peerConnection]);

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (error) {
        toast.error("Failed to access camera and microphone.");
      }
    };
    if (isVideoCallEnabled || caller) {
      startLocalStream();
    }
  }, [isVideoCallEnabled, caller]);
  

  useEffect(() => {
    if (customSender) {
      availableUsers.map((user: any) => {
      if (user._id === customSender) {
        dispatch(setReceiverInfo(user));
      }
    })
    }
  },[customSender])

  const createPeerConnection = () => {
    if (peerConnection) return peerConnection;

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceVCandidate", {
          candidate: e.candidate,
          sender: authUser?.user?._id,
          receiver: receiverInfo?._id,
        });
      }
    };

    pc.ontrack = (e) => {
      if (!remoteStream.current) {
        remoteStream.current = new MediaStream();
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
      }
      e.streams[0]?.getTracks().forEach((track) => {
        remoteStream.current?.addTrack(track);
      });
    };

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current!);
      });
    }

    setPeerConnection(pc);
    return pc;
  };

  const callUser = async () => {
    if (!receiverInfo) {
      toast.error("No receiver selected!");
      return;
    }

    if (ongoingVideoCallRingtoneRef.current) {
        ongoingVideoCallRingtoneRef.current.src = ongoingVideoCallRingtone;
        ongoingVideoCallRingtoneRef.current.play();
      
    }
    const pc = createPeerConnection();

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("callVUser", {
        offer,
        sender: authUser?.user?._id,
        senderName: authUser?.user?.name,
        receiver: receiverInfo._id,
      });
      setIsCalling(true);

    if (isCalling && (!isCallGoingOn && !isCallAnswered)) {
          setTimeout(() => {
            endCall();
            toast.info('video call not answered!');

            socket.emit("missedVCall", {
            type: "missed_v_call",
            sender: {
              id: authUser?.user?._id,
              name: authUser?.user?.name,
              photo:authUser?.user?.profilePicture
            },
            receiver: {
              id: receiverInfo?._id,
              name: receiverInfo?.name,
              photo: receiverInfo?.profilePicture
            }
          })
          },60000)
      }
      

      if (localStream.current) {
            
              mediaRecorderRef.current = new MediaRecorder(localStream.current);
              mediaRecorderRef.current.ondataavailable = event => {
                videoChunksRef.current.push(event.data);
              }
      
              mediaRecorderRef.current.onstop = () => {
               
               
      
                clearInterval(timerRef.current as NodeJS.Timeout);
              }
      
              mediaRecorderRef.current.start();
              
      
              timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
              }, 1000);
            
            if (isCalling && !isCallGoingOn && !isCallAnswered) {
              setTimeout(() => {
                endCall();
                toast.info('call not answered!');
                socket.emit("missedCall", {
                  type: "missed_call",
                  sender: {
                    id: authUser?.user?._id,
                    name: authUser?.user?.name,
                    photo:authUser?.user?.profilePicture
                  },
                  receiver: {
                    id: receiverInfo?._id,
                    name: receiverInfo?.name,
                    photo: receiverInfo?.profilePicture
                  }
                })
              },60000)
            }
            }
    } catch (error) {
      toast.error("Failed to initiate call.");
    }
  };

  const acceptCall = async () => {
    if (!incomingOffer) return;

     if (ongoingVideoCallRingtoneRef.current) {
        ongoingVideoCallRingtoneRef.current.pause();
        ongoingVideoCallRingtoneRef.current.currentTime = 0;
    }
    if (incomingVideoCallRingtoneRef.current) {
        incomingVideoCallRingtoneRef.current.pause();
        incomingVideoCallRingtoneRef.current.currentTime = 0;
    }
    const pc = createPeerConnection();


    try {
      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("callVAnswered", {
        answer,
        sender: authUser?.user?._id,
        receiver: receiverInfo?._id ? receiverInfo?._id : customSender,
      });


       if (remoteStream.current) {
      
        calleeMediaRecorder.current = new MediaRecorder(remoteStream.current);
        calleeMediaRecorder.current.ondataavailable = event => {
          calleeAudioChunks.current.push(event.data);
        }

        calleeMediaRecorder.current.onstop = () => {
         

  
          clearInterval(calleeTimerRef.current as NodeJS.Timeout);
        }

        calleeMediaRecorder.current.start();
        

        calleeTimerRef.current = setInterval(() => {
          setCalleeRecordingTime((prev) => prev + 1);
        }, 1000);
    }

      setIsReceivingCall(false);
      setIsCallGoingOn(true);

    } catch (error) {
      toast.error("Failed to accept call.");
    }
  };

  const endCall = () => {
    peerConnection?.close();
    setPeerConnection(null);
    setIsCalling(false);
    setIsReceivingCall(false);

     if (ongoingVideoCallRingtoneRef.current) {
        ongoingVideoCallRingtoneRef.current.pause();
        ongoingVideoCallRingtoneRef.current = null;
    }
    if (incomingVideoCallRingtoneRef.current) {
        incomingVideoCallRingtoneRef.current.pause();
        incomingVideoCallRingtoneRef.current = null;
    }

    localStream.current?.getTracks().forEach((track) => track.stop());
    remoteStream.current?.getTracks().forEach((track) => track.stop());

    socket.emit("endVCall", {
      sender: authUser?.user?._id,
      receiver: receiverInfo?._id,
    });
    setIsCallGoingOn(false);
    dispatch(setIsVideoCallEnabled(false));

    toast.info("call ended");

    setTimeout(() => {
      window.location.reload();
    }, 1500);

  };

  const toggleMic = () => {
    setIsMuted(!isMuted);
    if (localStream.current) {
          localStream.current.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
          });
          setMicrophoneEnabled(!microphoneEnabled);
          toast.info(`Microphone ${microphoneEnabled ? "Muted" : "Unmuted"}`);
        }

    
  };

   const toggleSpeaker = () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.muted = !speakerEnabled;
        setSpeakerEnabled(!speakerEnabled);
        toast.info(`Speaker ${speakerEnabled ? "Muted" : "Unmuted"}`);
      }
  };
  
  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn) 
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      toast.info(`Camera ${isCameraOn ? "Off" : "On"}`);
    }
  };

   const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
   if (isCallAnswered || isCallGoingOn) {
    if (ongoingVideoCallRingtoneRef.current) {
      ongoingVideoCallRingtoneRef.current = null;
    }
    if (incomingVideoCallRingtoneRef.current) {
      incomingVideoCallRingtoneRef.current = null;
    }
  }



   return (
     <div
       className={`absolute ${isVideoCallEnabled || caller ? "":"hidden"} z-50 bg-yellow-950 bottom-10 -right-[2%] md:-right-[2%] lg:right-[20%] m-3 w-[100%] md:w-[100%] lg:w-[70%]  flex flex-col items-center justify-between p-10 shadow-xl rounded-xl`}
       style={{
         height:'90vh'
       }}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-white text-2xl mb-5 font-bold">Video Call</h1>
        <button
          className="bg-white absolute top-0 right-0 text-red-600 rounded-full p-2 shadow-lg hover:bg-red-100"
           onClick={() => {
             dispatch(setIsVideoCallEnabled(false));
             setCaller(null);
           }
             
           }
        >
          <MdClose className="text-3xl" />
        </button>

          { isCallAnswered || isCallGoingOn &&
          <h1 className="absolute text-xl md:text-2xl font-bold left-[39%] mb-4">Talking to <span className="text-sky-400 italic">{receiverInfo?.name}</span> </h1>
      }
       </div>
       
        <p className="absolute top-0 text-white text-lg font-semibold lg:mt-4">
        {isCalling ? <span>calling <span className="font-semibold italic text-blue-700">{receiverInfo?.name}</span></span> : isReceivingCall ? <span>Incoming call from <span className="font-semibold italic text-blue-700">{caller}</span></span> : ""}
        </p>

      {/* Video Section */}
      <div className="relative flex flex-col items-center justify-center w-full bg-gradient-to-r from-blue-500 via-purple-600 h-[80%] to-pink-600">
      {/* Local Video */}
      <video
        ref={localVideoRef}
        autoPlay
        muted={isMuted}
        className={`w-[50%] md:w-1/4 lg:w-1/4 md:max-w-xs lg:max-w-xs h-auto shadow-2xl rounded-lg border-4 border-white -left-[0.6%] md:left-[9%] lg:left-[5.4%] top-[75%] md:top-[0%] lg:top-[0%] ${
          isCameraOn ? "bg-gray-800 opacity-70" : ""
        } transition-all transform hover:scale-105 absolute top-4 left-4 z-10`}
        style={{
          minWidth: "100px",
          maxHeight: "200px",
        }}
      >
        {isCameraOn && (
          <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-60 text-white text-lg font-semibold">
            Camera Off
          </div>
        )}
      </video>

      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        className="w-[100%] md:w-[70%] lg:w-[70%] absolute h-[450px] md:h-full lg:h-full md:-right-32 lg:-right-32 object-cover rounded-lg shadow-2xl border-4 border-white"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Optional Floating Controls (e.g., Mute, End Call) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button className="p-2 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition">
          <i className="fa fa-microphone-slash" />
        </button>
        <button className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-400 transition">
          <i className="fa fa-phone-slash" />
        </button>
      </div>
       </div>
       
       <div className="hidden">
          <video className="hidden" ref={ongoingVideoCallRingtoneRef} loop ></video>
          <video className="hidden" ref={incomingVideoCallRingtoneRef} loop ></video>
        </div>


      {/* Controls */}
      <div className="flex mt-3 justify-center gap-2 md:gap-3 lg:gap-4 items-center w-full">
        {/* Mic Control */}
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full shadow-md ${
            isMuted ? "bg-red-600 text-white" : "bg-white text-green-600"
          } hover:shadow-lg`}
        >
          {isMuted ? <MdMicOff className="text-2xl" /> : <MdMic className="text-2xl" />}
         </button>
         
        <button onClick={toggleSpeaker} className="btn btn-warning flex items-center gap-2">
          {speakerEnabled ? <MdVolumeUp className="text-xl" /> : <MdVolumeOff className="text-xl" />}
        </button>

        {/* Camera Control */}
        <button
          onClick={toggleCamera}
          className={`p-4 rounded-full shadow-md ${
            isCameraOn ? "bg-red-600 text-white" : "bg-white text-green-600"
          } hover:shadow-lg`}
        >
          {isCameraOn ? (
            <MdVideocamOff className="text-2xl" />
          ) : (
            <MdVideocam className="text-2xl" />
          )}
        </button>

        {/* Accept/End Call */}
        {isReceivingCall ? (
          <>
            <button
               onClick={() => {
                 acceptCall();
                  if (ongoingVideoCallRingtoneRef.current) {
                      ongoingVideoCallRingtoneRef.current.pause();
                      ongoingVideoCallRingtoneRef.current = null;
                }
              }}
              className="bg-green-600 text-white px-2 md:px-4 lg:px-6 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-green-700"
            >
              <MdCallReceived className="text-xl md:text-xl lg:text-2xl" /> Accept
            </button>
            <button
              onClick={endCall}
              className="bg-red-600 text-white px-2 md:px-4 lg:px-6 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-red-700"
            >
              <MdClose className="text-xl md:text-xl lg:text-2xl" /> Decline
            </button>
          </>
        ) : (
          <button
            onClick={isCalling || isCallGoingOn ? endCall : callUser}
            className={`${
              isCalling ? "bg-red-600" : "bg-green-600"
            } text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2 hover:shadow-lg`}
          >
            {isCalling || isCallGoingOn || isCallAnswered ? (
              <>
                <MdCallEnd className="text-2xl" /> End Call
              </>
            ) : (
              <>
                <MdCall className="text-2xl" /> Start Call
              </>
            )}
          </button>
         )}
         
        
       </div>


      <div className="flex flex-col absolute bottom-[1%] lg:bottom-[4%] pt-10 right-[45%] lg:right-[10%] gap-5 justify-center">
        
        {
        isCallGoingOn && <span className="bg-slate-950 text-center  rounded-lg w-16 mx-auto mt-5 text-xl">{formatTime(calleeRecordingTime)}</span>
      }
      { isCallAnswered &&
        <span className="bg-slate-950 text-center  rounded-lg w-16 mx-auto mt-5 px-5 ">{formatTime(recordingTime  && recordingTime - 3)}</span>
      }
      </div>
    </div>
  );
};

export default VideoCall;

