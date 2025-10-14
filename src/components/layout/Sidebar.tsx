'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUserSettingsStore } from '@/stores/userSettingsStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Music, 
  Calendar, 
  Search, 
  TrendingUp, 
  Users, 
  Heart, 
  Bookmark, 
  Settings, 
  Upload, 
  Mic2, 
  Radio, 
  MapPin, 
  Building, 
  GraduationCap,
  Crown,
  Shield,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getUserTypeDisplayName } from '@/lib/auth';
import type { UserType } from '@/types/user';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  requiredUserTypes?: UserType[];
  requiresVerification?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, className }) => {
  const pathname = usePathname();
  const { userProfile, isAuthenticated, hasPermission } = useAuth();
  const { appSettings, toggleSidebar } = useUserSettingsStore();

  const isCollapsed = appSettings.sidebarCollapsed;

  // Navegación principal
  const mainNavItems: NavItem[] = [
    {
      label: 'Inicio',
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: 'Explorar',
      href: '/explore',
      icon: <Search className="h-5 w-5" />,
    },
    {
      label: 'Tendencias',
      href: '/trending',
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  // Navegación de música
  const musicNavItems: NavItem[] = [
    {
      label: 'TSón',
      href: '/tson',
      icon: <Music className="h-5 w-5" />,
    },
    {
      label: 'Mi Música',
      href: '/tson/library',
      icon: <Heart className="h-5 w-5" />,
    },
    {
      label: 'Playlists',
      href: '/tson/playlists',
      icon: <Bookmark className="h-5 w-5" />,
    },
    {
      label: 'Radio',
      href: '/tson/radio',
      icon: <Radio className="h-5 w-5" />,
    },
  ];

  // Navegación de eventos
  const eventNavItems: NavItem[] = [
    {
      label: 'Eventos',
      href: '/events',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: 'Mis Eventos',
      href: '/events/my-events',
      icon: <Bookmark className="h-5 w-5" />,
    },
    {
      label: 'Cerca de mí',
      href: '/events/nearby',
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  // Navegación de creadores (solo para usuarios verificados)
  const creatorNavItems: NavItem[] = [
    {
      label: 'Subir Música',
      href: '/studio/music',
      icon: <Upload className="h-5 w-5" />,
      requiredUserTypes: ['artist', 'dj', 'school'],
      requiresVerification: true,
    },
    {
      label: 'Crear Evento',
      href: '/studio/events',
      icon: <Plus className="h-5 w-5" />,
      requiredUserTypes: ['artist', 'dj', 'dancer', 'school', 'venue', 'organizer'],
      requiresVerification: true,
    },
    {
      label: 'Estudio',
      href: '/studio',
      icon: <Mic2 className="h-5 w-5" />,
      requiredUserTypes: ['artist', 'dj', 'dancer', 'school', 'venue', 'organizer'],
    },
    {
      label: 'Analíticas',
      href: '/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      requiredUserTypes: ['artist', 'dj', 'dancer', 'school', 'venue', 'organizer'],
      requiresVerification: true,
    },
  ];

  // Navegación de administración
  const adminNavItems: NavItem[] = [
    {
      label: 'Panel Admin',
      href: '/admin',
      icon: <Shield className="h-5 w-5" />,
      requiredUserTypes: ['organizer'], // Temporal para demo
    },
    {
      label: 'Verificaciones',
      href: '/admin/verifications',
      icon: <Users className="h-5 w-5" />,
      requiredUserTypes: ['organizer'],
    },
  ];

  const shouldShowNavItem = (item: NavItem): boolean => {
    if (!isAuthenticated()) {
      return !item.requiredUserTypes; // Solo mostrar items públicos
    }

    if (item.requiredUserTypes && userProfile) {
      const hasRequiredType = item.requiredUserTypes.includes(userProfile.userType);
      if (!hasRequiredType) return false;
      
      if (item.requiresVerification && !userProfile.verified) {
        return false;
      }
    }

    return true;
  };

  const isActiveRoute = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavSection: React.FC<{ title: string; items: NavItem[] }> = ({ title, items }) => {
    const visibleItems = items.filter(shouldShowNavItem);
    
    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-2">
        {!isCollapsed && (
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
        )}
        <nav className="space-y-1">
          {visibleItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`nav-item ${isActiveRoute(item.href) ? 'active' : ''} ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] 
          ${isCollapsed ? 'w-16' : 'w-64'} 
          transform transition-all duration-300 ease-in-out
          bg-gray-900 border-r border-gray-800
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:sticky lg:top-16
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Toggle button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-yellow-500">Navegación</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden lg:flex"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navegación principal */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <NavSection title="Principal" items={mainNavItems} />
            
            <Separator className="bg-gray-800" />
            
            <NavSection title="Música" items={musicNavItems} />
            
            <Separator className="bg-gray-800" />
            
            <NavSection title="Eventos" items={eventNavItems} />

            {/* Sección de creadores */}
            {isAuthenticated() && userProfile?.userType !== 'fan' && (
              <>
                <Separator className="bg-gray-800" />
                <NavSection title="Creador" items={creatorNavItems} />
              </>
            )}

            {/* Sección de administración */}
            {isAuthenticated() && hasPermission('admin_panel') && (
              <>
                <Separator className="bg-gray-800" />
                <NavSection title="Administración" items={adminNavItems} />
              </>
            )}

            {/* Upgrade para fans */}
            {isAuthenticated() && userProfile?.userType === 'fan' && (
              <>
                <Separator className="bg-gray-800" />
                <div className="space-y-2">
                  {!isCollapsed && (
                    <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Cuenta
                    </h3>
                  )}
                  <Link href="/profile/upgrade">
                    <div className={`nav-item ${isCollapsed ? 'justify-center px-2' : ''}`}>
                      <Crown className="h-5 w-5" />
                      {!isCollapsed && <span>Upgrade Cuenta</span>}
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-800">
            {isAuthenticated() && userProfile && !isCollapsed && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">
                      {userProfile.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {userProfile.displayName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getUserTypeDisplayName(userProfile.userType)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Link href="/settings">
              <div className={`nav-item mt-2 ${isCollapsed ? 'justify-center px-2' : ''}`}>
                <Settings className="h-5 w-5" />
                {!isCollapsed && <span>Configuraciones</span>}
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};