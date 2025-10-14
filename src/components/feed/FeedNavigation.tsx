'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Search, 
  Plus, 
  Heart, 
  User, 
  Menu,
  X,
  Music,
  Calendar,
  Settings
} from 'lucide-react';

export const FeedNavigation: React.FC = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { icon: Home, label: 'Inicio', href: '/', active: true },
    { icon: Search, label: 'Explorar', href: '/explore' },
    { icon: Plus, label: 'Crear', href: '/studio' },
    { icon: Heart, label: 'Actividad', href: '/activity' },
    { icon: User, label: 'Perfil', href: '/profile' },
  ];

  const menuItems = [
    { icon: Music, label: 'TSón', href: '/tson' },
    { icon: Calendar, label: 'Eventos', href: '/events' },
    { icon: Settings, label: 'Configuración', href: '/settings' },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-gray-800">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                  item.active 
                    ? 'text-yellow-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">V</span>
            </div>
            <span className="text-yellow-500 font-bold text-lg">Vasílala</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {isAuthenticated() ? (
              <>
                {/* Profile Avatar */}
                <Link href="/profile">
                  <Avatar className="h-8 w-8 border-2 border-yellow-500">
                    <AvatarImage src={userProfile?.avatar} />
                    <AvatarFallback className="bg-yellow-500 text-black text-xs">
                      {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                {/* Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-white hover:text-yellow-500"
                >
                  {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowMenu(false)}>
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-6">
              {/* User Info */}
              {isAuthenticated() && userProfile && (
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="bg-yellow-500 text-black">
                      {userProfile.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{userProfile.displayName}</p>
                    <p className="text-sm text-gray-400">@{userProfile.username}</p>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-yellow-500 hover:bg-gray-800"
                      onClick={() => setShowMenu(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};