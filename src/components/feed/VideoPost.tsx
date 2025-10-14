'use client';

import React, { useRef, useEffect, useState } from 'react';
import { VideoPost as VideoPostType } from '@/types/post';
import { useFeedStore } from '@/stores/feedStore';
import { useAuth } from '@/context/AuthContext';
import { VasílalaBadge } from '@/components/ui/vasilala-badge';
import { Button } from '@/components/ui/button';
// import { CommentsModal } from './CommentsModal';
// import { ShareModal } from './ShareModal';
// import { ReportModal } from './ReportModal';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  Music, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Flag,
  UserPlus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface VideoPostProps {
  post: VideoPostType;
  isActive: boolean;
  onVideoClick?: () => void;
}

export const VideoPost: React.FC<VideoPostProps> = ({ 
  post, 
  isActive,
  onVideoClick 
}) => {
  const { userProfile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  // Modal states
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  
  const { 
    likePost, 
    unlikePost, 
    bookmarkPost, 
    unbookmarkPost,
    incrementViews,
    incrementShares 
  } = useFeedStore();

  // Auto play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().then(() => {
        setIsPlaying(true);
        incrementViews(post.id);
      }).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, post.id, incrementViews]);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleLike = () => {
    if (post.isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleBookmark = () => {
    if (post.isBookmarked) {
      unbookmarkPost(post.id);
    } else {
      bookmarkPost(post.id);
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleReport = () => {
    setShowReport(true);
  };

  const handleShareComplete = () => {
    incrementShares(post.id);
  };

  const isOwnPost = userProfile?.id === post.userId;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Video */}
      <div 
        className="relative w-full h-full max-w-md mx-auto cursor-pointer"
        onClick={onVideoClick}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          loop
          muted={isMuted}
          playsInline
          poster={post.thumbnailUrl}
        >
          <source src={post.videoUrl} type="video/mp4" />
        </video>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
          <div 
            className="h-full bg-yellow-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Video controls overlay */}
        {showControls && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-12 w-12" />
              ) : (
                <Play className="h-12 w-12" />
              )}
            </Button>
          </div>
        )}

        {/* Mute button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleMuteToggle();
          }}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* User info and interactions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-end justify-between">
          {/* Left side - User info and caption */}
          <div className="flex-1 mr-4">
            {/* User info */}
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={post.user.avatar}
                alt={post.user.displayName}
                className="w-12 h-12 rounded-full border-2 border-yellow-500"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">
                    @{post.user.username}
                  </span>
                  {post.user.verified && (
                    <VasílalaBadge variant="verified" size="sm">
                      Verificado
                    </VasílalaBadge>
                  )}
                </div>
                <span className="text-gray-300 text-sm">
                  {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>

            {/* Caption */}
            <p className="text-white text-sm mb-2 line-clamp-3">
              {post.caption}
            </p>

            {/* Hashtags */}
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {post.hashtags.slice(0, 3).map((hashtag, index) => (
                  <span 
                    key={index}
                    className="text-yellow-500 text-sm hover:underline cursor-pointer"
                  >
                    {hashtag}
                  </span>
                ))}
                {post.hashtags.length > 3 && (
                  <span className="text-gray-400 text-sm">
                    +{post.hashtags.length - 3} más
                  </span>
                )}
              </div>
            )}

            {/* Music info */}
            {post.musicTrack && (
              <div className="flex items-center space-x-2 text-white text-sm">
                <Music className="h-4 w-4" />
                <span className="truncate">
                  {post.musicTrack.title} - {post.musicTrack.artist}
                </span>
              </div>
            )}
          </div>

          {/* Right side - Interaction buttons */}
          <div className="flex flex-col items-center space-y-4">
            {/* Like button */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`text-white hover:bg-white/20 ${
                  post.isLiked ? 'text-red-500' : ''
                }`}
              >
                <Heart 
                  className={`h-8 w-8 ${post.isLiked ? 'fill-current' : ''}`} 
                />
              </Button>
              <span className="text-white text-xs font-medium">
                {formatNumber(post.likes)}
              </span>
            </div>

            {/* Comment button */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComment();
                }}
                className="text-white hover:bg-white/20"
              >
                <MessageCircle className="h-8 w-8" />
              </Button>
              <span className="text-white text-xs font-medium">
                {formatNumber(post.comments)}
              </span>
            </div>

            {/* Share button */}
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="text-white hover:bg-white/20"
              >
                <Share className="h-8 w-8" />
              </Button>
              <span className="text-white text-xs font-medium">
                {formatNumber(post.shares)}
              </span>
            </div>

            {/* Bookmark button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
              className={`text-white hover:bg-white/20 ${
                post.isBookmarked ? 'text-yellow-500' : ''
              }`}
            >
              <Bookmark 
                className={`h-8 w-8 ${post.isBookmarked ? 'fill-current' : ''}`} 
              />
            </Button>

            {/* Follow button (if not own post) */}
            {!isOwnPost && (
              <Button
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle follow
                }}
                className="text-white hover:bg-white/20"
              >
                <UserPlus className="h-6 w-6" />
              </Button>
            )}

            {/* More options / Report */}
            <Button
              variant="ghost"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                handleReport();
              }}
              className="text-white hover:bg-white/20"
            >
              {isOwnPost ? (
                <MoreHorizontal className="h-6 w-6" />
              ) : (
                <Flag className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* <CommentsModal
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        initialCommentsCount={post.comments}
      />

      <ShareModal
        post={post}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        onShare={handleShareComplete}
      />

      <ReportModal
        post={post}
        isOpen={showReport}
        onClose={() => setShowReport(false)}
      /> */}
    </div>
  );
};