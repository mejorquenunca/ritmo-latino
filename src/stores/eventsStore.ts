import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Event, EventFilters, TicketPurchase } from '@/types/events';
import { 
  getEvents, 
  getEventById, 
  markEventInterested, 
  unmarkEventInterested,
  incrementEventViews,
  searchEvents,
  getTrendingEvents
} from '@/lib/events';

interface EventsState {
  // Eventos
  events: Event[];
  featuredEvents: Event[];
  trendingEvents: Event[];
  userEvents: Event[];
  
  // Estado de carga
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  
  // Filtros y búsqueda
  currentFilters: EventFilters;
  searchTerm: string;
  searchResults: Event[];
  
  // Evento actual
  currentEvent: Event | null;
  
  // Compras
  userPurchases: TicketPurchase[];
  currentPurchase: TicketPurchase | null;
}

interface EventsActions {
  // Cargar eventos
  loadEvents: (filters?: EventFilters) => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  
  // Eventos específicos
  loadEventById: (eventId: string) => Promise<void>;
  loadTrendingEvents: () => Promise<void>;
  loadUserEvents: (userId: string) => Promise<void>;
  
  // Búsqueda
  searchEvents: (searchTerm: string, filters?: EventFilters) => Promise<void>;
  clearSearch: () => void;
  
  // Filtros
  setFilters: (filters: EventFilters) => void;
  clearFilters: () => void;
  
  // Interacciones
  toggleInterested: (eventId: string, userId: string) => Promise<void>;
  incrementViews: (eventId: string) => void;
  
  // Estado
  setCurrentEvent: (event: Event | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utilidades
  getEventsByCategory: (category: string) => Event[];
  getEventsByCity: (city: string) => Event[];
  getUpcomingEvents: () => Event[];
}

type EventsStore = EventsState & EventsActions;

export const useEventsStore = create<EventsStore>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      events: [],
      featuredEvents: [],
      trendingEvents: [],
      userEvents: [],
      loading: false,
      error: null,
      hasMore: true,
      currentFilters: {},
      searchTerm: '',
      searchResults: [],
      currentEvent: null,
      userPurchases: [],
      currentPurchase: null,

      // Cargar eventos
      loadEvents: async (filters = {}) => {
        const { loading } = get();
        if (loading) return;

        set({ loading: true, error: null, currentFilters: filters });
        
        try {
          const result = await getEvents(filters, undefined, 20);
          set({ 
            events: result.events,
            hasMore: result.hasMore,
            loading: false 
          });
        } catch (error) {
          console.error('Error loading events:', error);
          set({ 
            error: 'Error cargando eventos',
            loading: false 
          });
        }
      },

      loadMoreEvents: async () => {
        const { loading, hasMore, events, currentFilters } = get();
        if (loading || !hasMore) return;

        set({ loading: true });
        
        try {
          const lastEventId = events.length > 0 ? events[events.length - 1].id : undefined;
          const result = await getEvents(currentFilters, lastEventId, 20);
          
          set({ 
            events: [...events, ...result.events],
            hasMore: result.hasMore,
            loading: false 
          });
        } catch (error) {
          console.error('Error loading more events:', error);
          set({ 
            error: 'Error cargando más eventos',
            loading: false 
          });
        }
      },

      refreshEvents: async () => {
        const { currentFilters } = get();
        set({ events: [], hasMore: true });
        await get().loadEvents(currentFilters);
      },

      // Eventos específicos
      loadEventById: async (eventId: string) => {
        set({ loading: true, error: null });
        
        try {
          const event = await getEventById(eventId);
          if (event) {
            set({ currentEvent: event });
            // Incrementar vistas
            get().incrementViews(eventId);
          } else {
            set({ error: 'Evento no encontrado' });
          }
        } catch (error) {
          console.error('Error loading event:', error);
          set({ error: 'Error cargando evento' });
        } finally {
          set({ loading: false });
        }
      },

      loadTrendingEvents: async () => {
        try {
          const events = await getTrendingEvents();
          set({ trendingEvents: events });
        } catch (error) {
          console.error('Error loading trending events:', error);
        }
      },

      loadUserEvents: async (userId: string) => {
        try {
          const result = await getEvents({ organizerId: userId }, undefined, 50);
          set({ userEvents: result.events });
        } catch (error) {
          console.error('Error loading user events:', error);
        }
      },

      // Búsqueda
      searchEvents: async (searchTerm: string, filters = {}) => {
        if (!searchTerm.trim()) {
          set({ searchResults: [], searchTerm: '' });
          return;
        }

        set({ loading: true, searchTerm });
        
        try {
          const result = await searchEvents(searchTerm, filters);
          set({ 
            searchResults: result.events,
            loading: false 
          });
        } catch (error) {
          console.error('Error searching events:', error);
          set({ 
            error: 'Error en la búsqueda',
            loading: false 
          });
        }
      },

      clearSearch: () => {
        set({ searchResults: [], searchTerm: '' });
      },

      // Filtros
      setFilters: (filters: EventFilters) => {
        set({ currentFilters: filters });
        get().loadEvents(filters);
      },

      clearFilters: () => {
        set({ currentFilters: {} });
        get().loadEvents({});
      },

      // Interacciones
      toggleInterested: async (eventId: string, userId: string) => {
        try {
          // Optimistic update
          set(state => ({
            events: state.events.map(event =>
              event.id === eventId
                ? {
                    ...event,
                    isInterested: !event.isInterested,
                    interested: event.isInterested 
                      ? event.interested - 1 
                      : event.interested + 1
                  }
                : event
            ),
            currentEvent: state.currentEvent?.id === eventId
              ? {
                  ...state.currentEvent,
                  isInterested: !state.currentEvent.isInterested,
                  interested: state.currentEvent.isInterested 
                    ? state.currentEvent.interested - 1 
                    : state.currentEvent.interested + 1
                }
              : state.currentEvent
          }));

          // API call
          const event = get().events.find(e => e.id === eventId) || get().currentEvent;
          if (event?.isInterested) {
            await markEventInterested(eventId, userId);
          } else {
            await unmarkEventInterested(eventId, userId);
          }
        } catch (error) {
          console.error('Error toggling interested:', error);
          // Revert optimistic update on error
          set(state => ({
            events: state.events.map(event =>
              event.id === eventId
                ? {
                    ...event,
                    isInterested: !event.isInterested,
                    interested: event.isInterested 
                      ? event.interested - 1 
                      : event.interested + 1
                  }
                : event
            )
          }));
        }
      },

      incrementViews: (eventId: string) => {
        // Optimistic update
        set(state => ({
          events: state.events.map(event =>
            event.id === eventId
              ? { ...event, views: event.views + 1 }
              : event
          ),
          currentEvent: state.currentEvent?.id === eventId
            ? { ...state.currentEvent, views: state.currentEvent.views + 1 }
            : state.currentEvent
        }));

        // API call in background
        incrementEventViews(eventId).catch(console.error);
      },

      // Estado
      setCurrentEvent: (event: Event | null) => {
        set({ currentEvent: event });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Utilidades
      getEventsByCategory: (category: string) => {
        const { events } = get();
        return events.filter(event => event.category === category);
      },

      getEventsByCity: (city: string) => {
        const { events } = get();
        return events.filter(event => 
          event.venue.city.toLowerCase() === city.toLowerCase()
        );
      },

      getUpcomingEvents: () => {
        const { events } = get();
        const now = new Date();
        return events
          .filter(event => event.startDate > now)
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      }
    }),
    {
      name: 'events-store',
    }
  )
);