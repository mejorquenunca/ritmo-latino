'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  createUserProfileDocument, 
  getUserProfile,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type FirebaseAuthUser,
  type VasílalaUser 
} from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { clearAllStores } from '@/stores';

interface AuthContextType {
  currentUser: FirebaseAuthUser | null;
  userProfile: VasílalaUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  
  // Funciones adicionales del store
  isAuthenticated: () => boolean;
  isVerified: () => boolean;
  canUploadMusic: () => boolean;
  canCreateEvents: () => boolean;
  canSellTickets: () => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    currentUser,
    userProfile,
    loading,
    setCurrentUser,
    setUserProfile,
    setLoading,
    setInitialized,
    isAuthenticated,
    isVerified,
    canUploadMusic,
    canCreateEvents,
    canSellTickets,
    hasPermission,
    clearAuth,
  } = useAuthStore();

  const refreshUserProfile = async () => {
    if (currentUser) {
      setLoading(true);
      try {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      clearAllStores(); // Limpiar todos los stores
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        setLoading(true);
        
        try {
          // Crear o actualizar el perfil del usuario
          await createUserProfileDocument(user);
          
          // Obtener el perfil completo
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Marcar como inicializado
          setInitialized(true);
        } catch (error) {
          console.error('Error loading user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        clearAuth();
        setInitialized(true);
      }
    });

    return unsubscribe;
  }, [setCurrentUser, setUserProfile, setLoading, setInitialized, clearAuth]);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signOut,
    refreshUserProfile,
    isAuthenticated,
    isVerified,
    canUploadMusic,
    canCreateEvents,
    canSellTickets,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};