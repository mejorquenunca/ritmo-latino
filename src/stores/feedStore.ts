import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VideoPost, Comment, FeedState } from '@/types/post';
import { getPosts, incrementPostViews } from '@/lib/posts';

interface FeedStore extends FeedState {
  // Actions
  setPosts: (posts: VideoPost[]) => void;
  addPosts: (posts: VideoPost[]) => void;
  updatePost: (postId: string, updates: Partial<VideoPost>) => void;
  removePost: (postId: string) => void;
  setCurrentIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  
  // Post interactions
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  bookmarkPost: (postId: string) => void;
  unbookmarkPost: (postId: string) => void;
  incrementViews: (postId: string) => void;
  incrementShares: (postId: string) => void;
  
  // Comments
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeComment: (postId: string, commentId: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  
  // Feed management
  loadMorePosts: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  
  // Getters
  getCurrentPost: () => VideoPost | null;
  getPostById: (postId: string) => VideoPost | null;
  getPostsByUser: (userId: string) => VideoPost[];
}

export const useFeedStore = create<FeedStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      posts: [],
      loading: false,
      hasMore: true,
      currentIndex: 0,
      error: null,

      // Actions
      setPosts: (posts) => set({ posts }),
      
      addPosts: (newPosts) => set((state) => ({
        posts: [...state.posts, ...newPosts]
      })),
      
      updatePost: (postId, updates) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId ? { ...post, ...updates } : post
        )
      })),
      
      removePost: (postId) => set((state) => ({
        posts: state.posts.filter(post => post.id !== postId)
      })),
      
      setCurrentIndex: (index) => set({ currentIndex: index }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setHasMore: (hasMore) => set({ hasMore }),

      // Post interactions
      likePost: (postId) => {
        // Optimistic update
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  isLiked: true, 
                  likes: post.likes + 1 
                }
              : post
          )
        }));
        
        // TODO: Call API in background
        // likePostAPI(postId, userId).catch(() => {
        //   // Revert on error
        //   get().unlikePost(postId);
        // });
      },
      
      unlikePost: (postId) => {
        // Optimistic update
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  isLiked: false, 
                  likes: Math.max(0, post.likes - 1) 
                }
              : post
          )
        }));
        
        // TODO: Call API in background
        // unlikePostAPI(postId, userId).catch(() => {
        //   // Revert on error
        //   get().likePost(postId);
        // });
      },
      
      bookmarkPost: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, isBookmarked: true }
            : post
        )
      })),
      
      unbookmarkPost: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, isBookmarked: false }
            : post
        )
      })),
      
      incrementViews: (postId) => {
        // Optimistic update
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId 
              ? { ...post, views: post.views + 1 }
              : post
          )
        }));
        
        // Call API in background
        incrementPostViews(postId).catch(console.error);
      },
      
      incrementShares: (postId) => set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, shares: post.shares + 1 }
            : post
        )
      })),

      // Comments
      addComment: (postId, commentData) => {
        const newComment: Comment = {
          ...commentData,
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId 
              ? { ...post, comments: post.comments + 1 }
              : post
          )
        }));
      },
      
      removeComment: (postId, commentId) => {
        set((state) => ({
          posts: state.posts.map(post => 
            post.id === postId 
              ? { ...post, comments: Math.max(0, post.comments - 1) }
              : post
          )
        }));
      },
      
      likeComment: (postId, commentId) => {
        // Implementation for comment likes
        console.log('Like comment:', postId, commentId);
      },

      // Feed management
      loadMorePosts: async () => {
        const { loading, hasMore, posts } = get();
        if (loading || !hasMore) return;

        set({ loading: true, error: null });
        
        try {
          const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : undefined;
          const result = await getPosts({}, lastPostId, 10);
          
          get().addPosts(result.posts);
          set({ hasMore: result.hasMore });
        } catch (error) {
          console.error('Error loading more posts:', error);
          set({ error: 'Error cargando más posts' });
        } finally {
          set({ loading: false });
        }
      },
      
      refreshFeed: async () => {
        console.log('🔄 Iniciando refreshFeed...');
        set({ loading: true, error: null, currentIndex: 0 });
        
        try {
          console.log('📡 Llamando a getPosts...');
          const result = await getPosts({}, undefined, 20);
          console.log('✅ getPosts exitoso, posts recibidos:', result.posts.length);
          set({ 
            posts: result.posts, 
            hasMore: result.hasMore,
            currentIndex: 0 
          });
        } catch (error) {
          console.error('❌ Error refreshing feed:', error);
          set({ error: 'Error cargando el feed' });
        } finally {
          set({ loading: false });
          console.log('🏁 refreshFeed completado');
        }
      },

      // Getters
      getCurrentPost: () => {
        const { posts, currentIndex } = get();
        return posts[currentIndex] || null;
      },
      
      getPostById: (postId) => {
        const { posts } = get();
        return posts.find(post => post.id === postId) || null;
      },
      
      getPostsByUser: (userId) => {
        const { posts } = get();
        return posts.filter(post => post.userId === userId);
      },
    }),
    {
      name: 'feed-store',
    }
  )
);

