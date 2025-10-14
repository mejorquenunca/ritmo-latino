export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album?: string;
  genre: string[];
  duration: number; // en segundos
  audioUrl: string;
  coverUrl?: string;
  waveformUrl?: string;
  
  // Metadatos
  bpm?: number;
  key?: string;
  year?: number;
  language: 'es' | 'en' | 'pt' | 'other';
  
  // Engagement
  plays: number;
  likes: number;
  downloads: number;
  shares: number;
  
  // Estado del usuario
  isLiked: boolean;
  isInPlaylist: boolean;
  isDownloaded: boolean;
  
  // Información de subida
  uploadedBy: string;
  isOriginal: boolean;
  hasLicense: boolean;
  licenseType?: 'original' | 'cover' | 'remix' | 'sample';
  
  // Moderación
  moderationStatus: 'pending' | 'approved' | 'rejected';
  isExplicit: boolean;
  isReported: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    verified: boolean;
  };
  
  // Configuración
  isPublic: boolean;
  isCollaborative: boolean;
  
  // Contenido
  tracks: MusicTrack[];
  trackCount: number;
  totalDuration: number; // en segundos
  
  // Engagement
  followers: number;
  plays: number;
  
  // Estado del usuario
  isFollowing: boolean;
  isOwner: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  coverUrl?: string;
  description?: string;
  
  // Metadatos
  genre: string[];
  year?: number;
  recordLabel?: string;
  
  // Contenido
  tracks: MusicTrack[];
  trackCount: number;
  totalDuration: number;
  
  // Engagement
  plays: number;
  likes: number;
  
  // Estado del usuario
  isLiked: boolean;
  isInLibrary: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  
  // Información
  genre: string[];
  country?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // Estadísticas
  followers: number;
  monthlyListeners: number;
  totalPlays: number;
  
  // Contenido
  trackCount: number;
  albumCount: number;
  playlistCount: number;
  
  // Estado del usuario
  isFollowing: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerState {
  // Track actual
  currentTrack: MusicTrack | null;
  currentPlaylist: Playlist | null;
  currentIndex: number;
  
  // Estado de reproducción
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  
  // Configuración de audio
  volume: number;
  isMuted: boolean;
  
  // Progreso
  currentTime: number;
  duration: number;
  
  // Modo de reproducción
  repeatMode: 'none' | 'track' | 'playlist';
  shuffleMode: boolean;
  
  // Cola de reproducción
  queue: MusicTrack[];
  history: MusicTrack[];
}

export interface MusicUploadData {
  title: string;
  artist?: string;
  album?: string;
  genre: string[];
  audioFile: File;
  coverFile?: File;
  
  // Metadatos opcionales
  bpm?: number;
  key?: string;
  year?: number;
  language: 'es' | 'en' | 'pt' | 'other';
  
  // Licencia
  isOriginal: boolean;
  licenseType: 'original' | 'cover' | 'remix' | 'sample';
  hasPermission: boolean;
  
  // Configuración
  isExplicit: boolean;
  allowDownloads: boolean;
  allowRemixes: boolean;
}

export interface MusicFilters {
  genre?: string[];
  language?: string[];
  year?: {
    min?: number;
    max?: number;
  };
  duration?: {
    min?: number;
    max?: number;
  };
  bpm?: {
    min?: number;
    max?: number;
  };
  artistId?: string;
  isOriginal?: boolean;
  hasLicense?: boolean;
}

export interface MusicSearchResult {
  tracks: MusicTrack[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  hasMore: boolean;
  totalResults: number;
}

export interface TrendingData {
  tracks: MusicTrack[];
  artists: Artist[];
  genres: {
    name: string;
    count: number;
    growth: number;
  }[];
  playlists: Playlist[];
}

export interface MusicAnalytics {
  trackId: string;
  plays: number;
  uniqueListeners: number;
  completionRate: number;
  skipRate: number;
  averageListenTime: number;
  topCountries: {
    country: string;
    plays: number;
  }[];
  topAgeGroups: {
    ageGroup: string;
    plays: number;
  }[];
  dailyPlays: {
    date: Date;
    plays: number;
  }[];
}