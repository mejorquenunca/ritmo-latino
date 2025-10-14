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
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Comment } from '@/types/post';

export interface CreateCommentData {
  postId: string;
  userId: string;
  content: string;
  parentId?: string; // Para replies
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

/**
 * Crea un nuevo comentario
 */
export const createComment = async (commentData: CreateCommentData): Promise<string> => {
  try {
    const commentsRef = collection(db, 'posts', commentData.postId, 'comments');
    
    const newComment = {
      ...commentData,
      likes: 0,
      isLiked: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(commentsRef, newComment);
    
    // Incrementar contador de comentarios en el post
    const postRef = doc(db, 'posts', commentData.postId);
    await updateDoc(postRef, {
      comments: increment(1)
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

/**
 * Obtiene comentarios de un post con paginación
 */
export const getComments = async (
  postId: string,
  lastCommentId?: string,
  limitCount: number = 20
): Promise<{ comments: CommentWithReplies[]; hasMore: boolean }> => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    let q = query(
      commentsRef,
      where('parentId', '==', null), // Solo comentarios principales
      orderBy('createdAt', 'desc'),
      limit(limitCount + 1)
    );
    
    // Paginación
    if (lastCommentId) {
      const lastCommentDoc = await getDoc(doc(db, 'posts', postId, 'comments', lastCommentId));
      if (lastCommentDoc.exists()) {
        q = query(q, startAfter(lastCommentDoc));
      }
    }
    
    const snapshot = await getDocs(q);
    const comments: CommentWithReplies[] = [];
    
    // Procesar comentarios principales
    for (let i = 0; i < Math.min(snapshot.docs.length, limitCount); i++) {
      const doc = snapshot.docs[i];
      const data = doc.data();
      
      // Obtener replies para cada comentario
      const replies = await getReplies(postId, doc.id);
      
      comments.push({
        id: doc.id,
        postId: data.postId,
        userId: data.userId,
        user: data.user || {
          id: data.userId,
          username: 'usuario',
          displayName: 'Usuario',
          verified: false
        },
        content: data.content,
        parentId: data.parentId,
        likes: data.likes || 0,
        isLiked: data.isLiked || false,
        replies,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      });
    }
    
    const hasMore = snapshot.docs.length > limitCount;
    
    return { comments, hasMore };
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

/**
 * Obtiene replies de un comentario
 */
export const getReplies = async (postId: string, parentCommentId: string): Promise<CommentWithReplies[]> => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(
      commentsRef,
      where('parentId', '==', parentCommentId),
      orderBy('createdAt', 'asc'),
      limit(50) // Límite de replies por comentario
    );
    
    const snapshot = await getDocs(q);
    const replies: CommentWithReplies[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      replies.push({
        id: doc.id,
        postId: data.postId,
        userId: data.userId,
        user: data.user || {
          id: data.userId,
          username: 'usuario',
          displayName: 'Usuario',
          verified: false
        },
        content: data.content,
        parentId: data.parentId,
        likes: data.likes || 0,
        isLiked: data.isLiked || false,
        replies: [], // Los replies no tienen sub-replies
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      });
    });
    
    return replies;
  } catch (error) {
    console.error('Error getting replies:', error);
    return [];
  }
};

/**
 * Da like a un comentario
 */
export const likeComment = async (postId: string, commentId: string, userId: string): Promise<void> => {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const likesRef = collection(db, 'posts', postId, 'comments', commentId, 'likes');
    
    // Agregar like
    await addDoc(likesRef, {
      userId,
      createdAt: Timestamp.now()
    });
    
    // Incrementar contador
    await updateDoc(commentRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

/**
 * Quita like de un comentario
 */
export const unlikeComment = async (postId: string, commentId: string, userId: string): Promise<void> => {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const likesRef = collection(db, 'posts', postId, 'comments', commentId, 'likes');
    
    // Buscar y eliminar el like
    const likesQuery = query(likesRef, where('userId', '==', userId));
    const likesSnapshot = await getDocs(likesQuery);
    
    const deletePromises = likesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Decrementar contador
    await updateDoc(commentRef, {
      likes: increment(-1)
    });
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
};

/**
 * Actualiza un comentario
 */
export const updateComment = async (postId: string, commentId: string, content: string): Promise<void> => {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    await updateDoc(commentRef, {
      content,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

/**
 * Elimina un comentario
 */
export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    await deleteDoc(commentRef);
    
    // Decrementar contador de comentarios en el post
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: increment(-1)
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

/**
 * Reporta un comentario
 */
export const reportComment = async (
  postId: string, 
  commentId: string, 
  userId: string, 
  reason: string
): Promise<void> => {
  try {
    const reportsRef = collection(db, 'reports');
    await addDoc(reportsRef, {
      type: 'comment',
      postId,
      commentId,
      reportedBy: userId,
      reason,
      status: 'pending',
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error reporting comment:', error);
    throw error;
  }
};

/**
 * Verifica si un usuario ha dado like a un comentario
 */
export const hasUserLikedComment = async (
  postId: string, 
  commentId: string, 
  userId: string
): Promise<boolean> => {
  try {
    const likesRef = collection(db, 'posts', postId, 'comments', commentId, 'likes');
    const q = query(likesRef, where('userId', '==', userId), limit(1));
    const snapshot = await getDocs(q);
    
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking comment like:', error);
    return false;
  }
};

/**
 * Obtiene el número total de comentarios de un post (incluyendo replies)
 */
export const getTotalCommentsCount = async (postId: string): Promise<number> => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const snapshot = await getDocs(commentsRef);
    
    return snapshot.size;
  } catch (error) {
    console.error('Error getting comments count:', error);
    return 0;
  }
};