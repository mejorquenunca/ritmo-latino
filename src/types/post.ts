export interface VideoPost {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    userType: string;
    verified: boolean;
  };
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  musicTrackId?: string;
  musicTrack?: {
    id: string;
    title: string;
    artist: string;
    coverUrl?: string;
    audioUrl: string;
  };
  hashtags: string[];
  mentions: string[];
  
  // Engagement metrics
  likes: number;
  comments: number;
  shares: number;
  views: number;
  
  // User interactions
  isLiked: boolean;
  isBookmarked: boolean;
  
  // Metadata
  duration: number; // in seconds
  aspectRatio: number;
  quality: 'HD' | 'SD' | 'AUTO';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Moderation
  isPublic: boolean;
  isReported: boolean;
  moderationStatus: 'approved' | 'pending' | 'rejected';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedState {
  posts: VideoPost[];
  loading: boolean;
  hasMore: boolean;
  currentIndex: number;
  error: string | null;
}

export interface PostInteraction {
  type: 'like' | 'unlike' | 'comment' | 'share' | 'bookmark' | 'view';
  postId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}