'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useMusicStore } from '@/stores/musicStore';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Plus,
  MoreHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  className?: string;
  compact?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  className,
  compact = false 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    currentTrack,
    isPlaying,
    isPaused,
    volume,
    isMuted,
    currentTime,
    duration,
    repeatMode,
    shuffleMode,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    setCurrentTime,
    setDuration,
    likeTrack,
    unlikeTrack
  } = useMusicStore();

  // Sincronizar audio element con el store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying && !isPaused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, isPaused, currentTrack]);

  // Actualizar volumen
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Manejar eventos del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === 'track') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, nextTrack, setCurrentTime, setDuration]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
    
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    if (!currentTrack) return;
    
    if (currentTrack.isLiked) {
      unlikeTrack(currentTrack.id);
    } else {
      likeTrack(currentTrack);
    }
  };

  if (!currentTrack) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-3 z-40",
        className
      )}>
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          preload="metadata"
        />
        
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Track info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
              {currentTrack.coverUrl ? (
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <span className="text-black font-bold text-xs">
                    {currentTrack.title?.charAt(0)?.toUpperCase() || 'M'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentTrack.title}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.artist}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "text-gray-400 hover:text-white",
                currentTrack.isLiked && "text-red-500 hover:text-red-400"
              )}
            >
              <Heart className={cn("h-4 w-4", currentTrack.isLiked && "fill-current")} />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 mx-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousTrack}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <VasílalaButton
              variant="primary"
              size="sm"
              onClick={handlePlayPause}
              className="rounded-full w-10 h-10 p-0"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </VasílalaButton>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTrack}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            
            <div 
              className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-yellow-500 rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2 ml-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <div 
              className="w-20 h-1 bg-gray-700 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div 
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Reproductor expandido
  return (
    <div className={cn(
      "bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl",
      className
    )}>
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="metadata"
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Reproduciendo</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          <Minimize2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-80 h-80 bg-gray-800 rounded-2xl overflow-hidden mb-6 shadow-2xl">
          {currentTrack.coverUrl ? (
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <span className="text-black font-bold text-6xl">
                {currentTrack.title?.charAt(0)?.toUpperCase() || 'M'}
              </span>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">
            {currentTrack.title}
          </h3>
          <p className="text-xl text-gray-400">
            {currentTrack.artist}
          </p>
          {currentTrack.album && (
            <p className="text-sm text-gray-500 mt-1">
              {currentTrack.album}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-6">
          <div 
            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-yellow-500 rounded-full transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleShuffle}
            className={cn(
              "text-gray-400 hover:text-white",
              shuffleMode && "text-yellow-500"
            )}
          >
            <Shuffle className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={previousTrack}
            className="text-gray-400 hover:text-white"
          >
            <SkipBack className="h-8 w-8" />
          </Button>
          
          <VasílalaButton
            variant="primary"
            size="lg"
            onClick={handlePlayPause}
            className="rounded-full w-16 h-16 p-0"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </VasílalaButton>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={nextTrack}
            className="text-gray-400 hover:text-white"
          >
            <SkipForward className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleRepeat}
            className={cn(
              "text-gray-400 hover:text-white",
              repeatMode !== 'none' && "text-yellow-500"
            )}
          >
            <Repeat className="h-6 w-6" />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "text-gray-400 hover:text-white",
              currentTrack.isLiked && "text-red-500 hover:text-red-400"
            )}
          >
            <Heart className={cn("h-5 w-5", currentTrack.isLiked && "fill-current")} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="text-gray-400 hover:text-white"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        
        <div 
          className="w-32 h-2 bg-gray-700 rounded-full cursor-pointer"
          onClick={handleVolumeChange}
        >
          <div 
            className="h-full bg-yellow-500 rounded-full"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};