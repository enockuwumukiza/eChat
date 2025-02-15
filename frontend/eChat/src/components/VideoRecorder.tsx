import  { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IconButton, Tooltip } from '@mui/material';
import { PlayCircle, Stop, PauseCircle, Cancel, Delete, ReplayCircleFilled, CancelRounded } from '@mui/icons-material';

const VideoRecorder = ({setVideo, setShouldVideoShow}:{setVideo:any, setShouldVideoShow:any}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const videoRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const previewRef = useRef<HTMLVideoElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);



    useEffect(() => {
        if (videoBlob) {
            const videoFile = new File([videoBlob], `${Date.now()}.webm`, { type: "video/webm" });
            if (videoFile) {
                setVideo(videoFile);
            }
        }
    }, [videoBlob]);
    
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

            streamRef.current = stream;
            videoRecorderRef.current = new MediaRecorder(stream);

            if (previewRef.current) {
                previewRef.current.srcObject = stream;
                previewRef.current.play();
            }

            videoRecorderRef.current.ondataavailable = (e) => {
                videoChunksRef.current.push(e.data);
            };

            videoRecorderRef.current.onstop = () => {
                const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                setVideoBlob(videoBlob);
                setVideoUrl(videoUrl);
                videoChunksRef.current = [];
                clearInterval(timerRef.current as NodeJS.Timeout);

                stream.getTracks().forEach((track) => track.stop());
                if (previewRef.current) {
                    previewRef.current.srcObject = null;
                }
            };

            videoRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            toast.error('Error accessing mic or camera');
            console.error('Error recording video:', error);
        }
    };

    const pauseRecording = () => {
        if (videoRecorderRef.current && videoRecorderRef.current.state === 'recording') {
            videoRecorderRef.current.pause();
            setIsPaused(true);
            if (timerRef.current) {
                clearInterval(timerRef.current as NodeJS.Timeout);
            }
        }
    };

    const resumeRecording = () => {
        if (videoRecorderRef.current && videoRecorderRef.current.state === 'paused') {
            videoRecorderRef.current.resume();
            setIsPaused(false);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
    };

    const cancelRecording = () => {
        if (videoRecorderRef.current) {
            setVideo(null);
            videoRecorderRef.current.stop();
            setVideo(null);
            setIsRecording(false);
            setIsPaused(false);
            setRecordingTime(0);
            setVideoBlob(null);
            setVideoUrl(null);
            
            setShouldVideoShow(false);
           
            clearInterval(timerRef.current as NodeJS.Timeout);
        }
        
    };

    const stopRecording = () => {
        if (videoRecorderRef.current && isRecording) {
            videoRecorderRef.current.stop();
            setIsRecording(false);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current as NodeJS.Timeout)
        }
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const deleteRecordedVideo = () => {
        if (videoUrl || videoBlob) {
            setVideoBlob(null);
            setVideoUrl(null);
            setVideo(null);
            setShouldVideoShow(false);
            toast.success('Recorded video deleted');
        } else {
            toast.warning('No video to delete');
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div>
             <div className="absolute bottom-24 lg:bottom-5 flex flex-col items-center bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-xl p-3 md:p-2 lg:p-2 space-y-2 mx-auto w-[98%] md:w-[100%] lg:w-[110%] left-[0.7%] md:left-[0%] lg:-left-[130%] overflow-y-auto" style={{
                zIndex: '9999',
                 maxHeight:'100vh'
        }}>
                <div className='flex justify-between lg:gap-20'>
                    <h1 className="text-3xl font-bold text-blue-600">Video Recorder</h1>
                    <Tooltip title="Cancle video" placement='top'>
                        <IconButton onClick={() => {
                            setShouldVideoShow(false);
                            cancelRecording();
                            
                         }


                        }>
                        <CancelRounded htmlColor='red'
                            
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

            <div className="border-4 border-blue-500 rounded-lg overflow-hidden shadow-md">
                <video ref={previewRef} className="w-full max-w-[500px] bg-black" autoPlay muted></video>
            </div>

            {videoUrl ? (
                <video src={videoUrl} controls className="w-full max-w-[400px] rounded-lg shadow-md" />
            ) : (
                <p className="text-gray-500 italic">No video recorded yet</p>
            )}

            <div className="flex lg:space-x-4">
                <Tooltip title="Start Recording">
                    <IconButton color="success" onClick={startRecording} disabled={isRecording}>
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

                <Tooltip title="Pause Recording">
                    <IconButton color="warning" onClick={pauseRecording} disabled={!isRecording || isPaused}>
                            <PauseCircle
                                
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

                <Tooltip title="Resume Recording">
                    <IconButton color="primary" onClick={resumeRecording} disabled={!isPaused}>
                            <ReplayCircleFilled
                                
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

                <Tooltip title="Stop Recording">
                    <IconButton color="error" onClick={stopRecording} disabled={!isRecording}>
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

                <Tooltip title="Cancel Recording">
                    <IconButton color="secondary" onClick={cancelRecording}>
                            <Cancel
                                
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

                <Tooltip title="Delete Video">
                    <IconButton
                        color="error"
                        onClick={deleteRecordedVideo}
                        disabled={!videoUrl}
                        className={`bg-gray-500 text-white hover:bg-gray-600 ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            </div>

            {isRecording && (
                <p className="text-lg text-blue-700 font-medium">Recording Time: {formatTime(recordingTime)}</p>
            )}
        </div>
       </div>
    );
};

export default VideoRecorder;
