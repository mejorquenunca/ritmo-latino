
"use client";

import { createContext, useContext, useState, type ReactNode, useRef, useEffect, useCallback } from "react";
import { songs as initialSongs, playlists as initialPlaylists, type Song, type Playlist } from "@/lib/placeholder-data";
import { useToast } from "@/hooks/use-toast";

type RepeatMode = 'off' | 'one' | 'all';

interface MusicContextType {
    // Player State
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    isShuffle: boolean;
    repeatMode: RepeatMode;
    volume: number;
    // Player Actions
    playSong: (song: Song, songList?: Song[]) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    seek: (time: number) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    setVolume: (volume: number) => void;
    // User Collections
    songs: Song[];
    likedSongs: Song[];
    playlists: Playlist[];
    uploadedSongs: Song[];
    publishedPlaylists: Playlist[];
    // Playlist Actions
    toggleLikeSong: (song: Song) => void;
    addSongToPlaylist: (playlistId: string, song: Song) => void;
    removeSongFromPlaylist: (playlistId: string, songId: string) => void;
    createPlaylist: (name: string) => void;
    deletePlaylist: (playlistId: string) => void;
    clonePlaylist: (playlist: Playlist, newName: string) => void;
    unfollowPlaylist: (playlistId: string) => void;
    publishPlaylist: (playlistId: string) => void;
    // Upload Actions
    addUploadedSong: (song: Song) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Player State
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
    const [volume, setVolumeState] = useState(1);
    const [queue, setQueue] = useState<Song[]>([]);
    const [originalQueue, setOriginalQueue] = useState<Song[]>([]);

    // User Collections State
    const [songs, setSongs] = useState<Song[]>(initialSongs);
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
    const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);
    const [publishedPlaylists, setPublishedPlaylists] = useState<Playlist[]>([]);


    const playNext = useCallback(() => {
        if (!currentSong) return;

        const audio = audioRef.current;
        if (!audio) return;

        if (repeatMode === 'one') {
            audio.currentTime = 0;
            audio.play();
            return;
        }

        const currentIndex = queue.findIndex(s => s.id === currentSong.id);
        let nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) {
            if (repeatMode === 'all') {
                nextIndex = 0;
            } else {
                setIsPlaying(false);
                return;
            }
        }
        
        const nextSong = queue[nextIndex];
        if (nextSong) {
            setCurrentSong(nextSong);
            audio.src = nextSong.audioUrl;
            audio.play().then(() => setIsPlaying(true));
        }

    }, [currentSong, queue, repeatMode]);

    // Create a stable ref for the playNext function
    const playNextRef = useRef(playNext);
    useEffect(() => {
        playNextRef.current = playNext;
    }, [playNext]);

    // === Core Audio Logic ===
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;
        audio.volume = volume;

        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => playNextRef.current();

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [volume]);

     useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playSong = useCallback((song: Song, songList?: Song[]) => {
        const audio = audioRef.current;
        if (!audio) return;

        setCurrentSong(song);
        audio.src = song.audioUrl;
        audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
        
        const newQueue = songList ? [...songList] : [song];
        const newOriginalQueue = songList ? [...songList] : [song];

        setOriginalQueue(newOriginalQueue);
        
        if (isShuffle && songList) {
            const shuffled = [...newOriginalQueue].sort(() => Math.random() - 0.5);
            // Move the current song to the beginning of the shuffled queue
            const currentIndex = shuffled.findIndex(s => s.id === song.id);
            if (currentIndex > 0) {
                const [current] = shuffled.splice(currentIndex, 1);
                shuffled.unshift(current);
            }
            setQueue(shuffled);
        } else {
            setQueue(newQueue);
        }
    }, [isShuffle, setIsShuffle]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(e => console.error("Error playing audio:", e));
        }
    }, [isPlaying, currentSong]);
    
    const playPrevious = useCallback(() => {
        if (!currentSong) return;

        const audio = audioRef.current;
        if (!audio) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        const currentIndex = queue.findIndex(s => s.id === currentSong.id);
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = queue.length - 1; 
        }
        
        const prevSong = queue[prevIndex];
        if (prevSong) {
             setCurrentSong(prevSong);
            audio.src = prevSong.audioUrl;
            audio.play().then(() => setIsPlaying(true));
        }

    }, [currentSong, queue]);
    
    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = time;
            setProgress(time);
        }
    }, []);

    const toggleShuffle = useCallback(() => {
        const newShuffleState = !isShuffle;
        let toastMessage = "";
        if (newShuffleState) {
            setQueue(q => [...q].sort(() => Math.random() - 0.5));
            toastMessage = "Modo aleatorio activado";
        } else {
            setQueue(originalQueue);
            toastMessage = "Modo aleatorio desactivado";
        }
        setIsShuffle(newShuffleState);
        toast({ title: toastMessage });
    }, [isShuffle, originalQueue, toast]);

    const toggleRepeat = useCallback(() => {
        const modes: RepeatMode[] = ['off', 'all', 'one'];
        const currentModeIndex = modes.indexOf(repeatMode);
        const nextModeIndex = (currentModeIndex + 1) % modes.length;
        const newRepeatMode = modes[nextModeIndex];

        let toastMessage = "";
        if (newRepeatMode === 'all') {
            toastMessage = "Repetir todo activado";
        } else if (newRepeatMode === 'one') {
            toastMessage = "Repetir una canción activado";
        } else {
            toastMessage = "Modo repetir desactivado";
        }
        
        setRepeatMode(newRepeatMode);
        toast({ title: toastMessage });
    }, [repeatMode, toast]);
    
    const setVolume = useCallback((newVolume: number) => {
        setVolumeState(newVolume);
    }, []);
    
    // === Playlist and Library Logic ===
    const toggleLikeSong = useCallback((song: Song) => {
        const isLiked = likedSongs.some(s => s.id === song.id);
        if (isLiked) {
            setLikedSongs(prev => prev.filter(s => s.id !== song.id));
            toast({ title: "Eliminada de 'Me Gusta'" });
        } else {
            setLikedSongs(prev => [song, ...prev]);
            toast({ title: "Añadida a 'Me Gusta'" });
        }
    }, [likedSongs, toast]);

    const createPlaylist = useCallback((name: string) => {
        const newPlaylist: Playlist = {
            id: `pl${Date.now()}`,
            name,
            ownerId: 'u4', // Assume current user is 'Elena Rosa'
            songIds: [],
        };
        setPlaylists(prev => [newPlaylist, ...prev]);
        toast({ title: `Playlist "${name}" creada` });
    }, [toast]);
    
    const addSongToPlaylist = useCallback((playlistId: string, song: Song) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        if (playlist.songIds.includes(song.id)) {
            toast({ variant: 'destructive', title: `"${song.title}" ya está en "${playlist.name}".` });
            return;
        }

        setPlaylists(prevPlaylists =>
            prevPlaylists.map(p =>
                p.id === playlistId
                    ? { ...p, songIds: [...p.songIds, song.id] }
                    : p
            )
        );
        toast({ title: `Añadida a "${playlist.name}"` });
    }, [playlists, toast]);

    const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
        let playlistName = "";
        setPlaylists(prevPlaylists => {
            const newPlaylists = prevPlaylists.map(p => {
                if (p.id === playlistId) {
                    playlistName = p.name;
                    return { ...p, songIds: p.songIds.filter(id => id !== songId) };
                }
                return p;
            });
            return newPlaylists;
        });
        if(playlistName) {
            toast({ title: `Canción eliminada de "${playlistName}"` });
        }
    }, [toast]);

    const deletePlaylist = useCallback((playlistId: string) => {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        toast({ title: 'Playlist eliminada' });
    }, [toast]);

    const clonePlaylist = useCallback((playlist: Playlist, newName: string) => {
        const newPlaylist: Playlist = {
            ...playlist,
            id: `pl${Date.now()}`,
            name: newName,
            ownerId: 'u4',
        };
        setPlaylists(prev => [newPlaylist, ...prev]);
        toast({ title: `Playlist "${newName}" clonada.` });
    }, [toast]);

    const unfollowPlaylist = useCallback((playlistId: string) => {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        toast({ title: 'Dejaste de seguir la playlist' });
    }, [toast]);
    
    const addUploadedSong = useCallback((song: Song) => {
        const newSongs = [song, ...songs];
        setSongs(newSongs);
        setUploadedSongs(prev => [song, ...prev]);
        toast({ title: `"${song.title}" subida con éxito.` });
    }, [songs, toast]);

    const publishPlaylist = useCallback((playlistId: string) => {
        const playlistToPublish = playlists.find(p => p.id === playlistId);
        if (!playlistToPublish) return;

        const isAlreadyPublished = publishedPlaylists.some(p => p.id === playlistId);
        if (isAlreadyPublished) {
            toast({ title: `"${playlistToPublish.name}" ya está publicada.` });
            return;
        }

        setPublishedPlaylists(prev => [playlistToPublish, ...prev]);
        toast({ title: `¡"${playlistToPublish.name}" publicada en la comunidad!` });
    }, [playlists, publishedPlaylists, toast]);

    const value = { 
        currentSong, isPlaying, progress, duration, isShuffle, repeatMode, volume,
        playSong, togglePlay, playNext, playPrevious, seek, toggleShuffle, toggleRepeat, setVolume,
        songs, likedSongs, playlists, uploadedSongs, publishedPlaylists,
        toggleLikeSong, addSongToPlaylist, removeSongFromPlaylist, createPlaylist, deletePlaylist, clonePlaylist, unfollowPlaylist, publishPlaylist,
        addUploadedSong
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
}
