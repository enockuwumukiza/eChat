import React, { useState, useRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, Stop, Delete,Send } from '@mui/icons-material'; // Material UI icons

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0); 

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      setRecordingTime(0);
      audioChunksRef.current = [];
      clearInterval(timerRef.current as NodeJS.Timeout); // Clear timer when cancelling
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('voiceNote', audioBlob, 'voiceNote.wav');

    try {
      const response = await fetch('/upload/voice', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full mt-24 max-w-xs p-2 bg-white rounded-lg shadow-lg mx-auto">
      <div className="flex justify-center items-center">
        {!isRecording && !audioUrl && (
          <Tooltip title="Start recording audio">
            <IconButton
              color="primary"
              onClick={startRecording}
              disabled={isRecording}
              className="w-12 h-12"
            >
              <PlayArrow fontSize="large" />
            </IconButton>
          </Tooltip>
        )}

        {isRecording && (
          <>
            <Tooltip title="Pause recording">
              <IconButton
                color="warning"
                onClick={pauseRecording}
                disabled={isPaused}
                className="w-12 h-12"
              >
                <Pause fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop recording">
              <IconButton
                color="error"
                onClick={stopRecording}
                className="w-12 h-12"
              >
                <Stop fontSize="large" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {isPaused && (
          <Tooltip title="Resume recording">
            <IconButton
              color="info"
              onClick={resumeRecording}
              className="w-12 h-12"
            >
              <PlayArrow fontSize="large" />
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
                <Delete fontSize="large" />
              </IconButton>
            </Tooltip>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div className="flex ">
            
           
            <Tooltip title="Upload recorded audio">
              <IconButton
                color="success"
                onClick={uploadAudio}
                className="w-12 h-12"
              >
                <Send fontSize="large" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}

      {isRecording && (
        <p className="absolute top-[18.4%] right-[55%] text-[16px] font-semibold text-sky-100">
          {formatTime(recordingTime)}
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;
