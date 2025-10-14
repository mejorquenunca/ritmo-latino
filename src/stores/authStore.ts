import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { VasílalaUser } from '@/types/user';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthState {
  // Estado de autenticación
  currentUser: FirebaseUser | null;
  userProfile: VasílalaUser | null;
  loading: boolean;
  initialized: boolean;

  // Configuraciones de sesión
  rememberMe: boolean;
  lastLoginTime: Date | null;
  
  // Acciones
  setCurrentUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: VasílalaUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setRememberMe: (remember: boolean) => void;
  updateUserProfile: (updates: Partial<VasílalaUser>) => void;
  clearAuth: () => void;
  
  // Getters computados
  isAuthenticated: () => boolean;
  isVerified: () => boolean;
  canUploadMusic: () => boolean;
  canCreateEvents: () => boolean;
  canSellTickets: () => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        currentUser: null,
        userProfile: null,
        loading: true,
        initialized: false,
        rememberMe: false,
        lastLoginTime: null,

        // Acciones
        setCurrentUser: (user) => {
          set({ 
            currentUser: user,
            lastLoginTime: user ? new Date() : null
          });
        },

        setUserProfile: (profile) => {
          set({ userProfile: profile });
        },

        setLoading: (loading) => {
          set({ loading });
        },

        setInitialized: (initialized) => {
          set({ initialized });
        },

        setRememberMe: (remember) => {
          set({ rememberMe: remember });
        },

        updateUserProfile: (updates) => {
          const { userProfile } = get();
          if (userProfile) {
            set({
              userProfile: {
                ...userProfile,
                ...updates,
                updatedAt: new Date()
              }
            });
          }
        },

        clearAuth: () => {
          set({
            currentUser: null,
            userProfile: null,
            loading: false,
            lastLoginTime: null
          });
        },

        // Getters computados
        isAuthenticated: () => {
          const { currentUser } = get();
          return !!currentUser;
        },

        isVerified: () => {
          const { userProfile } = get();
          return userProfile?.verified || false;
        },

        canUploadMusic: () => {
          const { userProfile } = get();
          if (!userProfile || !userProfile.verified) return false;
          return ['artist', 'dj', 'school'].includes(userProfile.userType);
        },

        canCreateEvents: () => {
          const { userProfile } = get();
          if (!userProfile || !userProfile.verified) return false;
          return ['artist', 'dj', 'dancer', 'school', 'venue', 'organizer'].includes(userProfile.userType);
        },

        canSellTickets: () => {
          const { userProfile } = get();
          if (!userProfile || !userProfile.verified) return false;
          return ['artist', 'dj', 'dancer', 'school', 'venue', 'organizer'].includes(userProfile.userType);
        },

        hasPermission: (permission: string) => {
          const { userProfile } = get();
          if (!userProfile) return false;

          // Mapeo de permisos
          const permissions = {
            'upload_music': get().canUploadMusic(),
            'create_events': get().canCreateEvents(),
            'sell_tickets': get().canSellTickets(),
            'professional_page': userProfile.userType !== 'fan',
            'admin_panel': userProfile.userType === 'organizer', // Temporal para demo
          };

          return permissions[permission as keyof typeof permissions] || false;
        },
      }),
      {
        name: 'vasilala-auth-storage',
        partialize: (state) => ({
          rememberMe: state.rememberMe,
          lastLoginTime: state.lastLoginTime,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);