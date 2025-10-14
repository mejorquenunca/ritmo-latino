export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    userType: 'local' | 'organizer' | 'artist' | 'venue';
    verified: boolean;
  };
  
  // Información del evento
  category: EventCategory;
  genres: string[];
  artists: EventArtist[];
  
  // Ubicación y fecha
  venue: EventVenue;
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Entradas y precios
  tickets: EventTicket[];
  capacity: number;
  soldTickets: number;
  availableTickets: number;
  
  // Multimedia
  coverImage?: string;
  images: string[];
  videoUrl?: string;
  
  // Configuración
  isPublic: boolean;
  requiresApproval: boolean;
  ageRestriction?: number;
  dressCode?: string;
  
  // Estado
  status: EventStatus;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  
  // Engagement
  views: number;
  interested: number;
  attending: number;
  shares: number;
  
  // Estado del usuario
  isInterested: boolean;
  isAttending: boolean;
  hasTicket: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export type EventCategory = 
  | 'concert' 
  | 'festival' 
  | 'club_night' 
  | 'dance_class' 
  | 'workshop' 
  | 'competition' 
  | 'social_dance' 
  | 'private_party' 
  | 'other';

export type EventStatus = 
  | 'draft' 
  | 'published' 
  | 'sold_out' 
  | 'cancelled' 
  | 'postponed' 
  | 'completed';

export interface EventArtist {
  id: string;
  name: string;
  role: 'headliner' | 'support' | 'dj' | 'host' | 'instructor';
  avatar?: string;
  verified: boolean;
  setTime?: {
    start: Date;
    end: Date;
  };
}

export interface EventVenue {
  id?: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  capacity?: number;
  amenities?: string[];
  website?: string;
  phone?: string;
}

export interface EventTicket {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  available: number;
  
  // Configuración
  isActive: boolean;
  saleStartDate?: Date;
  saleEndDate?: Date;
  
  // Restricciones
  minQuantityPerOrder: number;
  maxQuantityPerOrder: number;
  requiresApproval: boolean;
  
  // Beneficios
  benefits?: string[];
  includes?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketPurchase {
  id: string;
  eventId: string;
  ticketId: string;
  userId: string;
  
  // Información del comprador
  buyer: {
    name: string;
    email: string;
    phone?: string;
    document?: string;
  };
  
  // Detalles de la compra
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  fees: {
    service: number;
    processing: number;
    total: number;
  };
  
  // Pago
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  transactionId?: string;
  
  // Entradas
  tickets: GeneratedTicket[];
  
  // Estado
  status: PurchaseStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  cancelledAt?: Date;
}

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'paypal' 
  | 'bank_transfer' 
  | 'cash' 
  | 'crypto';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'refunded';

export type PurchaseStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'refunded' 
  | 'used';

export interface GeneratedTicket {
  id: string;
  purchaseId: string;
  eventId: string;
  ticketTypeId: string;
  
  // Información del ticket
  ticketNumber: string;
  qrCode: string;
  barcode?: string;
  
  // Titular
  holderName: string;
  holderEmail: string;
  
  // Estado
  isUsed: boolean;
  usedAt?: Date;
  isTransferable: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFilters {
  category?: EventCategory[];
  genres?: string[];
  city?: string;
  country?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  organizerId?: string;
  venueId?: string;
  status?: EventStatus[];
  hasAvailableTickets?: boolean;
}

export interface EventSearchResult {
  events: Event[];
  venues: EventVenue[];
  organizers: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  }[];
  hasMore: boolean;
  totalResults: number;
}

export interface EventAnalytics {
  eventId: string;
  
  // Métricas de engagement
  views: number;
  uniqueViews: number;
  interested: number;
  attending: number;
  shares: number;
  
  // Métricas de ventas
  ticketsSold: number;
  revenue: number;
  conversionRate: number;
  averageOrderValue: number;
  
  // Demografía
  audienceByAge: {
    ageGroup: string;
    count: number;
  }[];
  audienceByGender: {
    gender: string;
    count: number;
  }[];
  audienceByLocation: {
    city: string;
    count: number;
  }[];
  
  // Tendencias temporales
  dailyViews: {
    date: Date;
    views: number;
  }[];
  dailySales: {
    date: Date;
    tickets: number;
    revenue: number;
  }[];
  
  // Fuentes de tráfico
  trafficSources: {
    source: string;
    visits: number;
    conversions: number;
  }[];
}

export interface EventPromotion {
  id: string;
  eventId: string;
  
  // Configuración de la promoción
  type: 'discount' | 'early_bird' | 'group' | 'promo_code';
  name: string;
  description?: string;
  
  // Descuento
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  maxDiscount?: number;
  
  // Restricciones
  code?: string;
  usageLimit?: number;
  usageCount: number;
  minQuantity?: number;
  maxQuantity?: number;
  
  // Fechas
  startDate: Date;
  endDate: Date;
  
  // Estado
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface EventNotification {
  id: string;
  eventId: string;
  userId: string;
  
  // Tipo de notificación
  type: 'event_reminder' | 'ticket_confirmation' | 'event_update' | 'event_cancelled';
  
  // Contenido
  title: string;
  message: string;
  
  // Configuración
  scheduledFor?: Date;
  sentAt?: Date;
  
  // Estado
  status: 'pending' | 'sent' | 'failed';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}