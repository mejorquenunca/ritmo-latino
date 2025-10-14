'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUserSettingsStore } from '@/stores/userSettingsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Crown,
  Music,
  Calendar,
  Home,
  Mic2
} from 'lucide-react';
import { getUserTypeDisplayName } from '@/lib/auth';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { currentUser, userProfile, signOut, isAuthenticated } = useAuth();
  const { unreadCount } = useNotificationStore();
  const { toggleSidebar } = useUserSettingsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar búsqueda
      console.log('Searching for:', searchQuery);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo y menú móvil */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-lg">
                <Mic2 className="h-5 w-5 text-black" />
              </div>
              <span className="hidden sm:inline-block text-xl font-bold vasilala-text-gradient">
                Vasílala
              </span>
            </Link>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar artistas, música, eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </form>
          </div>

          {/* Navegación y usuario */}
          <div className="flex items-center space-x-2">
            {/* Enlaces de navegación rápida (desktop) */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-500">
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Button>
              </Link>
              <Link href="/tson">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-500">
                  <Music className="h-4 w-4 mr-2" />
                  TSón
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Eventos
                </Button>
              </Link>
            </div>

            {isAuthenticated() ? (
              <>
                {/* Notificaciones */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Menú de usuario */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.avatar} alt={userProfile?.displayName} />
                        <AvatarFallback className="bg-yellow-500 text-black">
                          {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userProfile?.displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userProfile?.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {getUserTypeDisplayName(userProfile?.userType || 'fan')}
                          </Badge>
                          {userProfile?.verified && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Verificado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {userProfile?.userType === 'fan' && (
                      <DropdownMenuItem asChild>
                        <Link href="/profile/upgrade" className="cursor-pointer">
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Upgrade Cuenta</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configuraciones</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Botones de autenticación */
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="btn-vasilala-primary">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Centro de notificaciones */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};