'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { VasílalaCard, VasílalaCardContent, VasílalaCardHeader, VasílalaCardTitle } from '@/components/ui/vasilala-card';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { VasílalaInput } from '@/components/ui/vasilala-input';
import { Badge } from '@/components/ui/badge';
import { useEventsStore } from '@/stores/eventsStore';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Share,
  Ticket,
  Search,
  Filter,
  TrendingUp,
  Music,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data para demostración
  const mockEvents = [
    {
      id: '1',
      title: 'Festival de Salsa Internacional',
      description: 'El evento más grande de salsa en Latinoamérica. Ven y disfruta de los mejores artistas internacionales.',
      organizerId: 'org1',
      organizer: {
        id: 'org1',
        name: 'Eventos Latinos SA',
        username: 'eventos_latinos',
        userType: 'organizer' as const,
        verified: true
      },
      category: 'festival' as const,
      genres: ['Salsa', 'Son', 'Mambo'],
      artists: [
        { id: 'a1', name: 'Gilberto Santa Rosa', role: 'headliner' as const, verified: true },
        { id: 'a2', name: 'Marc Anthony', role: 'headliner' as const, verified: true }
      ],
      venue: {
        name: 'Coliseo de Puerto Rico',
        address: 'Av. Roosevelt 500',
        city: 'San Juan',
        country: 'Puerto Rico'
      },
      startDate: new Date('2024-03-15T20:00:00'),
      endDate: new Date('2024-03-15T23:59:00'),
      timezone: 'America/Puerto_Rico',
      tickets: [
        { id: 't1', name: 'General', price: 75, currency: 'USD', quantity: 1000, sold: 650, available: 350 },
        { id: 't2', name: 'VIP', price: 150, currency: 'USD', quantity: 200, sold: 180, available: 20 }
      ],
      capacity: 1200,
      soldTickets: 830,
      availableTickets: 370,
      coverImage: 'https://picsum.photos/seed/event1/800/400',
      images: [],
      isPublic: true,
      requiresApproval: false,
      status: 'published' as const,
      moderationStatus: 'approved' as const,
      views: 15420,
      interested: 2340,
      attending: 830,
      shares: 156,
      isInterested: false,
      isAttending: false,
      hasTicket: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      title: 'Noche de Bachata Romántica',
      description: 'Una noche íntima con los mejores exponentes de la bachata romántica.',
      organizerId: 'org2',
      organizer: {
        id: 'org2',
        name: 'Club Tropical',
        username: 'club_tropical',
        userType: 'local' as const,
        verified: true
      },
      category: 'club_night' as const,
      genres: ['Bachata'],
      artists: [
        { id: 'a3', name: 'Romeo Santos', role: 'headliner' as const, verified: true },
        { id: 'a4', name: 'Prince Royce', role: 'support' as const, verified: true }
      ],
      venue: {
        name: 'Club Tropical',
        address: 'Calle 85 #15-20',
        city: 'Bogotá',
        country: 'Colombia'
      },
      startDate: new Date('2024-02-28T21:00:00'),
      endDate: new Date('2024-03-01T03:00:00'),
      timezone: 'America/Bogota',
      tickets: [
        { id: 't3', name: 'Entrada General', price: 45, currency: 'USD', quantity: 300, sold: 180, available: 120 },
        { id: 't4', name: 'Mesa VIP', price: 120, currency: 'USD', quantity: 50, sold: 35, available: 15 }
      ],
      capacity: 350,
      soldTickets: 215,
      availableTickets: 135,
      coverImage: 'https://picsum.photos/seed/event2/800/400',
      images: [],
      isPublic: true,
      requiresApproval: false,
      status: 'published' as const,
      moderationStatus: 'approved' as const,
      views: 8750,
      interested: 1200,
      attending: 215,
      shares: 89,
      isInterested: true,
      isAttending: false,
      hasTicket: false,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '3',
      title: 'Clase Magistral de Salsa Cubana',
      description: 'Aprende los secretos de la salsa cubana con instructores internacionales.',
      organizerId: 'org3',
      organizer: {
        id: 'org3',
        name: 'Academia Ritmo Latino',
        username: 'academia_ritmo',
        userType: 'school' as const,
        verified: false
      },
      category: 'dance_class' as const,
      genres: ['Salsa'],
      artists: [
        { id: 'a5', name: 'Carlos & María', role: 'instructor' as const, verified: false }
      ],
      venue: {
        name: 'Academia Ritmo Latino',
        address: 'Av. Libertador 1234',
        city: 'Caracas',
        country: 'Venezuela'
      },
      startDate: new Date('2024-02-20T19:00:00'),
      endDate: new Date('2024-02-20T21:00:00'),
      timezone: 'America/Caracas',
      tickets: [
        { id: 't5', name: 'Clase Individual', price: 25, currency: 'USD', quantity: 40, sold: 28, available: 12 }
      ],
      capacity: 40,
      soldTickets: 28,
      availableTickets: 12,
      coverImage: 'https://picsum.photos/seed/event3/800/400',
      images: [],
      isPublic: true,
      requiresApproval: false,
      status: 'published' as const,
      moderationStatus: 'approved' as const,
      views: 3200,
      interested: 450,
      attending: 28,
      shares: 23,
      isInterested: false,
      isAttending: true,
      hasTicket: true,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08')
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos', icon: Calendar },
    { value: 'concert', label: 'Conciertos', icon: Music },
    { value: 'festival', label: 'Festivales', icon: Star },
    { value: 'club_night', label: 'Noches de Club', icon: Users },
    { value: 'dance_class', label: 'Clases', icon: Users }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gradient-to-b from-yellow-900/20 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-yellow-500 mb-2">Vasílala</h1>
            <p className="text-gray-300 text-lg">
              Descubre eventos increíbles de música latina cerca de ti
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <VasílalaInput
                  placeholder="Buscar eventos, ciudades, géneros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <VasílalaButton variant="secondary" className="md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </VasílalaButton>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category.value
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <VasílalaCard variant="glass">
              <VasílalaCardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{mockEvents.length}</h3>
                <p className="text-gray-400">Eventos Activos</p>
              </VasílalaCardContent>
            </VasílalaCard>
            
            <VasílalaCard variant="glass">
              <VasílalaCardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {mockEvents.reduce((sum, event) => sum + event.attending, 0)}
                </h3>
                <p className="text-gray-400">Personas Asistiendo</p>
              </VasílalaCardContent>
            </VasílalaCard>
            
            <VasílalaCard variant="glass">
              <VasílalaCardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">
                  {new Set(mockEvents.map(e => e.venue.city)).size}
                </h3>
                <p className="text-gray-400">Ciudades</p>
              </VasílalaCardContent>
            </VasílalaCard>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <VasílalaCard key={event.id} className="overflow-hidden hover:scale-105 transition-transform duration-200">
                <div className="relative">
                  <img 
                    src={event.coverImage} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={event.isInterested ? "default" : "secondary"}>
                      <Heart className={`h-3 w-3 mr-1 ${event.isInterested ? 'fill-current' : ''}`} />
                      {event.interested}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/70 text-white">
                      {event.category === 'festival' && 'Festival'}
                      {event.category === 'club_night' && 'Club'}
                      {event.category === 'dance_class' && 'Clase'}
                      {event.category === 'concert' && 'Concierto'}
                    </Badge>
                  </div>
                </div>
                
                <VasílalaCardContent className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.startDate)}
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue.name}, {event.venue.city}
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.attending} asistiendo • {event.availableTickets} disponibles
                    </div>
                  </div>
                  
                  {/* Artists */}
                  {event.artists.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Artistas:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.artists.slice(0, 2).map((artist) => (
                          <Badge key={artist.id} variant="secondary" className="text-xs">
                            {artist.name}
                          </Badge>
                        ))}
                        {event.artists.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{event.artists.length - 2} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Desde</p>
                      <p className="text-lg font-bold text-yellow-500">
                        {formatPrice(Math.min(...event.tickets.map(t => t.price)))}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <VasílalaButton
                        variant="ghost"
                        size="sm"
                        className={`${event.isInterested ? 'text-red-500' : 'text-gray-400'} hover:text-red-400`}
                      >
                        <Heart className={`h-4 w-4 ${event.isInterested ? 'fill-current' : ''}`} />
                      </VasílalaButton>
                      
                      <VasílalaButton
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <Share className="h-4 w-4" />
                      </VasílalaButton>
                    </div>
                  </div>
                  
                  <VasílalaButton 
                    variant={event.hasTicket ? "secondary" : "primary"} 
                    className="w-full"
                    disabled={event.availableTickets === 0}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    {event.hasTicket ? 'Ya tienes entrada' : 
                     event.availableTickets === 0 ? 'Agotado' : 'Comprar Entrada'}
                  </VasílalaButton>
                </VasílalaCardContent>
              </VasílalaCard>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-gray-400">
                Intenta cambiar los filtros o buscar otros términos
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}