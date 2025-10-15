'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getCurrentUserMock,
  signOutMock
} from '@/lib/auth-mock';
import type { VasílalaUser } from '@/types/user';
import { useAuthStore } from '@/stores/authStore';
import { clearAllStores } from '@/stores';

// Tipo para compatibilidad
type FirebaseAuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

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
    // En modo mock, simplemente recargar desde localStorage
    const mockUser = getCurrentUserMock();
    if (mockUser) {
      setUserProfile(mockUser);
      // No necesitamos actualizar currentUser aquí
    }
  };

  const signOut = async () => {
    try {
      await signOutMock();
      clearAllStores(); // Limpiar todos los stores
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Inicializar con usuario mock si existe
    const mockUser = getCurrentUserMock();
    
    if (mockUser) {
      // Crear un objeto compatible con Firebase User
      const firebaseUser = {
        uid: mockUser.id,
        email: mockUser.email,
        displayName: mockUser.displayName,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({})
      } as any;
      
      setCurrentUser(firebaseUser);
      setUserProfile(mockUser);
    }
    
    setInitialized(true);
    setLoading(false);
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