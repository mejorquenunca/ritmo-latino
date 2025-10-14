'use client';

import React, { useState } from 'react';
import { useNotificationStore, createNotificationHelpers } from '@/stores/notificationStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings,
  Heart,
  MessageCircle,
  UserPlus,
  Calendar,
  Music,
  Info,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Notification } from '@/stores/notificationStore';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadNotifications,
    getNotificationsByType,
    getRecentNotifications,
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState('all');

  const getNotificationIcon = (type: Notification['type']) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (type) {
      case 'like':
        return <Heart {...iconProps} className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'event':
        return <Calendar {...iconProps} className="h-4 w-4 text-purple-500" />;
      case 'success':
        return <CheckCircle {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <X {...iconProps} className="h-4 w-4 text-red-500" />;
      default:
        return <Info {...iconProps} className="h-4 w-4 text-blue-500" />;
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return getUnreadNotifications();
      case 'social':
        return [...getNotificationsByType('like'), ...getNotificationsByType('comment'), ...getNotificationsByType('follow')];
      case 'events':
        return getNotificationsByType('event');
      case 'system':
        return [...getNotificationsByType('info'), ...getNotificationsByType('success'), ...getNotificationsByType('warning'), ...getNotificationsByType('error')];
      default:
        return getRecentNotifications(50);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  if (!isOpen) return null;

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellRing className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                title="Marcar todas como leídas"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {unreadCount > 0 
              ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
              : 'Todas las notificaciones están al día'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
              <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Sin leer
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs h-4 w-4 p-0">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
              <TabsTrigger value="events" className="text-xs">Eventos</TabsTrigger>
            </TabsList>

            <div className="max-h-96 overflow-y-auto">
              <TabsContent value={activeTab} className="mt-0">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay notificaciones</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 mx-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-800/50 ${
                          !notification.read ? 'bg-yellow-500/10 border-l-2 border-yellow-500' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {notification.avatar ? (
                              <img 
                                src={notification.avatar} 
                                alt="" 
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              getNotificationIcon(notification.type)
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatDistanceToNow(notification.timestamp, { 
                                    addSuffix: true, 
                                    locale: es 
                                  })}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    title="Marcar como leída"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {notification.actionLabel && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                {notification.actionLabel}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                className="w-full text-xs"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Limpiar todas las notificaciones
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Hook para usar las notificaciones fácilmente
export const useNotifications = () => {
  const store = useNotificationStore();
  const helpers = createNotificationHelpers();
  
  return {
    ...store,
    ...helpers,
  };
};