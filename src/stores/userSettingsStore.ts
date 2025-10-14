import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UserPreferences {
  // Configuraciones de reproducción
  autoplay: boolean;
  volume: number;
  quality: 'low' | 'medium' | 'high' | 'auto';
  
  // Configuraciones de feed
  showExplicitContent: boolean;
  preferredGenres: string[];
  feedAlgorithm: 'chronological' | 'recommended' | 'trending';
  
  // Configuraciones de privacidad
  profileVisibility: 'public' | 'followers' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: 'everyone' | 'followers' | 'none';
  showActivity: boolean;
  
  // Configuraciones de ubicación
  shareLocation: boolean;
  showNearbyEvents: boolean;
  locationRadius: number; // en km
  
  // Configuraciones de idioma y región
  language: 'es' | 'en' | 'pt';
  timezone: string;
  currency: 'USD' | 'COP' | 'MXN' | 'EUR';
  
  // Configuraciones de accesibilidad
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface AppSettings {
  // Configuraciones de tema
  theme: 'dark' | 'light' | 'auto';
  accentColor: 'gold' | 'blue' | 'green' | 'purple' | 'red';
  
  // Configuraciones de navegación
  sidebarCollapsed: boolean;
  showMiniPlayer: boolean;
  
  // Configuraciones de desarrollo (solo para admins)
  debugMode: boolean;
  showPerformanceMetrics: boolean;
}

interface UserSettingsState {
  // Estado
  preferences: UserPreferences;
  appSettings: AppSettings;
  loading: boolean;
  lastSyncTime: Date | null;
  
  // Acciones para preferencias
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Acciones para configuraciones de app
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  setTheme: (theme: AppSettings['theme']) => void;
  setAccentColor: (color: AppSettings['accentColor']) => void;
  
  // Acciones de sincronización
  setLoading: (loading: boolean) => void;
  syncWithServer: () => Promise<void>;
  
  // Getters
  getPreference: <K extends keyof UserPreferences>(key: K) => UserPreferences[K];
  getAppSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K];
  isFeatureEnabled: (feature: string) => boolean;
}

const defaultPreferences: UserPreferences = {
  // Reproducción
  autoplay: true,
  volume: 0.8,
  quality: 'auto',
  
  // Feed
  showExplicitContent: false,
  preferredGenres: ['salsa', 'bachata', 'reggaeton'],
  feedAlgorithm: 'recommended',
  
  // Privacidad
  profileVisibility: 'public',
  showOnlineStatus: true,
  allowDirectMessages: 'followers',
  showActivity: true,
  
  // Ubicación
  shareLocation: false,
  showNearbyEvents: true,
  locationRadius: 50,
  
  // Idioma
  language: 'es',
  timezone: 'America/Bogota',
  currency: 'COP',
  
  // Accesibilidad
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
};

const defaultAppSettings: AppSettings = {
  theme: 'dark',
  accentColor: 'gold',
  sidebarCollapsed: false,
  showMiniPlayer: true,
  debugMode: false,
  showPerformanceMetrics: false,
};

export const useUserSettingsStore = create<UserSettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        preferences: defaultPreferences,
        appSettings: defaultAppSettings,
        loading: false,
        lastSyncTime: null,

        // Acciones para preferencias
        updatePreferences: (updates) => {
          set((state) => ({
            preferences: { ...state.preferences, ...updates },
            lastSyncTime: new Date(),
          }));
          
          // Aquí podrías sincronizar con el servidor
          // get().syncWithServer();
        },

        resetPreferences: () => {
          set({
            preferences: defaultPreferences,
            lastSyncTime: new Date(),
          });
        },

        // Acciones para configuraciones de app
        updateAppSettings: (updates) => {
          set((state) => ({
            appSettings: { ...state.appSettings, ...updates }
          }));
        },

        toggleSidebar: () => {
          set((state) => ({
            appSettings: {
              ...state.appSettings,
              sidebarCollapsed: !state.appSettings.sidebarCollapsed
            }
          }));
        },

        setTheme: (theme) => {
          set((state) => ({
            appSettings: { ...state.appSettings, theme }
          }));
          
          // Aplicar tema al documento
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            
            if (theme === 'auto') {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              root.classList.add(prefersDark ? 'dark' : 'light');
            } else {
              root.classList.add(theme);
            }
          }
        },

        setAccentColor: (accentColor) => {
          set((state) => ({
            appSettings: { ...state.appSettings, accentColor }
          }));
          
          // Aplicar color de acento
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            const colors = {
              gold: '#D4AF37',
              blue: '#3B82F6',
              green: '#10B981',
              purple: '#8B5CF6',
              red: '#EF4444',
            };
            root.style.setProperty('--accent-color', colors[accentColor]);
          }
        },

        // Acciones de sincronización
        setLoading: (loading) => {
          set({ loading });
        },

        syncWithServer: async () => {
          // Implementar sincronización con Firebase
          set({ loading: true });
          
          try {
            // Aquí harías la llamada a Firebase para sincronizar
            // const { preferences } = get();
            // await updateUserPreferences(userId, preferences);
            
            set({ lastSyncTime: new Date() });
          } catch (error) {
            console.error('Error syncing preferences:', error);
          } finally {
            set({ loading: false });
          }
        },

        // Getters
        getPreference: (key) => {
          return get().preferences[key];
        },

        getAppSetting: (key) => {
          return get().appSettings[key];
        },

        isFeatureEnabled: (feature) => {
          const { preferences, appSettings } = get();
          
          // Mapeo de características
          const features = {
            'autoplay': preferences.autoplay,
            'explicit_content': preferences.showExplicitContent,
            'location_sharing': preferences.shareLocation,
            'direct_messages': preferences.allowDirectMessages !== 'none',
            'mini_player': appSettings.showMiniPlayer,
            'debug_mode': appSettings.debugMode,
          };
          
          return features[feature as keyof typeof features] || false;
        },
      }),
      {
        name: 'vasilala-user-settings',
        partialize: (state) => ({
          preferences: state.preferences,
          appSettings: state.appSettings,
        }),
      }
    ),
    {
      name: 'user-settings-store',
    }
  )
);

// Hook personalizado para configuraciones específicas
export const useTheme = () => {
  const { appSettings, setTheme } = useUserSettingsStore();
  return {
    theme: appSettings.theme,
    setTheme,
  };
};

export const useVolume = () => {
  const { preferences, updatePreferences } = useUserSettingsStore();
  return {
    volume: preferences.volume,
    setVolume: (volume: number) => updatePreferences({ volume }),
  };
};

export const useLanguage = () => {
  const { preferences, updatePreferences } = useUserSettingsStore();
  return {
    language: preferences.language,
    setLanguage: (language: UserPreferences['language']) => updatePreferences({ language }),
  };
};