import  { useState, useRef,useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause,PlayCircle, Stop, Delete,Send } from '@mui/icons-material'; // Material UI icons

const VoiceRecorder = ({ setAudio, isRecording, setIsRecording, audioUrl, setAudioUrl,setShouldPlay}:{setAudio:any,isRecording:boolean, setIsRecording:any, audioUrl:any, setAudioUrl:any,setShouldPlay:any}) => {
 
  const [isPaused, setIsPaused] = useState(false);
  
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0); 

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);



  useEffect(() => {
  return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Clean up the timer
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop(); // Stop media recorder if component unmounts
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudio(audioUrl);
        const audioFile = new File([audioBlob], `${Date.now()}.wav`, { type: "audio/wav" });
        setAudio(audioFile);
        setAudioUrl(audioUrl);
        clearInterval(timerRef.current as NodeJS.Timeout); // Clear timer when recording stops
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0); // Reset timer when starting new recording

      // Start the timer to update every second
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the timer when paused
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000); // Resume the timer
    }
  };

  const stopRecording = () => {
    setIsRecording(false)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop the timer
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setAudioUrl(null);
      setAudioBlob(null);
      setAudio(null);
      setShouldPlay(false);
      setRecordingTime(0);
      audioChunksRef.current = [];
      clearInterval(timerRef.current as NodeJS.Timeout); // Clear timer when cancelling
    }
  };

    const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setAudioFile(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      console.warn("No audio to play.");
    }
  };


  const pauseAudio = () => {
    if (audioFile) {
      setIsPlaying(false);
      audioFile?.pause();
    }
  }


  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  return (
    <div className="fixed md:bottom-1 lg:bottom-3 md:right-[28%] lg:right-[8%] flex items-center justify-center w-[70%]  md:w-[60%] lg:w-[30%] md:h-[80px] lg:h-[50px] rounded-lg bg-slate-950">
      <div className="flex justify-center items-center">
        {!isRecording && !audioUrl && (
          <Tooltip title="Start recording audio">
            <IconButton
              color="primary"
              onClick={startRecording}
              disabled={isRecording}
              
            >
              <span className='font-bold md:text-4xl lg:text-xl'>Click to start recording</span>
            </IconButton>
          </Tooltip>
        )}
        {
          !isRecording && audioUrl && (
            <Tooltip title="Play recorded audio">
              <IconButton
                color="primary"
                onClick={isPlaying? pauseAudio: playAudio}
                className="w-12 h-12"
              >
                {isPlaying ? <Pause
                  
                  sx={{
                    fontSize: {
                      xs: "30px",
                      sm: "40px",
                      md: "70px",
                      lg: "35px",
                    },
                  }}
                
                /> : <PlayArrow
                  
                  sx={{
                    fontSize: {
                      xs: "30px",
                      sm: "40px",
                      md: "70px",
                      lg: "35px",
                    },
                  }}
                />}
              </IconButton>
            </Tooltip>
          )
        }
        {isRecording && (
          <>
            <Tooltip title="Pause recording">
              <IconButton
                color="warning"
                onClick={pauseRecording}
                disabled={isPaused}
                className="w-12 h-12"
              >
                <Pause
                  
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
            <Tooltip title="Stop recording">
              <IconButton
                color="error"
                onClick={stopRecording}
                className="w-12 h-12"
              >
                <Stop
                
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
          </>
        )}

        {isPaused && (
          <Tooltip title="Resume recording">
            <IconButton
              color='primary'
              onClick={resumeRecording}
              className="w-12 h-12"
            >
              <PlayCircle
                
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
        )}
      </div>

      {audioUrl && (
        <div className="flex justify-between">
           <Tooltip title="Delete recording">
              <IconButton
                color="error"
                onClick={cancelRecording}
                className="w-12 h-12"
              >
              <Delete
                
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
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div className="flex ">
            
          </div>
        </div>
      )}

      {isRecording && (
        <p className="absolute top-[18.4%] right-[80%] text-[25px] md:text-[30px] lg:text-[16px] font-semibold text-green-700">
          {formatTime(recordingTime)}
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;

