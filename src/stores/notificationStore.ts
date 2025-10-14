import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'event' | 'follow' | 'like' | 'comment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  relatedId?: string; // ID del evento, post, etc.
  avatar?: string;
}

interface NotificationState {
  // Estado de notificaciones
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  
  // Configuraciones
  settings: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    events: boolean;
    social: boolean;
    music: boolean;
  };

  // Acciones
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;
  setLoading: (loading: boolean) => void;
  
  // Getters
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
  getRecentNotifications: (limit?: number) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      notifications: [],
      unreadCount: 0,
      loading: false,
      
      settings: {
        email: true,
        push: true,
        marketing: false,
        events: true,
        social: true,
        music: true,
      },

      // Acciones
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));

        // Auto-remove después de 30 días
        setTimeout(() => {
          get().removeNotification(notification.id);
        }, 30 * 24 * 60 * 60 * 1000);
      },

      markAsRead: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          );
          
          const unreadCount = notifications.filter(n => !n.read).length;
          
          return { notifications, unreadCount };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.filter(n => n.id !== notificationId);
          const unreadCount = notifications.filter(n => !n.read).length;
          return { notifications, unreadCount };
        });
      },

      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      setLoading: (loading) => {
        set({ loading });
      },

      // Getters
      getUnreadNotifications: () => {
        return get().notifications.filter(n => !n.read);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter(n => n.type === type);
      },

      getRecentNotifications: (limit = 10) => {
        return get().notifications
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'notification-store',
    }
  )
);

// Funciones helper para crear notificaciones específicas
export const createNotificationHelpers = () => {
  const { addNotification } = useNotificationStore.getState();

  return {
    notifyNewFollower: (followerName: string, followerAvatar?: string) => {
      addNotification({
        type: 'follow',
        title: 'Nuevo seguidor',
        message: `${followerName} comenzó a seguirte`,
        avatar: followerAvatar,
        actionUrl: '/profile/followers',
        actionLabel: 'Ver seguidores'
      });
    },

    notifyNewLike: (userName: string, postType: string = 'publicación') => {
      addNotification({
        type: 'like',
        title: 'Nueva reacción',
        message: `A ${userName} le gustó tu ${postType}`,
        actionUrl: '/profile/activity',
        actionLabel: 'Ver actividad'
      });
    },

    notifyNewComment: (userName: string, postType: string = 'publicación') => {
      addNotification({
        type: 'comment',
        title: 'Nuevo comentario',
        message: `${userName} comentó en tu ${postType}`,
        actionUrl: '/profile/activity',
        actionLabel: 'Ver comentario'
      });
    },

    notifyEventReminder: (eventName: string, eventDate: Date) => {
      const timeUntil = eventDate.getTime() - Date.now();
      const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
      
      addNotification({
        type: 'event',
        title: 'Recordatorio de evento',
        message: `${eventName} comienza en ${hoursUntil} horas`,
        actionUrl: '/events',
        actionLabel: 'Ver evento'
      });
    },

    notifyVerificationUpdate: (status: 'approved' | 'rejected', userType: string) => {
      const isApproved = status === 'approved';
      addNotification({
        type: isApproved ? 'success' : 'warning',
        title: `Verificación ${isApproved ? 'aprobada' : 'rechazada'}`,
        message: isApproved 
          ? `Tu cuenta como ${userType} ha sido verificada`
          : `Tu solicitud de verificación como ${userType} fue rechazada`,
        actionUrl: '/profile',
        actionLabel: 'Ver perfil'
      });
    },

    notifySystemUpdate: (title: string, message: string) => {
      addNotification({
        type: 'info',
        title,
        message,
        actionUrl: '/help',
        actionLabel: 'Más información'
      });
    },
  };
};