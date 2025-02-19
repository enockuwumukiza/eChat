import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MdCall, MdCallEnd, MdCallReceived, MdMic, MdMicOff, MdVolumeOff, MdVolumeUp, MdClose } from "react-icons/md";
import { RootState } from "../store/store";
import { setIsAudioCallEnabled } from "../store/slices/displaySlice";
import { setReceiverInfo } from "../store/slices/messageSlice";
import ongoingCallRingtone from '../../public/sounds/ongoing-call-ringtone.mp3'
import incomingCallRingtone from '../../public/sounds/incoming-call-ringtone.mp3'



const VoiceCall: React.FC = () => {

  const dispatch = useDispatch();
;

  const { socket } = useSocket();
  const { authUser } = useAuth();
  const receiverInfo: any = useSelector((state: RootState) => state.message.receiverInfo);
  const isAudioCallEnabled: boolean = useSelector((state: RootState) => state.display.isAudioCallEnabled);
  const availableUsers: any = useSelector((state: RootState) => state.users.users);

  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [isCallAnswered, setIsCallAnswered] = useState<boolean>(false);
  const [customSender, setCustomSender] = useState<any>(null);
  const [caller, setCaller] = useState<string | null>(null);
  const [isCallGoingOn, setIsCallGoingOn] = useState<boolean>(false);

  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [calleeRecordingTime, setCalleeRecordingTime] = useState<number>(0);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);

  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ongoingCallRingtoneRef = useRef<HTMLAudioElement | null>(null);
  const incomingCallRingtoneRef = useRef<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);


  const calleeAudioChunks = useRef<Blob[]>([]);
  const calleeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const calleeMediaRecorder = useRef<MediaRecorder | null>(null);



  const configuration: RTCConfiguration = {

      iceServers: [
        { "urls": "stun:stun.l.google.com:19302" },
         {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:global.relay.metered.ca:80",
        username: "f63354cec90be8afccb5daf1",
        credential: "OpXN8HkDkImk5tGt",
      },
      {
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "f63354cec90be8afccb5daf1",
        credential: "OpXN8HkDkImk5tGt",
      },
      {
        urls: "turn:global.relay.metered.ca:443",
        username: "f63354cec90be8afccb5daf1",
        credential: "OpXN8HkDkImk5tGt",
      },
      {
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "f63354cec90be8afccb5daf1",
        credential: "OpXN8HkDkImk5tGt",
      },
      ]
  }

  useEffect(() => {
    startLocalStream(); 
    return () => {
      localStream.current?.getTracks().forEach((track) => track.stop());
      remoteStream.current?.getTracks().forEach((track) => track.stop());
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);


  const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
        localStream.current = stream;
        if (localAudioRef.current) localAudioRef.current.srcObject = stream;


      } catch (error) {
        if (isAudioCallEnabled || caller) {
          toast.error("Failed to access microphone. Please check your permissions.");
        }
      }
    };
    

  useEffect(() => {
    if (isReceivingCall && !isAudioCallEnabled) {
        dispatch(setIsAudioCallEnabled(true));
    }
  },[isReceivingCall]);

    useEffect(() => {
      socket.connect();

      socket.on("callUser2", (data: { offer: RTCSessionDescriptionInit, sender: any }) => {
         dispatch(setIsAudioCallEnabled(true));
        setIsReceivingCall(true);
        setCaller(data?.sender?.name);
        setCustomSender(data.sender?._id);
      
        setIncomingOffer(data.offer);
        if (incomingCallRingtoneRef.current) {
          incomingCallRingtoneRef.current.src = incomingCallRingtone;
          incomingCallRingtoneRef.current.play();
        }
        
      });

      socket.on("callAnswered2", async (data: { answer: RTCSessionDescriptionInit }) => {
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          setIsCallAnswered(true);
          setIsCalling(false);


          console.log('on callAnswered audio call enabled: ', isAudioCallEnabled);

           if (ongoingCallRingtoneRef.current) {
            ongoingCallRingtoneRef.current.pause();
            ongoingCallRingtoneRef.current.currentTime = 0; // Reset to beginning
          }

          if (incomingCallRingtoneRef.current) {
              incomingCallRingtoneRef.current.pause();
              incomingCallRingtoneRef.current.currentTime = 0;
          }
          
        }
      });

      socket.on("iceCandidate", async (data: { candidate: RTCIceCandidate }) => {
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        

      });

      socket.on("callEnded", handleCallEnd);

      return () => {
        socket.off("callUser2");
        socket.off("callAnswered2");
        socket.off("iceCandidate");
        socket.off("callEnded", handleCallEnd);
      };
    }, [socket, peerConnection]);
  
  useEffect(() => {
      if (customSender) {
        availableUsers.map((user: any) => {
        if (user._id === customSender) {
          dispatch(setReceiverInfo(user));
        }
      })
      }
    },[customSender])

  
 
  
  
  const handleCallEnd = () => {
    
     if (ongoingCallRingtoneRef.current) {
          ongoingCallRingtoneRef.current.pause();
          ongoingCallRingtoneRef.current.currentTime = 0;
        }

      endCall();

    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    
  };

  

  const resetCallStates = () => {
    setPeerConnection(null);
    setIsCalling(false);
    setIsReceivingCall(false);
    setIsCallAnswered(false);
    setCustomSender(null);
    setCaller(null);
    setIsCallGoingOn(false);
    setRecordingTime(0);
    setCalleeRecordingTime(0);
    setIncomingOffer(null);
    setMicrophoneEnabled(true);
    setSpeakerEnabled(true);
    
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    if (remoteStream.current) {
      remoteStream.current.getTracks().forEach((track) => track.stop());
      remoteStream.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (ongoingCallRingtoneRef.current) {
      ongoingCallRingtoneRef.current.pause();
      ongoingCallRingtoneRef.current.currentTime = 0;
    }
    if (incomingCallRingtoneRef.current) {
      incomingCallRingtoneRef.current.pause();
      incomingCallRingtoneRef.current.currentTime = 0;
    }
    dispatch(setIsAudioCallEnabled(false));
    // dispatch(setReceiverInfo(null));
  };


  const toggleMicrophone = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicrophoneEnabled(!microphoneEnabled);
      toast.info(`Microphone ${microphoneEnabled ? "Muted" : "Unmuted"}`);
    }
  };

  const toggleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !speakerEnabled;
      setSpeakerEnabled(!speakerEnabled);
      toast.info(`Speaker ${speakerEnabled ? "Muted" : "Unmuted"}`);
    }
  };

  const createPeerConnection = useCallback(() => {
    if (peerConnection) return peerConnection;

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceCandidate", {
          candidate: e.candidate,
          sender: authUser?.user?._id,
          receiver: receiverInfo?._id,
        });
      
      }
    };

    pc.ontrack = (e) => {
      if (!remoteStream.current) {
        remoteStream.current = new MediaStream();
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream.current;
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
  }, [authUser, peerConnection, receiverInfo, socket]);

  const callUser = async () => {




    if (!receiverInfo) {
      toast.error("No receiver selected!");
      return;
    }

    const pc = createPeerConnection();

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("callUser", {
        offer,
        sender: authUser?.user,
        receiver: receiverInfo._id,
      });
      
      setIsCalling(true);

      
    if (ongoingCallRingtoneRef.current) {
        ongoingCallRingtoneRef.current.src = ongoingCallRingtone;
        ongoingCallRingtoneRef.current.play();
        
    }
    
    if (localStream.current) {
      
        mediaRecorderRef.current = new MediaRecorder(localStream.current);
        mediaRecorderRef.current.ondataavailable = event => {
          audioChunksRef.current.push(event.data);
        }

        mediaRecorderRef.current.onstop = () => {
    
          clearInterval(timerRef.current as NodeJS.Timeout);
        }

        mediaRecorderRef.current.start();
     

        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      
      if (isCalling && !isCallGoingOn || !isCallAnswered) {
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

    if (ongoingCallRingtoneRef.current) {
      ongoingCallRingtoneRef.current.pause();
      ongoingCallRingtoneRef.current.currentTime = 0;
    }
    if (incomingCallRingtoneRef.current) {
      incomingCallRingtoneRef.current.pause();
      incomingCallRingtoneRef.current.currentTime = 0;
    }

    const pc = createPeerConnection();

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (pc) {
        socket.emit("callAnswered", {
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
        
      } else {
        toast.info("no peer connection")
      }
      
    } catch (error) {
      toast.error("Failed to accept call.");
    }
  };


  const endCall = () => {
  if (peerConnection) {
    peerConnection.onicecandidate = null;
    peerConnection.ontrack = null;
    peerConnection.close();
    setPeerConnection(null);
  }

  if (localStream.current) {
    localStream.current.getTracks().forEach(track => track.stop());
    localStream.current = null;
  }

  if (remoteStream.current) {
    remoteStream.current.getTracks().forEach(track => track.stop());
    remoteStream.current = null;
  }

    if (ongoingCallRingtoneRef.current) {
      ongoingCallRingtoneRef.current.pause();
      ongoingCallRingtoneRef.current.currentTime = 0;
    }

    if (incomingCallRingtoneRef.current) {
      incomingCallRingtoneRef.current.pause();
      incomingCallRingtoneRef.current.currentTime = 0;
    }

    if (isCalling || caller || isCallAnswered || isCallGoingOn) {
      socket.emit("endCall", {
      sender: authUser?.user?._id,
      receiver: receiverInfo?._id,
    });
    }


    

    toast.info("Call ended");


    resetCallStates();


    
  };



  const formatTime = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  if (isCallAnswered || isCallGoingOn) {
    if (ongoingCallRingtoneRef.current) {
      ongoingCallRingtoneRef.current = null;
    }
    if (incomingCallRingtoneRef.current) {
      incomingCallRingtoneRef.current = null;
    }
  }

  return (
    <div className={`absolute ${isAudioCallEnabled || caller? '':'hidden'} right-0 lg:right-[41.6%] w-[100%] md:w-[100%] lg:w-[43.25%] bottom-20`}>
      <div className="flex flex-col items-center justify-center bg-violet-950 text-white" style={{
        height:'60vh'
      }}>
        <button
          className="bg-white absolute top-0 right-0 text-red-600 rounded-full p-2 shadow-lg hover:bg-red-100"
            onClick={() => {
              dispatch(setIsAudioCallEnabled(false));
              
              setCaller(null);
              handleCallEnd();
              
            }
              
            }
        >
        <MdClose className="text-3xl" />
      </button>
        {
          <h1 className="text-2xl font-bold mb-4">{isCallAnswered || isCallGoingOn ? "Talking to": "Call"} <span className="text-sky-400 italic">{receiverInfo?.name}</span> </h1>
      }
      <div className="grid grid-cols-2 gap-4 mb-6">
        <audio ref={localAudioRef} autoPlay muted className="hidden" />
        <audio ref={remoteAudioRef} autoPlay className="hidden" />
      </div>
      <div className="flex items-center gap-4">
          {isReceivingCall && (
            <>
              <button onClick={() => {
                acceptCall();
                if (ongoingCallRingtoneRef.current) {
                  ongoingCallRingtoneRef.current.pause();
                  ongoingCallRingtoneRef.current = null;
                }
              }} className="btn btn-success flex items-center gap-2">
                <MdCallReceived className="text-xl" /> Accept
              </button>
              <button onClick={endCall} className="btn btn-error flex items-center gap-2">
                Decline
              </button>
            </>
          )} { isCalling || isCallGoingOn || isCallAnswered ? (
            <button onClick={() => {

              toast.info('call ended');

              setTimeout(() => {
                
                handleCallEnd();
                

              },2000)
            }}
              className="btn btn-error flex items-center gap-2">
            <MdCallEnd className="text-xl" /> End Call
          </button>
        ) : ( !caller && 
          <button onClick={callUser} className="btn btn-success flex items-center gap-2">
            <MdCall className="text-xl" /> Call
          </button>
          )}
          <div className="hidden">
            <audio className="hidden" ref={ongoingCallRingtoneRef} loop ></audio>
            <audio className="hidden" ref={incomingCallRingtoneRef} loop ></audio>
          </div>
        <button onClick={toggleMicrophone} className="btn btn-info flex items-center gap-2">
          {microphoneEnabled ? <MdMic className="text-xl" /> : <MdMicOff className="text-xl" />}
        </button>
        <button onClick={toggleSpeaker} className="btn btn-warning flex items-center gap-2">
          {speakerEnabled ? <MdVolumeUp className="text-xl" /> : <MdVolumeOff className="text-xl" />}
        </button>
      </div>
      <p className="mt-4">
        {isCalling ? <span>calling <span className="font-semibold italic text-blue-700">{receiverInfo?.name}</span></span> : isReceivingCall ? <span>Incoming call from <span className="font-semibold italic text-blue-700">{caller}</span></span> : ""}
        </p>
        {
          isCallGoingOn && <span className="bg-slate-950 text-center  rounded-lg w-16 mx-auto mt-5">{formatTime(calleeRecordingTime)}</span>
        }
        
         
        <div className="flex flex-col gap-5 justify-center">
          {
            isCallAnswered && <span className="bg-slate-950 text-center  rounded-lg w-16 mx-auto mt-5">{formatTime(recordingTime  && recordingTime - 3)}</span>
          }
         </div>
      </div>
    </div>
  );
};

export default VoiceCall;


// the problem is with endcall on socket