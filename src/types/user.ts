// Tipos de usuario para la plataforma Vasílala
export type UserType = 'fan' | 'artist' | 'dj' | 'dancer' | 'school' | 'venue' | 'organizer';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  spotify?: string;
  website?: string;
}

export interface VasílalaUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  userType: UserType;
  verified: boolean;
  verificationStatus: VerificationStatus;
  socialLinks?: SocialLinks;
  bio?: string;
  location?: string;
  phone?: string;
  
  // Campos específicos por tipo de usuario
  artistName?: string; // Para artistas y DJs
  schoolName?: string; // Para escuelas
  venueName?: string; // Para locales
  businessName?: string; // Para organizadores
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  
  // Configuraciones
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  
  // Estadísticas
  followers: number;
  following: number;
  totalPosts: number;
  totalLikes: number;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  requestedUserType: UserType;
  documents: string[]; // URLs de documentos subidos
  businessInfo?: {
    name: string;
    address: string;
    phone: string;
    website?: string;
    description: string;
  };
  status: VerificationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Permisos por tipo de usuario
export const USER_PERMISSIONS = {
  fan: {
    canUploadMusic: false,
    canCreateEvents: false,
    canSellTickets: false,
    canHaveProfessionalPage: false,
    maxVideoUploads: 10, // por día
  },
  artist: {
    canUploadMusic: true,
    canCreateEvents: true,
    canSellTickets: true,
    canHaveProfessionalPage: true,
    maxVideoUploads: 50,
  },
  dj: {
    canUploadMusic: true,
    canCreateEvents: true,
    canSellTickets: true,
    canHaveProfessionalPage: true,
    maxVideoUploads: 50,
  },
  dancer: {
    canUploadMusic: false,
    canCreateEvents: true,
    canSellTickets: true,
    canHaveProfessionalPage: true,
    maxVideoUploads: 30,
  },
  school: {
    canUploadMusic: true, // Con validación
    canCreateEvents: true,
    canSellTickets: true,
    canHaveProfessionalPage: true,
    maxVideoUploads: 100,
  },
  venue: {
    canUploadMusic: false,
    canCreateEvents: true,
    canSellTickets: true,
    canHaveProfessionalPage: true,
    maxVideoUploads: 20,
  },
  organizer: {
    canUploadMusic: false,
    canCreateEvents: true,
    canSellTickets: true,
    canHaveProfessionalPage: true,
    maxVideoUploads: 30,
  },
} as const;