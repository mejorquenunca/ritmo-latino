'use client';

import React from 'react';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { VasílalaCard, VasílalaCardHeader, VasílalaCardTitle, VasílalaCardContent } from '@/components/ui/vasilala-card';
import { VasílalaInput, VasílalaSearchInput } from '@/components/ui/vasilala-input';
import { VasílalaBadge, UserTypeBadge, VerificationBadge } from '@/components/ui/vasilala-badge';
import { 
  FadeIn, 
  GoldenGlow, 
  GoldenHover, 
  VasílalaLoader, 
  VasílalaSkeleton,
  TypewriterText 
} from '@/components/ui/animations';
import { Separator } from '@/components/ui/separator';
import { Music, Heart, Star, Settings } from 'lucide-react';

export default function ComponentsDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <FadeIn>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold vasilala-text-gradient">
            Componentes de Vasílala
          </h1>
          <TypewriterText 
            text="Demostración del sistema de diseño con tema oscuro y detalles dorados"
            className="text-gray-400 text-lg"
          />
        </div>
      </FadeIn>

      {/* Botones */}
      <FadeIn delay={200}>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Botones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Variantes de Botones</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent className="space-y-3">
                <VasílalaButton variant="primary">
                  Botón Primario
                </VasílalaButton>
                <VasílalaButton variant="secondary">
                  Botón Secundario
                </VasílalaButton>
                <VasílalaButton variant="outline">
                  Botón Outline
                </VasílalaButton>
                <VasílalaButton variant="ghost">
                  Botón Ghost
                </VasílalaButton>
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Botones Especiales</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent className="space-y-3">
                <VasílalaButton variant="gold" glow>
                  <Star className="h-4 w-4 mr-2" />
                  Botón Dorado
                </VasílalaButton>
                <VasílalaButton variant="gradient">
                  <Music className="h-4 w-4 mr-2" />
                  Botón Gradiente
                </VasílalaButton>
                <VasílalaButton 
                  variant="primary" 
                  isLoading={loading}
                  loadingText="Procesando..."
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 2000);
                  }}
                >
                  Botón con Loading
                </VasílalaButton>
              </VasílalaCardContent>
            </VasílalaCard>
          </div>
        </section>
      </FadeIn>

      <Separator className="bg-gray-800" />

      {/* Cards */}
      <FadeIn delay={400}>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Tarjetas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <VasílalaCard variant="default">
              <VasílalaCardHeader>
                <VasílalaCardTitle>Card Default</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                Tarjeta con estilo por defecto
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard variant="elevated" glow>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Card Elevada</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                Tarjeta elevada con brillo dorado
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard variant="bordered">
              <VasílalaCardHeader>
                <VasílalaCardTitle>Card Bordeada</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                Tarjeta con borde dorado
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard variant="glass">
              <VasílalaCardHeader>
                <VasílalaCardTitle>Card Glass</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                Tarjeta con efecto cristal
              </VasílalaCardContent>
            </VasílalaCard>
          </div>
        </section>
      </FadeIn>

      <Separator className="bg-gray-800" />

      {/* Inputs */}
      <FadeIn delay={600}>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Campos de Entrada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Inputs Básicos</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent className="space-y-4">
                <VasílalaInput 
                  label="Nombre de usuario"
                  placeholder="Ingresa tu nombre"
                  hint="Mínimo 3 caracteres"
                />
                <VasílalaInput 
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  success="Email válido"
                />
                <VasílalaInput 
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  error="La contraseña es muy corta"
                />
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Inputs Especiales</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent className="space-y-4">
                <VasílalaSearchInput placeholder="Buscar artistas..." />
                <VasílalaInput 
                  variant="bordered"
                  label="Input Bordeado"
                  placeholder="Con borde dorado"
                  glow
                />
                <VasílalaInput 
                  variant="glass"
                  label="Input Glass"
                  placeholder="Efecto cristal"
                  icon={<Settings className="h-4 w-4" />}
                />
              </VasílalaCardContent>
            </VasílalaCard>
          </div>
        </section>
      </FadeIn>

      <Separator className="bg-gray-800" />

      {/* Badges */}
      <FadeIn delay={800}>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Badges y Etiquetas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Badges de Estado</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <div className="flex flex-wrap gap-2">
                  <VerificationBadge status="verified" />
                  <VerificationBadge status="pending" />
                  <VerificationBadge status="rejected" />
                  <VasílalaBadge variant="premium" glow>Premium</VasílalaBadge>
                  <VasílalaBadge variant="admin">Admin</VasílalaBadge>
                  <VasílalaBadge variant="featured">Destacado</VasílalaBadge>
                  <VasílalaBadge variant="trending">Trending</VasílalaBadge>
                </div>
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Badges de Usuario</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <div className="flex flex-wrap gap-2">
                  <UserTypeBadge userType="fan" />
                  <UserTypeBadge userType="artist" verified />
                  <UserTypeBadge userType="dj" verified />
                  <UserTypeBadge userType="dancer" />
                  <UserTypeBadge userType="school" verified />
                  <UserTypeBadge userType="venue" verified />
                  <UserTypeBadge userType="organizer" verified />
                </div>
              </VasílalaCardContent>
            </VasílalaCard>
          </div>
        </section>
      </FadeIn>

      <Separator className="bg-gray-800" />

      {/* Animaciones */}
      <FadeIn delay={1000}>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Animaciones y Efectos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Brillo Dorado</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <GoldenGlow intensity="high">
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <Heart className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p>Efecto de brillo</p>
                  </div>
                </GoldenGlow>
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Hover Dorado</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent>
                <GoldenHover>
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p>Pasa el mouse aquí</p>
                  </div>
                </GoldenHover>
              </VasílalaCardContent>
            </VasílalaCard>

            <VasílalaCard>
              <VasílalaCardHeader>
                <VasílalaCardTitle>Loading</VasílalaCardTitle>
              </VasílalaCardHeader>
              <VasílalaCardContent className="text-center">
                <VasílalaLoader size="lg" text="Cargando..." />
              </VasílalaCardContent>
            </VasílalaCard>
          </div>
        </section>
      </FadeIn>

      <Separator className="bg-gray-800" />

      {/* Skeletons */}
      <FadeIn delay={1200}>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-500">Skeletons</h2>
          <VasílalaCard>
            <VasílalaCardHeader>
              <VasílalaCardTitle>Estados de Carga</VasílalaCardTitle>
            </VasílalaCardHeader>
            <VasílalaCardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <VasílalaSkeleton variant="circular" className="w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <VasílalaSkeleton variant="text" className="w-3/4" />
                  <VasílalaSkeleton variant="text" className="w-1/2" />
                </div>
              </div>
              <VasílalaSkeleton variant="rectangular" className="w-full h-32" />
              <div className="flex space-x-2">
                <VasílalaSkeleton variant="rectangular" className="w-20 h-8" />
                <VasílalaSkeleton variant="rectangular" className="w-16 h-8" />
              </div>
            </VasílalaCardContent>
          </VasílalaCard>
        </section>
      </FadeIn>
    </div>
  );
}