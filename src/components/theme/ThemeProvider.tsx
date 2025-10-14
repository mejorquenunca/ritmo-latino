'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useUserSettingsStore } from '@/stores/userSettingsStore';

type Theme = 'dark' | 'light' | 'auto';
type AccentColor = 'gold' | 'blue' | 'green' | 'purple' | 'red';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { appSettings, setTheme: setStoreTheme, setAccentColor: setStoreAccentColor } = useUserSettingsStore();
  const [isDark, setIsDark] = React.useState(true);

  const setTheme = (theme: Theme) => {
    setStoreTheme(theme);
    applyTheme(theme);
  };

  const setAccentColor = (color: AccentColor) => {
    setStoreAccentColor(color);
    applyAccentColor(color);
  };

  const applyTheme = (theme: Theme) => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let shouldBeDark = theme === 'dark';
    
    if (theme === 'auto') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    root.classList.add(shouldBeDark ? 'dark' : 'light');
    setIsDark(shouldBeDark);

    // Aplicar meta theme-color para móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', shouldBeDark ? '#121212' : '#ffffff');
    }
  };

  const applyAccentColor = (color: AccentColor) => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    
    const colors = {
      gold: {
        primary: '45 100% 51%', // #D4AF37
        primaryForeground: '0 0% 0%',
        ring: '45 100% 51%',
      },
      blue: {
        primary: '217 91% 60%', // #3B82F6
        primaryForeground: '0 0% 100%',
        ring: '217 91% 60%',
      },
      green: {
        primary: '142 76% 36%', // #10B981
        primaryForeground: '0 0% 100%',
        ring: '142 76% 36%',
      },
      purple: {
        primary: '262 83% 58%', // #8B5CF6
        primaryForeground: '0 0% 100%',
        ring: '262 83% 58%',
      },
      red: {
        primary: '0 84% 60%', // #EF4444
        primaryForeground: '0 0% 100%',
        ring: '0 84% 60%',
      },
    };

    const selectedColors = colors[color];
    
    root.style.setProperty('--primary', selectedColors.primary);
    root.style.setProperty('--primary-foreground', selectedColors.primaryForeground);
    root.style.setProperty('--ring', selectedColors.ring);

    // Actualizar colores específicos de Vasílala
    root.style.setProperty('--vasilala-accent', selectedColors.primary);
  };

  // Inicializar tema al montar
  useEffect(() => {
    applyTheme(appSettings.theme);
    applyAccentColor(appSettings.accentColor);

    // Escuchar cambios en el tema del sistema
    if (appSettings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('auto');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [appSettings.theme, appSettings.accentColor]);

  const value: ThemeContextType = {
    theme: appSettings.theme,
    accentColor: appSettings.accentColor,
    setTheme,
    setAccentColor,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para detectar preferencias de movimiento reducido
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook para aplicar configuraciones de accesibilidad
export const useAccessibilitySettings = () => {
  const { preferences } = useUserSettingsStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;

    // Aplicar configuraciones de accesibilidad
    if (preferences.reducedMotion || prefersReducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.classList.add('reduce-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.classList.remove('reduce-motion');
    }

    // Alto contraste
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Tamaño de fuente
    const fontSizeClasses: Record<string, string> = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };
    
    // Remover clases anteriores
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    root.classList.add(fontSizeClasses[preferences.fontSize]);

  }, [preferences.reducedMotion, preferences.highContrast, preferences.fontSize, prefersReducedMotion]);
};