import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { 
  MusicTrack, 
  Playlist, 
  Album, 
  Artist, 
  MusicUploadData, 
  MusicFilters,
  MusicSearchResult,
  TrendingData
} from '@/types/music';

/**
 * Sube una pista musical a Firebase
 */
export const uploadMusicTrack = async (
  uploadData: MusicUploadData,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // 1. Subir archivo de audio
    const audioRef = ref(storage, `music/${userId}/${Date.now()}_${uploadData.audioFile.name}`);
    const audioUpload = uploadBytesResumable(audioRef, uploadData.audioFile);
    
    return new Promise((resolve, reject) => {
      audioUpload.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 70;
          onProgress?.(Math.round(progress));
        },
        (error) => {
          console.error('Error uploading audio:', error);
          reject(error);
        },
        async () => {
          try {
            const audioUrl = await getDownloadURL(audioRef);
            
            // 2. Subir cover si existe
            let coverUrl: string | undefined;
            if (uploadData.coverFile) {
              onProgress?.(75);
              const coverRef = ref(storage, `covers/${userId}/${Date.now()}_${uploadData.coverFile.name}`);
              const coverUpload = await uploadBytesResumable(coverRef, uploadData.coverFile);
              coverUrl = await getDownloadURL(coverRef);
            }
            
            onProgress?.(85);
            
            // 3. Crear documento en Firestore
            const tracksRef = collection(db, 'music');
            const trackData = {
              title: uploadData.title,
              artist: uploadData.artist || 'Artista Desconocido',
              artistId: userId,
              album: uploadData.album,
              genre: uploadData.genre,
              audioUrl,
              coverUrl,
              duration: 0, // Se calculará después
              bpm: uploadData.bpm,
              key: uploadData.key,
              year: uploadData.year,
              language: uploadData.language,
              plays: 0,
              likes: 0,
              downloads: 0,
              shares: 0,
              isLiked: false,
              isInPlaylist: false,
              isDownloaded: false,
              uploadedBy: userId,
              isOriginal: uploadData.isOriginal,
              hasLicense: uploadData.hasPermission,
              licenseType: uploadData.licenseType,
              moderationStatus: 'pending',
              isExplicit: uploadData.isExplicit,
              isReported: false,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            };
            
            const docRef = await addDoc(tracksRef, trackData);
            
            onProgress?.(100);
            resolve(docRef.id);
            
          } catch (error) {
            reject(error);
          }
        }
      );
    });
    
  } catch (error) {
    console.error('Error uploading music track:', error);
    throw error;
  }
};

/**
 * Obtiene pistas musicales con filtros y paginación
 */
export const getMusicTracks = async (
  filters: MusicFilters = {},
  lastTrackId?: string,
  limitCount: number = 20
): Promise<{ tracks: MusicTrack[]; hasMore: boolean }> => {
  try {
    const tracksRef = collection(db, 'music');
    let q = query(
      tracksRef,
      where('moderationStatus', '==', 'approved'),
      orderBy('createdAt', 'desc'),
      limit(limitCount + 1)
    );
    
    // Aplicar filtros
    if (filters.genre && filters.genre.length > 0) {
      q = query(q, where('genre', 'array-contains-any', filters.genre));
    }
    
    if (filters.language && filters.language.length > 0) {
      q = query(q, where('language', 'in', filters.language));
    }
    
    if (filters.artistId) {
      q = query(q, where('artistId', '==', filters.artistId));
    }
    
    if (filters.isOriginal !== undefined) {
      q = query(q, where('isOriginal', '==', filters.isOriginal));
    }
    
    // Paginación
    if (lastTrackId) {
      const lastTrackDoc = await getDoc(doc(db, 'music', lastTrackId));
      if (lastTrackDoc.exists()) {
        q = query(q, startAfter(lastTrackDoc));
      }
    }
    
    const snapshot = await getDocs(q);
    const tracks: MusicTrack[] = [];
    
    snapshot.docs.forEach((doc, index) => {
      if (index < limitCount) {
        const data = doc.data();
        tracks.push({
          id: doc.id,
          title: data.title,
          artist: data.artist,
          artistId: data.artistId,
          album: data.album,
          genre: data.genre || [],
          duration: data.duration || 0,
          audioUrl: data.audioUrl,
          coverUrl: data.coverUrl,
          waveformUrl: data.waveformUrl,
          bpm: data.bpm,
          key: data.key,
          year: data.year,
          language: data.language || 'es',
          plays: data.plays || 0,
          likes: data.likes || 0,
          downloads: data.downloads || 0,
          shares: data.shares || 0,
          isLiked: false, // Se calculará en el cliente
          isInPlaylist: false, // Se calculará en el cliente
          isDownloaded: false, // Se calculará en el cliente
          uploadedBy: data.uploadedBy,
          isOriginal: data.isOriginal || false,
          hasLicense: data.hasLicense || false,
          licenseType: data.licenseType,
          moderationStatus: data.moderationStatus || 'approved',
          isExplicit: data.isExplicit || false,
          isReported: data.isReported || false,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        });
      }
    });
    
    const hasMore = snapshot.docs.length > limitCount;
    
    return { tracks, hasMore };
  } catch (error) {
    console.error('Error getting music tracks:', error);
    throw error;
  }
};

/**
 * Obtiene una pista específica por ID
 */
export const getMusicTrackById = async (trackId: string): Promise<MusicTrack | null> => {
  try {
    const trackDoc = await getDoc(doc(db, 'music', trackId));
    
    if (!trackDoc.exists()) {
      return null;
    }
    
    const data = trackDoc.data();
    return {
      id: trackDoc.id,
      title: data.title,
      artist: data.artist,
      artistId: data.artistId,
      album: data.album,
      genre: data.genre || [],
      duration: data.duration || 0,
      audioUrl: data.audioUrl,
      coverUrl: data.coverUrl,
      waveformUrl: data.waveformUrl,
      bpm: data.bpm,
      key: data.key,
      year: data.year,
      language: data.language || 'es',
      plays: data.plays || 0,
      likes: data.likes || 0,
      downloads: data.downloads || 0,
      shares: data.shares || 0,
      isLiked: false,
      isInPlaylist: false,
      isDownloaded: false,
      uploadedBy: data.uploadedBy,
      isOriginal: data.isOriginal || false,
      hasLicense: data.hasLicense || false,
      licenseType: data.licenseType,
      moderationStatus: data.moderationStatus || 'approved',
      isExplicit: data.isExplicit || false,
      isReported: data.isReported || false,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    };
  } catch (error) {
    console.error('Error getting music track by ID:', error);
    throw error;
  }
};

/**
 * Incrementa las reproducciones de una pista
 */
export const incrementTrackPlays = async (trackId: string): Promise<void> => {
  // No hacer nada si es un track mock (ID numérico simple)
  if (/^\d+$/.test(trackId)) {
    console.log('🎭 Incremento de plays ignorado para track mock:', trackId);
    return;
  }
  
  try {
    const trackRef = doc(db, 'music', trackId);
    await updateDoc(trackRef, {
      plays: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing track plays:', error);
    // No lanzar error para no interrumpir la reproducción
  }
};

/**
 * Da like a una pista
 */
export const likeMusicTrack = async (trackId: string, userId: string): Promise<void> => {
  // No hacer nada si es un track mock (ID numérico simple)
  if (/^\d+$/.test(trackId)) {
    console.log('🎭 Like ignorado para track mock:', trackId);
    return;
  }
  
  try {
    const trackRef = doc(db, 'music', trackId);
    const likesRef = collection(db, 'music', trackId, 'likes');
    
    // Agregar like
    await addDoc(likesRef, {
      userId,
      createdAt: Timestamp.now()
    });
    
    // Incrementar contador
    await updateDoc(trackRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking music track:', error);
    throw error;
  }
};

/**
 * Quita like de una pista
 */
export const unlikeMusicTrack = async (trackId: string, userId: string): Promise<void> => {
  // No hacer nada si es un track mock (ID numérico simple)
  if (/^\d+$/.test(trackId)) {
    console.log('🎭 Unlike ignorado para track mock:', trackId);
    return;
  }
  
  try {
    const trackRef = doc(db, 'music', trackId);
    const likesRef = collection(db, 'music', trackId, 'likes');
    
    // Buscar y eliminar el like
    const likesQuery = query(likesRef, where('userId', '==', userId));
    const likesSnapshot = await getDocs(likesQuery);
    
    const deletePromises = likesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Decrementar contador
    await updateDoc(trackRef, {
      likes: increment(-1)
    });
  } catch (error) {
    console.error('Error unliking music track:', error);
    throw error;
  }
};

/**
 * Crea una nueva playlist
 */
export const createPlaylist = async (
  name: string,
  userId: string,
  description?: string,
  isPublic: boolean = true
): Promise<string> => {
  try {
    const playlistsRef = collection(db, 'playlists');
    
    const playlistData = {
      name,
      description,
      userId,
      isPublic,
      isCollaborative: false,
      tracks: [],
      trackCount: 0,
      totalDuration: 0,
      followers: 0,
      plays: 0,
      isFollowing: false,
      isOwner: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(playlistsRef, playlistData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

/**
 * Agrega una pista a una playlist
 */
export const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
  try {
    const playlistRef = doc(db, 'playlists', playlistId);
    
    // Obtener la pista para calcular duración
    const track = await getMusicTrackById(trackId);
    if (!track) {
      throw new Error('Track not found');
    }
    
    await updateDoc(playlistRef, {
      tracks: arrayUnion(trackId),
      trackCount: increment(1),
      totalDuration: increment(track.duration),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    throw error;
  }
};

/**
 * Remueve una pista de una playlist
 */
export const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<void> => {
  try {
    const playlistRef = doc(db, 'playlists', playlistId);
    
    // Obtener la pista para calcular duración
    const track = await getMusicTrackById(trackId);
    if (!track) {
      throw new Error('Track not found');
    }
    
    await updateDoc(playlistRef, {
      tracks: arrayRemove(trackId),
      trackCount: increment(-1),
      totalDuration: increment(-track.duration),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    throw error;
  }
};

/**
 * Busca música por texto
 */
export const searchMusic = async (
  searchTerm: string,
  filters: MusicFilters = {},
  limitCount: number = 20
): Promise<MusicSearchResult> => {
  try {
    // Por simplicidad, buscaremos solo en títulos y artistas
    // En una implementación real, usarías Algolia o similar para búsqueda full-text
    
    const tracksRef = collection(db, 'music');
    let q = query(
      tracksRef,
      where('moderationStatus', '==', 'approved'),
      orderBy('plays', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const allTracks: MusicTrack[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const track: MusicTrack = {
        id: doc.id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        album: data.album,
        genre: data.genre || [],
        duration: data.duration || 0,
        audioUrl: data.audioUrl,
        coverUrl: data.coverUrl,
        waveformUrl: data.waveformUrl,
        bpm: data.bpm,
        key: data.key,
        year: data.year,
        language: data.language || 'es',
        plays: data.plays || 0,
        likes: data.likes || 0,
        downloads: data.downloads || 0,
        shares: data.shares || 0,
        isLiked: false,
        isInPlaylist: false,
        isDownloaded: false,
        uploadedBy: data.uploadedBy,
        isOriginal: data.isOriginal || false,
        hasLicense: data.hasLicense || false,
        licenseType: data.licenseType,
        moderationStatus: data.moderationStatus || 'approved',
        isExplicit: data.isExplicit || false,
        isReported: data.isReported || false,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
      allTracks.push(track);
    });
    
    // Filtrar por término de búsqueda (búsqueda simple)
    const filteredTracks = allTracks.filter(track => 
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return {
      tracks: filteredTracks,
      artists: [], // TODO: Implementar búsqueda de artistas
      albums: [], // TODO: Implementar búsqueda de álbumes
      playlists: [], // TODO: Implementar búsqueda de playlists
      hasMore: false,
      totalResults: filteredTracks.length
    };
  } catch (error) {
    console.error('Error searching music:', error);
    throw error;
  }
};

/**
 * Obtiene música trending
 */
export const getTrendingMusic = async (): Promise<TrendingData> => {
  try {
    const tracksRef = collection(db, 'music');
    const q = query(
      tracksRef,
      where('moderationStatus', '==', 'approved'),
      orderBy('plays', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    const tracks: MusicTrack[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      tracks.push({
        id: doc.id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        album: data.album,
        genre: data.genre || [],
        duration: data.duration || 0,
        audioUrl: data.audioUrl,
        coverUrl: data.coverUrl,
        waveformUrl: data.waveformUrl,
        bpm: data.bpm,
        key: data.key,
        year: data.year,
        language: data.language || 'es',
        plays: data.plays || 0,
        likes: data.likes || 0,
        downloads: data.downloads || 0,
        shares: data.shares || 0,
        isLiked: false,
        isInPlaylist: false,
        isDownloaded: false,
        uploadedBy: data.uploadedBy,
        isOriginal: data.isOriginal || false,
        hasLicense: data.hasLicense || false,
        licenseType: data.licenseType,
        moderationStatus: data.moderationStatus || 'approved',
        isExplicit: data.isExplicit || false,
        isReported: data.isReported || false,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      });
    });
    
    return {
      tracks,
      artists: [], // TODO: Implementar artistas trending
      genres: [], // TODO: Implementar géneros trending
      playlists: [] // TODO: Implementar playlists trending
    };
  } catch (error) {
    console.error('Error getting trending music:', error);
    throw error;
  }
};