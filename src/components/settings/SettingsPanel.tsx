'use client';

import React from 'react';
import { useUserSettingsStore, useTheme, useVolume, useLanguage } from '@/stores/userSettingsStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Volume2, 
  Bell, 
  Eye, 
  Globe, 
  Palette, 
  Shield, 
  MapPin,
  Accessibility,
  Save,
  RotateCcw
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const {
    preferences,
    appSettings,
    updatePreferences,
    updateAppSettings,
    resetPreferences,
    syncWithServer,
    loading
  } = useUserSettingsStore();

  const {
    settings: notificationSettings,
    updateSettings: updateNotificationSettings
  } = useNotificationStore();

  const { theme, setTheme } = useTheme();
  const { volume, setVolume } = useVolume();
  const { language, setLanguage } = useLanguage();

  const handleSave = async () => {
    await syncWithServer();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-yellow-500">Configuraciones</h1>
          <p className="text-gray-400 mt-1">Personaliza tu experiencia en Vasílala</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetPreferences}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacy">Privacidad</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="accessibility">Accesibilidad</TabsTrigger>
        </TabsList>

        {/* Configuraciones Generales */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Configuraciones Generales
              </CardTitle>
              <CardDescription>
                Idioma, región y configuraciones básicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select 
                    value={preferences.currency} 
                    onValueChange={(currency: any) => updatePreferences({ currency })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select 
                    value={preferences.timezone} 
                    onValueChange={(timezone) => updatePreferences({ timezone })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feed-algorithm">Algoritmo del Feed</Label>
                  <Select 
                    value={preferences.feedAlgorithm} 
                    onValueChange={(feedAlgorithm: any) => updatePreferences({ feedAlgorithm })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recomendado</SelectItem>
                      <SelectItem value="chronological">Cronológico</SelectItem>
                      <SelectItem value="trending">Tendencias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contenido</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="explicit-content">Mostrar contenido explícito</Label>
                    <p className="text-sm text-gray-400">Permitir contenido marcado como explícito</p>
                  </div>
                  <Switch
                    id="explicit-content"
                    checked={preferences.showExplicitContent}
                    onCheckedChange={(showExplicitContent) => updatePreferences({ showExplicitContent })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuraciones de Audio */}
        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Configuraciones de Audio
              </CardTitle>
              <CardDescription>
                Volumen, calidad y reproducción automática
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="volume">Volumen: {Math.round(volume * 100)}%</Label>
                  <Slider
                    id="volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[volume]}
                    onValueChange={([newVolume]) => setVolume(newVolume)}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Calidad de Audio</Label>
                  <Select 
                    value={preferences.quality} 
                    onValueChange={(quality: any) => updatePreferences({ quality })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja (64 kbps)</SelectItem>
                      <SelectItem value="medium">Media (128 kbps)</SelectItem>
                      <SelectItem value="high">Alta (320 kbps)</SelectItem>
                      <SelectItem value="auto">Automática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplay">Reproducción automática</Label>
                    <p className="text-sm text-gray-400">Reproducir automáticamente el siguiente track</p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={preferences.autoplay}
                    onCheckedChange={(autoplay) => updatePreferences({ autoplay })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mini-player">Mini reproductor</Label>
                    <p className="text-sm text-gray-400">Mostrar reproductor flotante</p>
                  </div>
                  <Switch
                    id="mini-player"
                    checked={appSettings.showMiniPlayer}
                    onCheckedChange={(showMiniPlayer) => updateAppSettings({ showMiniPlayer })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuraciones de Notificaciones */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Controla qué notificaciones quieres recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificaciones por email</Label>
                    <p className="text-sm text-gray-400">Recibir notificaciones en tu correo</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.email}
                    onCheckedChange={(email) => updateNotificationSettings({ email })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Notificaciones push</Label>
                    <p className="text-sm text-gray-400">Notificaciones en el navegador</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.push}
                    onCheckedChange={(push) => updateNotificationSettings({ push })}
                  />
                </div>

                <Separator />

                <h4 className="font-semibold">Tipos de notificaciones</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="social-notifications">Actividad social</Label>
                    <p className="text-sm text-gray-400">Likes, comentarios, nuevos seguidores</p>
                  </div>
                  <Switch
                    id="social-notifications"
                    checked={notificationSettings.social}
                    onCheckedChange={(social) => updateNotificationSettings({ social })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="event-notifications">Eventos</Label>
                    <p className="text-sm text-gray-400">Recordatorios y nuevos eventos</p>
                  </div>
                  <Switch
                    id="event-notifications"
                    checked={notificationSettings.events}
                    onCheckedChange={(events) => updateNotificationSettings({ events })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="music-notifications">Música</Label>
                    <p className="text-sm text-gray-400">Nuevas canciones de artistas que sigues</p>
                  </div>
                  <Switch
                    id="music-notifications"
                    checked={notificationSettings.music}
                    onCheckedChange={(music) => updateNotificationSettings({ music })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Marketing</Label>
                    <p className="text-sm text-gray-400">Promociones y noticias de la plataforma</p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={notificationSettings.marketing}
                    onCheckedChange={(marketing) => updateNotificationSettings({ marketing })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuraciones de Privacidad */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacidad y Seguridad
              </CardTitle>
              <CardDescription>
                Controla quién puede ver tu información
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Visibilidad del perfil</Label>
                  <Select 
                    value={preferences.profileVisibility} 
                    onValueChange={(profileVisibility: any) => updatePreferences({ profileVisibility })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="followers">Solo seguidores</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direct-messages">Mensajes directos</Label>
                  <Select 
                    value={preferences.allowDirectMessages} 
                    onValueChange={(allowDirectMessages: any) => updatePreferences({ allowDirectMessages })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Cualquiera</SelectItem>
                      <SelectItem value="followers">Solo seguidores</SelectItem>
                      <SelectItem value="none">Nadie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="online-status">Mostrar estado en línea</Label>
                    <p className="text-sm text-gray-400">Otros usuarios pueden ver cuando estás activo</p>
                  </div>
                  <Switch
                    id="online-status"
                    checked={preferences.showOnlineStatus}
                    onCheckedChange={(showOnlineStatus) => updatePreferences({ showOnlineStatus })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-activity">Mostrar actividad</Label>
                    <p className="text-sm text-gray-400">Mostrar tu actividad reciente en tu perfil</p>
                  </div>
                  <Switch
                    id="show-activity"
                    checked={preferences.showActivity}
                    onCheckedChange={(showActivity) => updatePreferences({ showActivity })}
                  />
                </div>

                <Separator />

                <h4 className="font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ubicación
                </h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-location">Compartir ubicación</Label>
                    <p className="text-sm text-gray-400">Permitir que otros vean tu ubicación</p>
                  </div>
                  <Switch
                    id="share-location"
                    checked={preferences.shareLocation}
                    onCheckedChange={(shareLocation) => updatePreferences({ shareLocation })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="nearby-events">Mostrar eventos cercanos</Label>
                    <p className="text-sm text-gray-400">Ver eventos cerca de tu ubicación</p>
                  </div>
                  <Switch
                    id="nearby-events"
                    checked={preferences.showNearbyEvents}
                    onCheckedChange={(showNearbyEvents) => updatePreferences({ showNearbyEvents })}
                  />
                </div>

                {preferences.showNearbyEvents && (
                  <div>
                    <Label htmlFor="location-radius">Radio de búsqueda: {preferences.locationRadius} km</Label>
                    <Slider
                      id="location-radius"
                      min={5}
                      max={100}
                      step={5}
                      value={[preferences.locationRadius]}
                      onValueChange={([locationRadius]) => updatePreferences({ locationRadius })}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuraciones de Apariencia */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza el aspecto de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Color de acento</Label>
                  <Select 
                    value={appSettings.accentColor} 
                    onValueChange={(accentColor: any) => updateAppSettings({ accentColor })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold">Dorado</SelectItem>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="purple">Morado</SelectItem>
                      <SelectItem value="red">Rojo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebar-collapsed">Barra lateral colapsada</Label>
                    <p className="text-sm text-gray-400">Mantener la barra lateral minimizada</p>
                  </div>
                  <Switch
                    id="sidebar-collapsed"
                    checked={appSettings.sidebarCollapsed}
                    onCheckedChange={(sidebarCollapsed) => updateAppSettings({ sidebarCollapsed })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuraciones de Accesibilidad */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Accessibility className="h-5 w-5 mr-2" />
                Accesibilidad
              </CardTitle>
              <CardDescription>
                Configuraciones para mejorar la accesibilidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="font-size">Tamaño de fuente</Label>
                  <Select 
                    value={preferences.fontSize} 
                    onValueChange={(fontSize: any) => updatePreferences({ fontSize })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeña</SelectItem>
                      <SelectItem value="medium">Mediana</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reduced-motion">Reducir animaciones</Label>
                    <p className="text-sm text-gray-400">Minimizar efectos de movimiento</p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={(reducedMotion) => updatePreferences({ reducedMotion })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-contrast">Alto contraste</Label>
                    <p className="text-sm text-gray-400">Aumentar el contraste para mejor visibilidad</p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={preferences.highContrast}
                    onCheckedChange={(highContrast) => updatePreferences({ highContrast })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};