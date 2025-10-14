'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MusicPlayer } from '@/components/tson/MusicPlayer';
import { VasílalaCard, VasílalaCardContent, VasílalaCardHeader, VasílalaCardTitle } from '@/components/ui/vasilala-card';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { useMusicStore } from '@/stores/musicStore';
import { 
  Music, 
  Play, 
  Heart, 
  Plus,
  TrendingUp,
  Clock,
  Headphones
} from 'lucide-react';

export default function TSonPage() {
  const { currentTrack, playTrack } = useMusicStore();

  // Mock data para demostración
  const mockTracks = [
    {
      id: '1',
      title: 'Salsa Caliente',
      artist: 'Carlos Vives',
      artistId: 'artist1',
      album: 'Ritmos del Caribe',
      genre: ['Salsa'],
      duration: 240,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://picsum.photos/seed/music1/300/300',
      plays: 125000,
      likes: 8500,
      downloads: 0,
      shares: 450,
      isLiked: false,
      isInPlaylist: false,
      isDownloaded: false,
      uploadedBy: 'artist1',
      isOriginal: true,
      hasLicense: true,
      language: 'es' as const,
      moderationStatus: 'approved' as const,
      isExplicit: false,
      isReported: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Bachata Romántica',
      artist: 'Romeo Santos',
      artistId: 'artist2',
      album: 'Corazón Latino',
      genre: ['Bachata'],
      duration: 195,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://picsum.photos/seed/music2/300/300',
      plays: 89000,
      likes: 6200,
      downloads: 0,
      shares: 320,
      isLiked: true,
      isInPlaylist: false,
      isDownloaded: false,
      uploadedBy: 'artist2',
      isOriginal: true,
      hasLicense: true,
      language: 'es' as const,
      moderationStatus: 'approved' as const,
      isExplicit: false,
      isReported: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Reggaeton Flow',
      artist: 'Bad Bunny',
      artistId: 'artist3',
      album: 'Urbano Latino',
      genre: ['Reggaeton'],
      duration: 210,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      coverUrl: 'https://picsum.photos/seed/music3/300/300',
      plays: 250000,
      likes: 15000,
      downloads: 0,
      shares: 890,
      isLiked: false,
      isInPlaylist: true,
      isDownloaded: false,
      uploadedBy: 'artist3',
      isOriginal: true,
      hasLicense: true,
      language: 'es' as const,
      moderationStatus: 'approved' as const,
      isExplicit: true,
      isReported: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gradient-to-b from-yellow-900/20 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-yellow-500 mb-2">TSón</h1>
            <p className="text-gray-300 text-lg">
              Descubre y disfruta la mejor música latina
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-32">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <VasílalaCard variant="glass">
              <VasílalaCardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">2.5M</h3>
                <p className="text-gray-400">Canciones</p>
              </VasílalaCardContent>
            </VasílalaCard>
            
            <VasílalaCard variant="glass">
              <VasílalaCardContent className="p-6 text-center">
                <Headphones className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">150K</h3>
                <p className="text-gray-400">Artistas</p>
              </VasílalaCardContent>
            </VasílalaCard>
            
            <VasílalaCard variant="glass">
              <VasílalaCardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">24/7</h3>
                <p className="text-gray-400">Streaming</p>
              </VasílalaCardContent>
            </VasílalaCard>
          </div>

          {/* Trending Music */}
          <VasílalaCard className="mb-8">
            <VasílalaCardHeader>
              <VasílalaCardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Música Trending
              </VasílalaCardTitle>
            </VasílalaCardHeader>
            <VasílalaCardContent>
              <div className="space-y-4">
                {mockTracks.map((track, index) => (
                  <div 
                    key={track.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors group cursor-pointer"
                    onClick={() => playTrack(track)}
                  >
                    <div className="flex-shrink-0 relative">
                      <img 
                        src={track.coverUrl} 
                        alt={track.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {track.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {track.artist}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatNumber(track.plays)} reproducciones
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <VasílalaButton
                        variant="ghost"
                        size="sm"
                        className={`${track.isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-400`}
                      >
                        <Heart className={`h-4 w-4 ${track.isLiked ? 'fill-current' : ''}`} />
                      </VasílalaButton>
                      
                      <VasílalaButton
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <Plus className="h-4 w-4" />
                      </VasílalaButton>
                    </div>
                  </div>
                ))}
              </div>
            </VasílalaCardContent>
          </VasílalaCard>

          {/* Genres */}
          <VasílalaCard>
            <VasílalaCardHeader>
              <VasílalaCardTitle className="flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Géneros Populares
              </VasílalaCardTitle>
            </VasílalaCardHeader>
            <VasílalaCardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {['Salsa', 'Bachata', 'Reggaeton', 'Merengue', 'Cumbia', 'Vallenato'].map((genre) => (
                  <VasílalaButton
                    key={genre}
                    variant="secondary"
                    className="h-20 flex-col space-y-2"
                  >
                    <Music className="h-6 w-6" />
                    <span className="text-sm">{genre}</span>
                  </VasílalaButton>
                ))}
              </div>
            </VasílalaCardContent>
          </VasílalaCard>
        </div>

        {/* Music Player */}
        {currentTrack && (
          <MusicPlayer compact={true} />
        )}
      </div>
    </ProtectedRoute>
  );
}