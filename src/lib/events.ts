import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { 
  Event, 
  EventFilters, 
  EventSearchResult, 
  TicketPurchase, 
  EventPromotion,
  EventAnalytics
} from '@/types/events';

/**
 * Crea un nuevo evento
 */
export const createEvent = async (
  eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'interested' | 'attending' | 'shares' | 'soldTickets' | 'availableTickets' | 'isInterested' | 'isAttending' | 'hasTicket'>,
  userId: string
): Promise<string> => {
  try {
    const eventsRef = collection(db, 'events');
    
    // Calcular tickets disponibles
    const totalCapacity = eventData.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    
    const newEvent = {
      ...eventData,
      organizerId: userId,
      soldTickets: 0,
      availableTickets: totalCapacity,
      views: 0,
      interested: 0,
      attending: 0,
      shares: 0,
      isInterested: false,
      isAttending: false,
      hasTicket: false,
      moderationStatus: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(eventsRef, newEvent);
    
    // Actualizar estadísticas del organizador
    await updateOrganizerStats(userId, { eventsCount: increment(1) });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Obtiene eventos con filtros y paginación
 */
export const getEvents = async (
  filters: EventFilters = {},
  lastEventId?: string,
  limitCount: number = 20
): Promise<{ events: Event[]; hasMore: boolean }> => {
  try {
    const eventsRef = collection(db, 'events');
    let q = query(
      eventsRef,
      where('isPublic', '==', true),
      where('moderationStatus', '==', 'approved'),
      orderBy('startDate', 'asc'),
      limit(limitCount + 1)
    );
    
    // Aplicar filtros
    if (filters.category && filters.category.length > 0) {
      q = query(q, where('category', 'in', filters.category));
    }
    
    if (filters.genres && filters.genres.length > 0) {
      q = query(q, where('genres', 'array-contains-any', filters.genres));
    }
    
    if (filters.city) {
      q = query(q, where('venue.city', '==', filters.city));
    }
    
    if (filters.country) {
      q = query(q, where('venue.country', '==', filters.country));
    }
    
    if (filters.organizerId) {
      q = query(q, where('organizerId', '==', filters.organizerId));
    }
    
    if (filters.status && filters.status.length > 0) {
      q = query(q, where('status', 'in', filters.status));
    }
    
    if (filters.hasAvailableTickets) {
      q = query(q, where('availableTickets', '>', 0));
    }
    
    // Paginación
    if (lastEventId) {
      const lastEventDoc = await getDoc(doc(db, 'events', lastEventId));
      if (lastEventDoc.exists()) {
        q = query(q, startAfter(lastEventDoc));
      }
    }
    
    const snapshot = await getDocs(q);
    const events: Event[] = [];
    
    snapshot.docs.forEach((doc, index) => {
      if (index < limitCount) {
        const data = doc.data();
        events.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          organizerId: data.organizerId,
          organizer: data.organizer,
          category: data.category,
          genres: data.genres || [],
          artists: data.artists || [],
          venue: data.venue,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
          timezone: data.timezone,
          tickets: data.tickets || [],
          capacity: data.capacity,
          soldTickets: data.soldTickets || 0,
          availableTickets: data.availableTickets || 0,
          coverImage: data.coverImage,
          images: data.images || [],
          videoUrl: data.videoUrl,
          isPublic: data.isPublic,
          requiresApproval: data.requiresApproval || false,
          ageRestriction: data.ageRestriction,
          dressCode: data.dressCode,
          status: data.status,
          moderationStatus: data.moderationStatus,
          views: data.views || 0,
          interested: data.interested || 0,
          attending: data.attending || 0,
          shares: data.shares || 0,
          isInterested: false, // Se calculará en el cliente
          isAttending: false, // Se calculará en el cliente
          hasTicket: false, // Se calculará en el cliente
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          publishedAt: data.publishedAt?.toDate()
        });
      }
    });
    
    const hasMore = snapshot.docs.length > limitCount;
    
    return { events, hasMore };
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

/**
 * Obtiene un evento específico por ID
 */
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    
    if (!eventDoc.exists()) {
      return null;
    }
    
    const data = eventDoc.data();
    return {
      id: eventDoc.id,
      title: data.title,
      description: data.description,
      organizerId: data.organizerId,
      organizer: data.organizer,
      category: data.category,
      genres: data.genres || [],
      artists: data.artists || [],
      venue: data.venue,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      timezone: data.timezone,
      tickets: data.tickets || [],
      capacity: data.capacity,
      soldTickets: data.soldTickets || 0,
      availableTickets: data.availableTickets || 0,
      coverImage: data.coverImage,
      images: data.images || [],
      videoUrl: data.videoUrl,
      isPublic: data.isPublic,
      requiresApproval: data.requiresApproval || false,
      ageRestriction: data.ageRestriction,
      dressCode: data.dressCode,
      status: data.status,
      moderationStatus: data.moderationStatus,
      views: data.views || 0,
      interested: data.interested || 0,
      attending: data.attending || 0,
      shares: data.shares || 0,
      isInterested: false,
      isAttending: false,
      hasTicket: false,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      publishedAt: data.publishedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting event by ID:', error);
    throw error;
  }
};

/**
 * Actualiza un evento
 */
export const updateEvent = async (
  eventId: string, 
  updates: Partial<Event>
): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Elimina un evento
 */
export const deleteEvent = async (eventId: string, organizerId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    
    // Actualizar estadísticas del organizador
    await updateOrganizerStats(organizerId, { eventsCount: increment(-1) });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Marca interés en un evento
 */
export const markEventInterested = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const interestedRef = collection(db, 'events', eventId, 'interested');
    
    // Agregar interés
    await addDoc(interestedRef, {
      userId,
      createdAt: Timestamp.now()
    });
    
    // Incrementar contador
    await updateDoc(eventRef, {
      interested: increment(1)
    });
  } catch (error) {
    console.error('Error marking event as interested:', error);
    throw error;
  }
};

/**
 * Quita interés de un evento
 */
export const unmarkEventInterested = async (eventId: string, userId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const interestedRef = collection(db, 'events', eventId, 'interested');
    
    // Buscar y eliminar el interés
    const interestedQuery = query(interestedRef, where('userId', '==', userId));
    const interestedSnapshot = await getDocs(interestedQuery);
    
    const deletePromises = interestedSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Decrementar contador
    await updateDoc(eventRef, {
      interested: increment(-1)
    });
  } catch (error) {
    console.error('Error unmarking event as interested:', error);
    throw error;
  }
};

/**
 * Incrementa las visualizaciones de un evento
 */
export const incrementEventViews = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing event views:', error);
    // No lanzar error para no interrumpir la experiencia del usuario
  }
};

/**
 * Compra entradas para un evento
 */
export const purchaseTickets = async (
  eventId: string,
  ticketId: string,
  quantity: number,
  buyerInfo: {
    name: string;
    email: string;
    phone?: string;
    document?: string;
  },
  paymentMethod: string
): Promise<string> => {
  try {
    // Obtener información del evento y ticket
    const event = await getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    const ticket = event.tickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket type not found');
    }
    
    if (ticket.available < quantity) {
      throw new Error('Not enough tickets available');
    }
    
    // Calcular precios
    const unitPrice = ticket.price;
    const subtotal = unitPrice * quantity;
    const serviceFee = subtotal * 0.05; // 5% fee
    const processingFee = 2.50; // Fixed processing fee
    const totalFees = serviceFee + processingFee;
    const totalPrice = subtotal + totalFees;
    
    // Crear compra
    const purchasesRef = collection(db, 'purchases');
    const purchaseData: Omit<TicketPurchase, 'id' | 'tickets'> = {
      eventId,
      ticketId,
      userId: 'current_user', // TODO: Obtener del contexto de auth
      buyer: buyerInfo,
      quantity,
      unitPrice,
      totalPrice,
      currency: 'USD',
      fees: {
        service: serviceFee,
        processing: processingFee,
        total: totalFees
      },
      paymentMethod: paymentMethod as any,
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const purchaseDoc = await addDoc(purchasesRef, {
      ...purchaseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Actualizar disponibilidad de tickets
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      soldTickets: increment(quantity),
      availableTickets: increment(-quantity),
      updatedAt: Timestamp.now()
    });
    
    // TODO: Procesar pago con Stripe
    // TODO: Generar tickets individuales
    // TODO: Enviar confirmación por email
    
    return purchaseDoc.id;
  } catch (error) {
    console.error('Error purchasing tickets:', error);
    throw error;
  }
};

/**
 * Busca eventos por texto
 */
export const searchEvents = async (
  searchTerm: string,
  filters: EventFilters = {},
  limitCount: number = 20
): Promise<EventSearchResult> => {
  try {
    // Por simplicidad, buscaremos en títulos y descripciones
    // En una implementación real, usarías Algolia o similar para búsqueda full-text
    
    const eventsRef = collection(db, 'events');
    let q = query(
      eventsRef,
      where('isPublic', '==', true),
      where('moderationStatus', '==', 'approved'),
      orderBy('startDate', 'asc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const allEvents: Event[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const event: Event = {
        id: doc.id,
        title: data.title,
        description: data.description,
        organizerId: data.organizerId,
        organizer: data.organizer,
        category: data.category,
        genres: data.genres || [],
        artists: data.artists || [],
        venue: data.venue,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        timezone: data.timezone,
        tickets: data.tickets || [],
        capacity: data.capacity,
        soldTickets: data.soldTickets || 0,
        availableTickets: data.availableTickets || 0,
        coverImage: data.coverImage,
        images: data.images || [],
        videoUrl: data.videoUrl,
        isPublic: data.isPublic,
        requiresApproval: data.requiresApproval || false,
        ageRestriction: data.ageRestriction,
        dressCode: data.dressCode,
        status: data.status,
        moderationStatus: data.moderationStatus,
        views: data.views || 0,
        interested: data.interested || 0,
        attending: data.attending || 0,
        shares: data.shares || 0,
        isInterested: false,
        isAttending: false,
        hasTicket: false,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        publishedAt: data.publishedAt?.toDate()
      };
      allEvents.push(event);
    });
    
    // Filtrar por término de búsqueda
    const filteredEvents = allEvents.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      event.artists.some(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return {
      events: filteredEvents,
      venues: [], // TODO: Implementar búsqueda de venues
      organizers: [], // TODO: Implementar búsqueda de organizadores
      hasMore: false,
      totalResults: filteredEvents.length
    };
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

/**
 * Obtiene eventos trending
 */
export const getTrendingEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('isPublic', '==', true),
      where('moderationStatus', '==', 'approved'),
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      orderBy('interested', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    const events: Event[] = [];
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      events.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        organizerId: data.organizerId,
        organizer: data.organizer,
        category: data.category,
        genres: data.genres || [],
        artists: data.artists || [],
        venue: data.venue,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        timezone: data.timezone,
        tickets: data.tickets || [],
        capacity: data.capacity,
        soldTickets: data.soldTickets || 0,
        availableTickets: data.availableTickets || 0,
        coverImage: data.coverImage,
        images: data.images || [],
        videoUrl: data.videoUrl,
        isPublic: data.isPublic,
        requiresApproval: data.requiresApproval || false,
        ageRestriction: data.ageRestriction,
        dressCode: data.dressCode,
        status: data.status,
        moderationStatus: data.moderationStatus,
        views: data.views || 0,
        interested: data.interested || 0,
        attending: data.attending || 0,
        shares: data.shares || 0,
        isInterested: false,
        isAttending: false,
        hasTicket: false,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        publishedAt: data.publishedAt?.toDate()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Error getting trending events:', error);
    throw error;
  }
};

/**
 * Sube imagen para un evento
 */
export const uploadEventImage = async (
  file: File,
  eventId: string,
  type: 'cover' | 'gallery'
): Promise<string> => {
  try {
    const imageRef = ref(storage, `events/${eventId}/${type}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(imageRef);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error uploading event image:', error);
    throw error;
  }
};

/**
 * Actualiza estadísticas del organizador
 */
const updateOrganizerStats = async (organizerId: string, updates: any): Promise<void> => {
  try {
    const organizerRef = doc(db, 'users', organizerId);
    await updateDoc(organizerRef, updates);
  } catch (error) {
    console.error('Error updating organizer stats:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
};