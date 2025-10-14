'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { VasílalaButton } from '@/components/ui/vasilala-button';
import { VasílalaInput } from '@/components/ui/vasilala-input';
import { VasílalaCard, VasílalaCardContent, VasílalaCardHeader, VasílalaCardTitle } from '@/components/ui/vasilala-card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createEvent, uploadEventImage } from '@/lib/events';
import type { Event, EventCategory, EventTicket, EventVenue, EventArtist } from '@/types/events';
import { 
  Calendar, 
  MapPin, 
  Upload, 
  X, 
  Plus,
  Clock,
  Users,
  DollarSign,
  Image as ImageIcon,
  Music,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'concert', label: 'Concierto' },
  { value: 'festival', label: 'Festival' },
  { value: 'club_night', label: 'Noche de Club' },
  { value: 'dance_class', label: 'Clase de Baile' },
  { value: 'workshop', label: 'Taller' },
  { value: 'competition', label: 'Competencia' },
  { value: 'social_dance', label: 'Baile Social' },
  { value: 'private_party', label: 'Fiesta Privada' },
  { value: 'other', label: 'Otro' }
];

const MUSIC_GENRES = [
  'Salsa', 'Bachata', 'Merengue', 'Reggaeton', 'Cumbia', 'Vallenato',
  'Tango', 'Bolero', 'Son', 'Mambo', 'Cha-cha-cha', 'Rumba',
  'Bossa Nova', 'Samba', 'Forró', 'Axé', 'Pagode', 'Sertanejo',
  'Pop Latino', 'Rock Latino', 'Balada', 'Tropical', 'Urbano'
];

export const EventCreator: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  // Form data
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: 'concert' as EventCategory,
    genres: [] as string[],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    capacity: 100,
    isPublic: true,
    requiresApproval: false,
    ageRestriction: undefined as number | undefined,
    dressCode: ''
  });
  
  const [venue, setVenue] = useState<EventVenue>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    capacity: undefined,
    phone: '',
    website: ''
  });
  
  const [artists, setArtists] = useState<EventArtist[]>([]);
  const [tickets, setTickets] = useState<EventTicket[]>([
    {
      id: 'general',
      name: 'Entrada General',
      description: '',
      price: 0,
      currency: 'USD',
      quantity: 100,
      sold: 0,
      available: 100,
      isActive: true,
      minQuantityPerOrder: 1,
      maxQuantityPerOrder: 10,
      requiresApproval: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const handleCoverSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Archivo inválido',
        description: 'Solo se permiten imágenes'
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Archivo muy grande',
        description: 'La imagen no puede ser mayor a 5MB'
      });
      return;
    }
    
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGenreToggle = (genre: string) => {
    setEventData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const addArtist = () => {
    const newArtist: EventArtist = {
      id: `artist_${Date.now()}`,
      name: '',
      role: 'headliner',
      verified: false
    };
    setArtists(prev => [...prev, newArtist]);
  };

  const updateArtist = (index: number, updates: Partial<EventArtist>) => {
    setArtists(prev => prev.map((artist, i) => 
      i === index ? { ...artist, ...updates } : artist
    ));
  };

  const removeArtist = (index: number) => {
    setArtists(prev => prev.filter((_, i) => i !== index));
  };

  const addTicketType = () => {
    const newTicket: EventTicket = {
      id: `ticket_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      quantity: 50,
      sold: 0,
      available: 50,
      isActive: true,
      minQuantityPerOrder: 1,
      maxQuantityPerOrder: 10,
      requiresApproval: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const updateTicket = (index: number, updates: Partial<EventTicket>) => {
    setTickets(prev => prev.map((ticket, i) => 
      i === index ? { ...ticket, ...updates, available: updates.quantity || ticket.quantity } : ticket
    ));
  };

  const removeTicket = (index: number) => {
    if (tickets.length > 1) {
      setTickets(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(eventData.title && eventData.description && eventData.category);
      case 2:
        return !!(eventData.startDate && eventData.startTime && venue.name && venue.address && venue.city);
      case 3:
        return tickets.every(ticket => ticket.name && ticket.price >= 0 && ticket.quantity > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        variant: 'destructive',
        title: 'Información incompleta',
        description: 'Por favor completa todos los campos requeridos'
      });
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    
    try {
      // Validar fechas
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.endDate || eventData.startDate}T${eventData.endTime || eventData.startTime}`);
      
      if (startDateTime <= new Date()) {
        throw new Error('La fecha del evento debe ser en el futuro');
      }
      
      if (endDateTime <= startDateTime) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      
      // Crear evento
      const newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'interested' | 'attending' | 'shares' | 'soldTickets' | 'availableTickets' | 'isInterested' | 'isAttending' | 'hasTicket'> = {
        title: eventData.title,
        description: eventData.description,
        organizerId: userProfile.id,
        organizer: {
          id: userProfile.id,
          name: userProfile.displayName,
          username: userProfile.username,
          avatar: userProfile.avatar,
          userType: userProfile.userType as any,
          verified: userProfile.verified
        },
        category: eventData.category,
        genres: eventData.genres,
        artists,
        venue,
        startDate: startDateTime,
        endDate: endDateTime,
        timezone: eventData.timezone,
        tickets,
        capacity: eventData.capacity,
        coverImage: undefined,
        images: [],
        isPublic: eventData.isPublic,
        requiresApproval: eventData.requiresApproval,
        ageRestriction: eventData.ageRestriction,
        dressCode: eventData.dressCode || undefined,
        status: 'draft',
        moderationStatus: 'pending'
      };
      
      const eventId = await createEvent(newEvent, userProfile.id);
      
      // Subir imagen de portada si existe
      if (coverImage) {
        const coverUrl = await uploadEventImage(coverImage, eventId, 'cover');
        // TODO: Actualizar evento con la URL de la imagen
      }
      
      toast({
        title: '¡Evento creado!',
        description: 'Tu evento ha sido creado exitosamente y está en revisión'
      });
      
      // Reset form
      // TODO: Redirect to event page or events list
      
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        variant: 'destructive',
        title: 'Error al crear evento',
        description: error instanceof Error ? error.message : 'Hubo un problema al crear tu evento'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              step >= stepNumber 
                ? "bg-yellow-500 text-black" 
                : "bg-gray-700 text-gray-400"
            )}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={cn(
                "w-20 h-1 mx-2",
                step > stepNumber ? "bg-yellow-500" : "bg-gray-700"
              )} />
            )}
          </div>
        ))}
      </div>

      <VasílalaCard>
        <VasílalaCardHeader>
          <VasílalaCardTitle>
            {step === 1 && "Información Básica"}
            {step === 2 && "Fecha y Ubicación"}
            {step === 3 && "Entradas y Precios"}
            {step === 4 && "Revisión y Publicación"}
          </VasílalaCardTitle>
        </VasílalaCardHeader>
        <VasílalaCardContent>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <VasílalaInput
                label="Título del Evento *"
                value={eventData.title}
                onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nombre de tu evento"
                maxLength={100}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <Textarea
                  value={eventData.description}
                  onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe tu evento, qué pueden esperar los asistentes..."
                  className="min-h-[120px] bg-gray-800 border-gray-700 focus:border-yellow-500"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {eventData.description.length}/1000 caracteres
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EVENT_CATEGORIES.map((category) => (
                    <Badge
                      key={category.value}
                      variant={eventData.category === category.value ? "default" : "secondary"}
                      className={cn(
                        "cursor-pointer transition-colors justify-center py-2",
                        eventData.category === category.value
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "hover:bg-gray-600"
                      )}
                      onClick={() => setEventData(prev => ({ ...prev, category: category.value }))}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Géneros Musicales
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {MUSIC_GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={eventData.genres.includes(genre) ? "default" : "secondary"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        eventData.genres.includes(genre)
                          ? "bg-yellow-500 text-black hover:bg-yellow-400"
                          : "hover:bg-gray-600"
                      )}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen de Portada
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCoverSelect(e.target.files)}
                    className="hidden"
                  />
                  
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 mb-2">
                        Sube una imagen atractiva para tu evento
                      </p>
                      <VasílalaButton
                        type="button"
                        variant="secondary"
                        onClick={() => coverInputRef.current?.click()}
                      >
                        Seleccionar Imagen
                      </VasílalaButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date and Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VasílalaInput
                  label="Fecha de Inicio *"
                  type="date"
                  value={eventData.startDate}
                  onChange={(e) => setEventData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
                
                <VasílalaInput
                  label="Hora de Inicio *"
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => setEventData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VasílalaInput
                  label="Fecha de Fin"
                  type="date"
                  value={eventData.endDate}
                  onChange={(e) => setEventData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={eventData.startDate || new Date().toISOString().split('T')[0]}
                />
                
                <VasílalaInput
                  label="Hora de Fin"
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => setEventData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              
              <VasílalaInput
                label="Nombre del Lugar *"
                value={venue.name}
                onChange={(e) => setVenue(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del venue, club, salón, etc."
                icon={<MapPin className="h-4 w-4" />}
              />
              
              <VasílalaInput
                label="Dirección *"
                value={venue.address}
                onChange={(e) => setVenue(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Dirección completa del evento"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VasílalaInput
                  label="Ciudad *"
                  value={venue.city}
                  onChange={(e) => setVenue(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Ciudad"
                />
                
                <VasílalaInput
                  label="Estado/Provincia"
                  value={venue.state}
                  onChange={(e) => setVenue(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Estado"
                />
                
                <VasílalaInput
                  label="País"
                  value={venue.country}
                  onChange={(e) => setVenue(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="País"
                />
              </div>
              
              <VasílalaInput
                label="Capacidad Total"
                type="number"
                value={eventData.capacity}
                onChange={(e) => setEventData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                min={1}
                max={10000}
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          )}

          {/* Step 3: Tickets and Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Tipos de Entrada</h3>
                <VasílalaButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addTicketType}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Tipo
                </VasílalaButton>
              </div>
              
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="bg-gray-800 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">Entrada #{index + 1}</h4>
                    {tickets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicket(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <VasílalaInput
                      label="Nombre del Ticket"
                      value={ticket.name}
                      onChange={(e) => updateTicket(index, { name: e.target.value })}
                      placeholder="Ej: Entrada General, VIP, Early Bird"
                    />
                    
                    <VasílalaInput
                      label="Precio (USD)"
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicket(index, { price: parseFloat(e.target.value) || 0 })}
                      min={0}
                      step={0.01}
                      icon={<DollarSign className="h-4 w-4" />}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <VasílalaInput
                      label="Cantidad"
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => updateTicket(index, { quantity: parseInt(e.target.value) || 0 })}
                      min={1}
                    />
                    
                    <VasílalaInput
                      label="Mín. por orden"
                      type="number"
                      value={ticket.minQuantityPerOrder}
                      onChange={(e) => updateTicket(index, { minQuantityPerOrder: parseInt(e.target.value) || 1 })}
                      min={1}
                    />
                    
                    <VasílalaInput
                      label="Máx. por orden"
                      type="number"
                      value={ticket.maxQuantityPerOrder}
                      onChange={(e) => updateTicket(index, { maxQuantityPerOrder: parseInt(e.target.value) || 1 })}
                      min={1}
                    />
                  </div>
                  
                  <Textarea
                    placeholder="Descripción del ticket (opcional)"
                    value={ticket.description}
                    onChange={(e) => updateTicket(index, { description: e.target.value })}
                    className="bg-gray-700 border-gray-600 focus:border-yellow-500"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Review and Publish */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">{eventData.title}</h3>
                <p className="text-gray-300 mb-4">{eventData.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-500 mb-2">Detalles del Evento</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Categoría:</span> {EVENT_CATEGORIES.find(c => c.value === eventData.category)?.label}</p>
                      <p><span className="text-gray-400">Géneros:</span> {eventData.genres.join(', ') || 'No especificado'}</p>
                      <p><span className="text-gray-400">Fecha:</span> {eventData.startDate} {eventData.startTime}</p>
                      <p><span className="text-gray-400">Lugar:</span> {venue.name}</p>
                      <p><span className="text-gray-400">Dirección:</span> {venue.address}, {venue.city}</p>
                      <p><span className="text-gray-400">Capacidad:</span> {eventData.capacity} personas</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-yellow-500 mb-2">Entradas</h4>
                    <div className="space-y-2">
                      {tickets.map((ticket, index) => (
                        <div key={index} className="bg-gray-700 rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{ticket.name}</span>
                            <span className="text-yellow-500">${ticket.price}</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {ticket.quantity} disponibles
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Antes de publicar:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Tu evento será revisado por nuestro equipo antes de ser publicado</li>
                      <li>• Asegúrate de que toda la información sea correcta</li>
                      <li>• Podrás editar algunos detalles después de la publicación</li>
                      <li>• Las ventas comenzarán una vez que el evento sea aprobado</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <VasílalaButton
              type="button"
              variant="secondary"
              onClick={prevStep}
              disabled={step === 1}
            >
              Anterior
            </VasílalaButton>
            
            {step < 4 ? (
              <VasílalaButton
                type="button"
                variant="primary"
                onClick={nextStep}
              >
                Siguiente
              </VasílalaButton>
            ) : (
              <VasílalaButton
                type="button"
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                isLoading={loading}
                loadingText="Creando evento..."
              >
                Crear Evento
              </VasílalaButton>
            )}
          </div>
        </VasílalaCardContent>
      </VasílalaCard>
    </div>
  );
};