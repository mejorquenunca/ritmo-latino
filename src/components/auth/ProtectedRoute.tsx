'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkUserPermission } from '@/lib/firebase';
import { USER_PERMISSIONS } from '@/types/user';
import type { UserType } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType[];
  requiredPermission?: keyof typeof USER_PERMISSIONS.fan;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
  requiredPermission,
  fallback,
}) => {
  const { currentUser, userProfile, loading } = useAuth();

  // Mostrar loading mientras se carga la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!currentUser || !userProfile) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-300 mb-6">
            Necesitas iniciar sesión para acceder a esta página.
          </p>
          <a 
            href="/login" 
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  // Verificar tipo de usuario requerido
  if (requiredUserType && !requiredUserType.includes(userProfile.userType)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-300 mb-4">
            Esta función está disponible solo para: {requiredUserType.join(', ')}
          </p>
          <p className="text-gray-400 mb-6">
            Tu tipo de cuenta actual: {userProfile.userType}
          </p>
          {userProfile.userType === 'fan' && (
            <a 
              href="/profile/upgrade" 
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Solicitar Upgrade
            </a>
          )}
        </div>
      </div>
    );
  }

  // Verificar permisos específicos
  if (requiredPermission && !checkUserPermission(userProfile, requiredPermission)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Función No Disponible
          </h2>
          <p className="text-gray-300 mb-6">
            No tienes permisos para usar esta función con tu tipo de cuenta actual.
          </p>
          {!userProfile.verified && userProfile.userType !== 'fan' && (
            <p className="text-yellow-400 mb-4">
              Tu cuenta está pendiente de verificación.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return <>{children}</>;
};

// Hook para verificar permisos en componentes
export const usePermissions = () => {
  const { userProfile } = useAuth();

  const hasPermission = (permission: keyof typeof USER_PERMISSIONS.fan): boolean => {
    if (!userProfile) return false;
    return checkUserPermission(userProfile, permission);
  };

  const isUserType = (userType: UserType | UserType[]): boolean => {
    if (!userProfile) return false;
    if (Array.isArray(userType)) {
      return userType.includes(userProfile.userType);
    }
    return userProfile.userType === userType;
  };

  return {
    hasPermission,
    isUserType,
    userProfile,
    isVerified: userProfile?.verified || false,
    userType: userProfile?.userType || 'fan',
  };
};