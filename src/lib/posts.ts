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
import { db } from './firebase';
import type { VideoPost } from '@/types/post';

export interface CreatePostData {
  userId: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  location?: string;
  musicTrackId?: string;
  duration: number;
  dimensions: {
    width: number;
    height: number;
  };
  isPublic: boolean;
  allowComments: boolean;
  allowDuets: boolean;
}

export interface PostFilters {
  userId?: string;
  hashtags?: string[];
  location?: string;
  musicTrackId?: string;
  isPublic?: boolean;
}

/**
 * Crea un nuevo post de video
 */
export const createVideoPost = async (postData: CreatePostData): Promise<string> => {
  try {
    const postsRef = collection(db, 'posts');
    
    const newPost = {
      ...postData,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      moderationStatus: 'pending' as const,
      isReported: false,
    };
    
    const docRef = await addDoc(postsRef, newPost);
    
    // Actualizar estadísticas del usuario
    await updateUserStats(postData.userId, { postsCount: increment(1) });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating video post:', error);
    throw error;
  }
};

/**
 * Obtiene posts con paginación y filtros
 */
export const getPosts = async (
  filters: PostFilters = {},
  lastPostId?: string,
  limitCount: number = 10
): Promise<{ posts: VideoPost[]; hasMore: boolean }> => {
  console.log('🔍 getPosts llamado con:', { filters, lastPostId, limitCount });
  
  // TEMPORAL: Usar siempre datos mock para debugging
  console.log('🎭 Usando datos mock directamente (modo debug)');
  const mockResult = generateMockPostsResponse(filters, lastPostId, limitCount);
  console.log('✅ Datos mock generados:', mockResult.posts.length, 'posts');
  return mockResult;
};

/**
 * Obtiene un post específico por ID
 */
export const getPostById = async (postId: string): Promise<VideoPost | null> => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    
    if (!postDoc.exists()) {
      return null;
    }
    
    const data = postDoc.data();
    return {
      id: postDoc.id,
      userId: data.userId,
      user: data.user || {
        id: data.userId,
        username: 'usuario',
        displayName: 'Usuario',
        userType: 'fan',
        verified: false
      },
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      caption: data.caption,
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      musicTrackId: data.musicTrackId,
      musicTrack: data.musicTrack,
      likes: data.likes || 0,
      comments: data.comments || 0,
      shares: data.shares || 0,
      views: data.views || 0,
      isLiked: false,
      isBookmarked: false,
      duration: data.duration,
      aspectRatio: data.dimensions ? data.dimensions.width / data.dimensions.height : 9/16,
      quality: 'HD',
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
          isPublic: data.isPublic !== false,
      isReported: data.isReported || false,
      moderationStatus: data.moderationStatus || 'approved'
    };
  } catch (error) {
    console.error('Error getting post by ID:', error);
    throw error;
  }
};

/**
 * Actualiza un post
 */
export const updatePost = async (postId: string, updates: Partial<CreatePostData>): Promise<void> => {
  // No hacer nada si es un post mock
  if (postId.startsWith('mock_post_')) {
    console.log('🎭 Actualización ignorada para post mock:', postId);
    return;
  }
  
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Elimina un post
 */
export const deletePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    
    // Actualizar estadísticas del usuario
    await updateUserStats(userId, { postsCount: increment(-1) });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Da like a un post
 */
export const likePost = async (postId: string, userId: string): Promise<void> => {
  // No hacer nada si es un post mock
  if (postId.startsWith('mock_post_')) {
    console.log('🎭 Like ignorado para post mock:', postId);
    return;
  }
  
  try {
    const postRef = doc(db, 'posts', postId);
    const likesRef = collection(db, 'posts', postId, 'likes');
    
    // Agregar like
    await addDoc(likesRef, {
      userId,
      createdAt: Timestamp.now()
    });
    
    // Incrementar contador
    await updateDoc(postRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

/**
 * Quita like de un post
 */
export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  // No hacer nada si es un post mock
  if (postId.startsWith('mock_post_')) {
    console.log('🎭 Unlike ignorado para post mock:', postId);
    return;
  }
  
  try {
    const postRef = doc(db, 'posts', postId);
    const likesRef = collection(db, 'posts', postId, 'likes');
    
    // Buscar y eliminar el like
    const likesQuery = query(likesRef, where('userId', '==', userId));
    const likesSnapshot = await getDocs(likesQuery);
    
    const deletePromises = likesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Decrementar contador
    await updateDoc(postRef, {
      likes: increment(-1)
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

/**
 * Incrementa las visualizaciones de un post
 */
export const incrementPostViews = async (postId: string): Promise<void> => {
  // No hacer nada si es un post mock
  if (postId.startsWith('mock_post_')) {
    console.log('🎭 Incremento de views ignorado para post mock:', postId);
    return;
  }
  
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing post views:', error);
    // No lanzar error para no interrumpir la experiencia del usuario
  }
};

/**
 * Reporta un post
 */
export const reportPost = async (postId: string, userId: string, reason: string): Promise<void> => {
  // No hacer nada si es un post mock
  if (postId.startsWith('mock_post_')) {
    console.log('🎭 Reporte ignorado para post mock:', postId);
    return;
  }
  
  try {
    const reportsRef = collection(db, 'reports');
    await addDoc(reportsRef, {
      postId,
      reportedBy: userId,
      reason,
      status: 'pending',
      createdAt: Timestamp.now()
    });
    
    // Marcar post como reportado
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      isReported: true
    });
  } catch (error) {
    console.error('Error reporting post:', error);
    throw error;
  }
};

/**
 * Obtiene posts trending por hashtags
 */
export const getTrendingPosts = async (limitCount: number = 20): Promise<VideoPost[]> => {
  try {
    const postsRef = collection(db, 'posts');
    // Simplificar consulta para desarrollo
    const q = query(
      postsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount * 2) // Obtener más para filtrar después
    );
    
    const snapshot = await getDocs(q);
    const posts: VideoPost[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Filtrar posts públicos y aprobados
      const isPublic = data.isPublic !== false;
      const isApproved = !data.moderationStatus || data.moderationStatus === 'approved';
      
      if (isPublic && isApproved && posts.length < limitCount) {
        posts.push({
          id: doc.id,
          userId: data.userId,
          user: data.user || {
            id: data.userId,
            username: 'usuario',
            displayName: 'Usuario',
            userType: 'fan',
            verified: false
          },
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          caption: data.caption,
          hashtags: data.hashtags || [],
          mentions: data.mentions || [],
          musicTrackId: data.musicTrackId,
          musicTrack: data.musicTrack,
          likes: data.likes || 0,
          comments: data.comments || 0,
          shares: data.shares || 0,
          views: data.views || 0,
          isLiked: false,
          isBookmarked: false,
          duration: data.duration,
          aspectRatio: data.dimensions ? data.dimensions.width / data.dimensions.height : 9/16,
          quality: 'HD',
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          isPublic: data.isPublic !== false,
          isReported: data.isReported || false,
          moderationStatus: data.moderationStatus || 'approved'
        });
      }
    });
    
    // Ordenar por engagement (likes + views) para simular trending
    posts.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
    
    return posts;
  } catch (error) {
    console.error('Error getting trending posts:', error);
    throw error;
  }
};

/**
 * Actualiza estadísticas del usuario
 */
const updateUserStats = async (userId: string, updates: any): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user stats:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
};
/**
 * Genera datos mock para desarrollo cuando Firebase no está disponible
 */
function generateMockPostsResponse(
  filters: PostFilters = {},
  lastPostId?: string,
  limitCount: number = 10
): { posts: VideoPost[]; hasMore: boolean } {
  const mockUsers = [
    { id: '1', username: 'salsero_pro', displayName: 'Carlos Salsa', userType: 'artist', verified: true },
    { id: '2', username: 'bachata_queen', displayName: 'María Bachata', userType: 'artist', verified: true },
    { id: '3', username: 'reggaeton_king', displayName: 'DJ Latino', userType: 'dj', verified: true },
    { id: '4', username: 'dance_academy', displayName: 'Academia Ritmo', userType: 'school', verified: false },
    { id: '5', username: 'fan_latino', displayName: 'Ana López', userType: 'fan', verified: false },
    { id: '6', username: 'merengue_master', displayName: 'Pedro Merengue', userType: 'artist', verified: true },
    { id: '7', username: 'cumbia_lover', displayName: 'Sofia Cumbia', userType: 'dancer', verified: false },
    { id: '8', username: 'salsa_club', displayName: 'Club Salsa Bogotá', userType: 'venue', verified: true },
  ];

  const mockCaptions = [
    '¡Nueva coreografía de salsa! 🔥 Pasos que te van a enamorar #SalsaLoca #BaileLatino #Colombia',
    'Bachata sensual en la playa 🌊 El ritmo que conquista corazones #Bachata #Romance #Playa',
    'Reggaeton que te mueve 💃 Dale que esto está bueno #Reggaeton #Perreo #Urbano',
    'Clase de merengue para principiantes 📚 Aprende con nosotros #Merengue #Clases #Academia',
    'Mi canción favorita del momento 🎵 No puedo parar de escucharla #MúsicaLatina #Favorita',
    'Cumbia colombiana tradicional 🇨🇴 Raíces que no se olvidan #Cumbia #Colombia #Tradición',
    'Salsa en vivo desde Cali 🎺 La capital mundial de la salsa #Salsa #Cali #EnVivo',
    'Bachata dominicana auténtica 🇩🇴 Directo desde Santo Domingo #Bachata #Dominicana #Auténtica',
    'Reggaeton old school 📻 Los clásicos nunca pasan de moda #ReggaetonOldSchool #Clásicos',
    'Merengue que alegra el alma 😊 Música para celebrar la vida #Merengue #Alegría #Celebración',
  ];

  const mockHashtags = [
    ['#SalsaLoca', '#BaileLatino', '#Colombia'],
    ['#Bachata', '#Romance', '#Playa'],
    ['#Reggaeton', '#Perreo', '#Urbano'],
    ['#Merengue', '#Clases', '#Academia'],
    ['#MúsicaLatina', '#Favorita'],
    ['#Cumbia', '#Colombia', '#Tradición'],
    ['#Salsa', '#Cali', '#EnVivo'],
    ['#Bachata', '#Dominicana', '#Auténtica'],
    ['#ReggaetonOldSchool', '#Clásicos'],
    ['#Merengue', '#Alegría', '#Celebración'],
  ];

  // Generar posts mock
  const allMockPosts: VideoPost[] = Array.from({ length: 50 }, (_, i) => {
    const user = mockUsers[i % mockUsers.length];
    const captionIndex = i % mockCaptions.length;
    const caption = mockCaptions[captionIndex];
    const hashtags = mockHashtags[captionIndex];
    
    return {
      id: `mock_post_${i + 1}`,
      userId: user.id,
      user: {
        ...user,
        avatar: `https://picsum.photos/seed/${user.id}/100/100`,
      },
      videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      thumbnailUrl: `https://picsum.photos/seed/video${i}/400/600`,
      caption,
      hashtags,
      mentions: [],
      likes: Math.floor(Math.random() * 50000) + 1000,
      comments: Math.floor(Math.random() * 2000) + 50,
      shares: Math.floor(Math.random() * 500) + 10,
      views: Math.floor(Math.random() * 100000) + 5000,
      isLiked: Math.random() > 0.7,
      isBookmarked: Math.random() > 0.9,
      duration: 15 + Math.floor(Math.random() * 45),
      aspectRatio: 9/16,
      quality: 'HD' as const,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
      updatedAt: new Date(),
      isPublic: true,
      isReported: false,
      moderationStatus: 'approved' as const,
    };
  });

  // Aplicar filtros
  let filteredPosts = allMockPosts;
  
  if (filters.userId) {
    filteredPosts = filteredPosts.filter(post => post.userId === filters.userId);
  }
  
  if (filters.hashtags && filters.hashtags.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      filters.hashtags!.some(tag => post.hashtags.includes(tag))
    );
  }

  // Simular paginación
  let startIndex = 0;
  if (lastPostId) {
    const lastIndex = filteredPosts.findIndex(post => post.id === lastPostId);
    startIndex = lastIndex + 1;
  }

  const posts = filteredPosts.slice(startIndex, startIndex + limitCount);
  const hasMore = startIndex + limitCount < filteredPosts.length;

  return { posts, hasMore };
}