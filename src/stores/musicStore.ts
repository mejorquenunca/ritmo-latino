import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { MusicTrack, Playlist, PlayerState } from '@/types/music';
import { incrementTrackPlays } from '@/lib/music';

interface MusicState extends PlayerState {
  // Biblioteca del usuario
  library: MusicTrack[];
  playlists: Playlist[];
  likedTracks: MusicTrack[];
  
  // Estado de carga
  loading: boolean;
  error: string | null;
}

interface MusicActions {
  // Control de reproducción
  playTrack: (track: MusicTrack, playlist?: Playlist) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  
  // Control de volumen
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Modos de reproducción
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  
  // Gestión de cola
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  
  // Gestión de biblioteca
  addToLibrary: (track: MusicTrack) => void;
  removeFromLibrary: (trackId: string) => void;
  likeTrack: (track: MusicTrack) => void;
  unlikeTrack: (trackId: string) => void;
  
  // Gestión de playlists
  createPlaylist: (name: string, description?: string) => void;
  addToPlaylist: (playlistId: string, track: MusicTrack) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  
  // Estado
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type MusicStore = MusicState & MusicActions;

export const useMusicStore = create<MusicStore>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      currentTrack: null,
      currentPlaylist: null,
      currentIndex: 0,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      volume: 0.8,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      repeatMode: 'none',
      shuffleMode: false,
      queue: [],
      history: [],
      library: [],
      playlists: [],
      likedTracks: [],
      loading: false,
      error: null,

      // Control de reproducción
      playTrack: (track, playlist) => {
        const state = get();
        
        // Agregar a historial si hay una pista actual
        if (state.currentTrack) {
          set(state => ({
            history: [state.currentTrack!, ...state.history.slice(0, 49)] // Mantener últimas 50
          }));
        }
        
        // Configurar nueva pista
        set({
          currentTrack: track,
          currentPlaylist: playlist || null,
          currentIndex: playlist ? playlist.tracks.findIndex(t => t.id === track.id) : 0,
          isPlaying: true,
          isPaused: false,
          currentTime: 0,
          error: null
        });
        
        // Incrementar reproducciones
        incrementTrackPlays(track.id).catch(console.error);
      },

      pauseTrack: () => set({
        isPlaying: false,
        isPaused: true
      }),

      resumeTrack: () => set({
        isPlaying: true,
        isPaused: false
      }),

      stopTrack: () => set({
        isPlaying: false,
        isPaused: false,
        currentTime: 0
      }),

      nextTrack: () => {
        const { currentPlaylist, currentIndex, shuffleMode, queue } = get();
        
        // Si hay cola, reproducir siguiente de la cola
        if (queue.length > 0) {
          const nextTrack = queue[0];
          set(state => ({
            queue: state.queue.slice(1)
          }));
          get().playTrack(nextTrack);
          return;
        }
        
        // Si hay playlist, reproducir siguiente
        if (currentPlaylist && currentPlaylist.tracks.length > 0) {
          let nextIndex: number;
          
          if (shuffleMode) {
            // Modo aleatorio
            nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
          } else {
            // Modo secuencial
            nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
          }
          
          const nextTrack = currentPlaylist.tracks[nextIndex];
          if (nextTrack) {
            get().playTrack(nextTrack, currentPlaylist);
          }
        }
      },

      previousTrack: () => {
        const { currentPlaylist, currentIndex, history } = get();
        
        // Si hay historial y estamos al inicio de la pista, ir a anterior
        if (get().currentTime < 3 && history.length > 0) {
          const previousTrack = history[0];
          set(state => ({
            history: state.history.slice(1)
          }));
          get().playTrack(previousTrack);
          return;
        }
        
        // Si estamos en una playlist, ir a la anterior
        if (currentPlaylist && currentPlaylist.tracks.length > 0) {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentPlaylist.tracks.length - 1;
          const prevTrack = currentPlaylist.tracks[prevIndex];
          if (prevTrack) {
            get().playTrack(prevTrack, currentPlaylist);
          }
        } else {
          // Reiniciar pista actual
          set({ currentTime: 0 });
        }
      },

      seekTo: (time) => set({ currentTime: time }),

      // Control de volumen
      setVolume: (volume) => set({ 
        volume: Math.max(0, Math.min(1, volume)),
        isMuted: volume === 0
      }),

      toggleMute: () => set(state => ({
        isMuted: !state.isMuted
      })),

      // Modos de reproducción
      toggleRepeat: () => set(state => ({
        repeatMode: state.repeatMode === 'none' 
          ? 'playlist' 
          : state.repeatMode === 'playlist' 
            ? 'track' 
            : 'none'
      })),

      toggleShuffle: () => set(state => ({
        shuffleMode: !state.shuffleMode
      })),

      // Gestión de cola
      addToQueue: (track) => set(state => ({
        queue: [...state.queue, track]
      })),

      removeFromQueue: (index) => set(state => ({
        queue: state.queue.filter((_, i) => i !== index)
      })),

      clearQueue: () => set({ queue: [] }),

      // Gestión de biblioteca
      addToLibrary: (track) => set(state => ({
        library: state.library.find(t => t.id === track.id) 
          ? state.library 
          : [...state.library, track]
      })),

      removeFromLibrary: (trackId) => set(state => ({
        library: state.library.filter(t => t.id !== trackId)
      })),

      likeTrack: (track) => set(state => ({
        likedTracks: state.likedTracks.find(t => t.id === track.id)
          ? state.likedTracks
          : [...state.likedTracks, { ...track, isLiked: true }]
      })),

      unlikeTrack: (trackId) => set(state => ({
        likedTracks: state.likedTracks.filter(t => t.id !== trackId)
      })),

      // Gestión de playlists
      createPlaylist: (name, description) => {
        const newPlaylist: Playlist = {
          id: `playlist_${Date.now()}`,
          name,
          description,
          userId: 'current_user', // TODO: Obtener del contexto de auth
          user: {
            id: 'current_user',
            username: 'usuario',
            displayName: 'Usuario',
            verified: false
          },
          isPublic: false,
          isCollaborative: false,
          tracks: [],
          trackCount: 0,
          totalDuration: 0,
          followers: 0,
          plays: 0,
          isFollowing: false,
          isOwner: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          playlists: [...state.playlists, newPlaylist]
        }));
      },

      addToPlaylist: (playlistId, track) => set(state => ({
        playlists: state.playlists.map(playlist =>
          playlist.id === playlistId
            ? {
                ...playlist,
                tracks: [...playlist.tracks, track],
                trackCount: playlist.trackCount + 1,
                totalDuration: playlist.totalDuration + track.duration,
                updatedAt: new Date()
              }
            : playlist
        )
      })),

      removeFromPlaylist: (playlistId, trackId) => set(state => ({
        playlists: state.playlists.map(playlist =>
          playlist.id === playlistId
            ? {
                ...playlist,
                tracks: playlist.tracks.filter(t => t.id !== trackId),
                trackCount: Math.max(0, playlist.trackCount - 1),
                totalDuration: Math.max(0, playlist.totalDuration - (playlist.tracks.find(t => t.id === trackId)?.duration || 0)),
                updatedAt: new Date()
              }
            : playlist
        )
      })),

      // Estado
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'music-store',
    }
  )
);