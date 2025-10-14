'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUserSettingsStore } from '@/stores/userSettingsStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { initializeStores } from '@/stores';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { loading } = useAuth();
  const { appSettings } = useUserSettingsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Inicializar stores al montar el componente (solo en cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeStores();
    }
  }, []);

  // Cerrar menú móvil cuando cambie la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Mostrar loading mientras se inicializa la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando Vasílala...</p>
        </div>
      </div>
    );
  }

  const isCollapsed = appSettings.sidebarCollapsed;

  const isFeedPage = pathname === '/';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header - Hidden on feed page */}
      {!isFeedPage && (
        <Header 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}

      <div className="flex flex-1">
        {/* Sidebar - Hidden on feed page */}
        {!isFeedPage && (
          <Sidebar 
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${!isFeedPage ? (isCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''}
            ${!isFeedPage ? 'min-h-[calc(100vh-4rem)]' : 'min-h-screen'}
          `}
        >
          {isFeedPage ? (
            children
          ) : (
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {children}
            </div>
          )}
        </main>
      </div>

      {/* Footer - Hidden on feed page */}
      {!isFeedPage && <Footer />}
    </div>
  );
};