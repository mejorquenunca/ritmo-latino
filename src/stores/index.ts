// Exportar todos los stores
export { useAuthStore } from './authStore';
export { useNotificationStore, createNotificationHelpers } from './notificationStore';
export { useUserSettingsStore, useTheme, useVolume, useLanguage } from './userSettingsStore';

// Importar para uso interno
import { useAuthStore } from './authStore';
import { useNotificationStore } from './notificationStore';
import { useUserSettingsStore } from './userSettingsStore';

// Tipos exportados
export type { Notification } from './notificationStore';
export type { UserPreferences, AppSettings } from './userSettingsStore';

// Hook combinado para acceso fácil a múltiples stores
export const useVasílalaStores = () => {
  const auth = useAuthStore();
  const notifications = useNotificationStore();
  const settings = useUserSettingsStore();

  return {
    auth,
    notifications,
    settings,
  };
};

// Funciones de utilidad para inicializar stores
export const initializeStores = () => {
  try {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;
    
    // Inicializar tema
    const store = useUserSettingsStore.getState();
    if (store && store.appSettings) {
      const { setTheme, setAccentColor } = store;
      const { theme, accentColor } = store.appSettings;
      
      setTheme(theme);
      setAccentColor(accentColor);
    }
  } catch (error) {
    console.warn('Error initializing stores:', error);
  }
};

// Función para limpiar todos los stores (útil para logout)
export const clearAllStores = () => {
  const { clearAuth } = useAuthStore.getState();
  const { clearAllNotifications } = useNotificationStore.getState();
  
  clearAuth();
  clearAllNotifications();
  
  // No limpiamos las configuraciones de usuario porque son preferencias locales
};