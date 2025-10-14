'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VideoUploader } from '@/components/studio/VideoUploader';
import { VasílalaCard, VasílalaCardHeader, VasílalaCardTitle, VasílalaCardContent } from '@/components/ui/vasilala-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Music, 
  Calendar, 
  BarChart3, 
  Upload,
  Mic2
} from 'lucide-react';

export default function StudioPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">
            Estudio de Creación
          </h1>
          <p className="text-gray-400">
            Crea y gestiona tu contenido en Vasílala
          </p>
        </div>

        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="video" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span>Música</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analíticas</span>
            </TabsTrigger>
          </TabsList>

          {/* Video Creation Tab */}
          <TabsContent value="video">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Uploader */}
              <div className="lg:col-span-2">
                <VasílalaCard>
                  <VasílalaCardHeader>
                    <VasílalaCardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Subir Video
                    </VasílalaCardTitle>
                  </VasílalaCardHeader>
                  <VasílalaCardContent>
                    <VideoUploader />
                  </VasílalaCardContent>
                </VasílalaCard>
              </div>

              {/* Tips and Guidelines */}
              <div className="space-y-4">
                <VasílalaCard variant="bordered">
                  <VasílalaCardHeader>
                    <VasílalaCardTitle className="text-lg">
                      Consejos para Videos
                    </VasílalaCardTitle>
                  </VasílalaCardHeader>
                  <VasílalaCardContent className="space-y-3">
                    <div className="text-sm text-gray-300">
                      <h4 className="font-semibold text-yellow-500 mb-2">Formato Recomendado:</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Resolución: 1080x1920 (9:16)</li>
                        <li>• Duración: 15-60 segundos</li>
                        <li>• Formato: MP4, MOV, AVI</li>
                        <li>• Tamaño máximo: 100MB</li>
                      </ul>
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      <h4 className="font-semibold text-yellow-500 mb-2">Mejores Prácticas:</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Usa buena iluminación</li>
                        <li>• Audio claro y sin ruido</li>
                        <li>• Hashtags relevantes</li>
                        <li>• Contenido original</li>
                      </ul>
                    </div>
                  </VasílalaCardContent>
                </VasílalaCard>

                <VasílalaCard variant="glass">
                  <VasílalaCardHeader>
                    <VasílalaCardTitle className="text-lg">
                      Tendencias Actuales
                    </VasílalaCardTitle>
                  </VasílalaCardHeader>
                  <VasílalaCardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500">#SalsaChallenge</span>
                        <span className="text-xs text-gray-400">2.1M videos</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500">#BachataVibes</span>
                        <span className="text-xs text-gray-400">1.8M videos</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-500">#ReggaetonFlow</span>
                        <span className="text-xs text-gray-400">3.2M videos</span>
                      </div>
                    </div>
                  </VasílalaCardContent>
                </VasílalaCard>
              </div>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle className="flex items-center">
                  <Mic2 className="h-5 w-5 mr-2" />
                  Subir Música a TSón
                </VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <div className="text-center py-12">
                  <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Próximamente
                  </h3>
                  <p className="text-gray-400">
                    La funcionalidad de subida de música estará disponible pronto
                  </p>
                </div>
              </VasílalaCardContent>
            </VasílalaCard>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Crear Evento
                </VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Próximamente
                  </h3>
                  <p className="text-gray-400">
                    La creación de eventos estará disponible pronto
                  </p>
                </div>
              </VasílalaCardContent>
            </VasílalaCard>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analíticas de Contenido
                </VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Próximamente
                  </h3>
                  <p className="text-gray-400">
                    Las analíticas detalladas estarán disponibles pronto
                  </p>
                </div>
              </VasílalaCardContent>
            </VasílalaCard>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}