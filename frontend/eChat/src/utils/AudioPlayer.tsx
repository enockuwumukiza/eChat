import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { IconButton, Tooltip } from '@mui/material';
import { PlayArrow, Pause, Stop, Replay } from '@mui/icons-material'; // Material UI icons

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = (): void => {
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const handleReplay = (): void => {
    setPlaybackProgress(0);
    setIsPlaying(true);
  };

  const handleProgress = (state: { played: number }): void => {
    setPlaybackProgress(state.played * 100);
  };

  const handleDuration = (duration: number): void => {
    setAudioDuration(duration);
  };

  return (
    <div className="flex top-0 flex-col items-center bg-green-500 p-2 rounded-lg shadow-lg w-80 absolute" style={{ maxHeight: '120px' }}>
      <div className="w-full mb-1 text-center text-white font-semibold text-xs">
        <p className="text-sm">{audioUrl ? 'Now Playing' : 'No audio selected'}</p>
      </div>

      <div className="relative w-full">
        {audioUrl && (
          <ReactPlayer
            url={audioUrl}
            playing={isPlaying}
            controls={false}
            width="100%"
            height="40px"
            onProgress={handleProgress}
            onDuration={handleDuration}
          />
        )}

        <div className="w-full absolute bottom-2 left-0 px-2">
          <div className="flex items-center justify-between">
            <Tooltip title="Replay" arrow>
              <IconButton
                onClick={handleReplay}
                size="small"
                color="primary"
                className="text-white hover:bg-slate-700 p-1"
              >
                <Replay fontSize="small" />
              </IconButton>
            </Tooltip>

            <div className="w-full mx-2">
              <input
                type="range"
                value={playbackProgress}
                max={100}
                onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                className="range range-sm range-primary w-full rounded-full"
              />
            </div>

            <div className="flex items-center">
              <Tooltip title={isPlaying ? 'Pause' : 'Play'} arrow>
                <IconButton
                  onClick={handlePlayPause}
                  size="small"
                  color="primary"
                  className="text-white hover:bg-slate-700 p-1"
                >
                  {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Stop" arrow>
                <IconButton
                  onClick={handleStop}
                  size="small"
                  color="primary"
                  className="text-white hover:bg-slate-700 p-1"
                >
                  <Stop fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-1 text-xs text-white flex justify-between px-4">
        <span>{formatTime((playbackProgress / 100) * audioDuration)}</span>
        <span>{formatTime(audioDuration)}</span>
      </div>
    </div>
  );
};

// Helper function to format time (seconds to mm:ss)
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default AudioPlayer;
