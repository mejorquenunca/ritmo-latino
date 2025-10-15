// Sistema de autenticación mock para demostración
import type { VasílalaUser, UserType } from '@/types/user';

// Usuarios mock para demostración
const MOCK_USERS: VasílalaUser[] = [
  {
    id: 'user_1',
    email: 'carlos@vasilala.com',
    username: 'salsero_pro',
    displayName: 'Carlos Salsa',
    avatar: 'https://picsum.photos/seed/carlos/100/100',
    userType: 'artist',
    verified: true,
    verificationStatus: 'approved',
    bio: 'Artista de salsa profesional con 15 años de experiencia',
    location: 'Cali, Colombia',
    socialLinks: {
      instagram: 'https://instagram.com/salsero_pro',
      youtube: 'https://youtube.com/salsero_pro'
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    followers: 15420,
    following: 234,
    totalPosts: 89,
    totalLikes: 45230
  },
  {
    id: 'user_2',
    email: 'maria@vasilala.com',
    username: 'bachata_queen',
    displayName: 'María Bachata',
    avatar: 'https://picsum.photos/seed/maria/100/100',
    userType: 'artist',
    verified: true,
    verificationStatus: 'approved',
    bio: 'Reina de la bachata moderna',
    location: 'Santo Domingo, República Dominicana',
    socialLinks: {
      instagram: 'https://instagram.com/bachata_queen',
      spotify: 'https://spotify.com/artist/bachata_queen'
    },
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date(),
    notifications: {
      email: true,
      push: true,
      marketing: true
    },
    followers: 28750,
    following: 156,
    totalPosts: 124,
    totalLikes: 67890
  },
  {
    id: 'user_3',
    email: 'fan@vasilala.com',
    username: 'fan_latino',
    displayName: 'Ana López',
    avatar: 'https://picsum.photos/seed/ana/100/100',
    userType: 'fan',
    verified: false,
    verificationStatus: 'pending',
    bio: 'Amante de la música latina',
    location: 'Madrid, España',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date(),
    notifications: {
      email: true,
      push: false,
      marketing: false
    },
    followers: 45,
    following: 234,
    totalPosts: 12,
    totalLikes: 156
  }
];

// Simular autenticación con Google
export const signInWithGoogleMock = async (): Promise<VasílalaUser> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retornar usuario aleatorio
  const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
  
  // Guardar en localStorage para persistencia
  localStorage.setItem('vasilala_mock_user', JSON.stringify(randomUser));
  
  return randomUser;
};

// Simular registro con email
export const signUpWithEmailMock = async (
  email: string, 
  password: string, 
  displayName: string,
  userType: UserType
): Promise<VasílalaUser> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newUser: VasílalaUser = {
    id: `user_${Date.now()}`,
    email,
    username: email.split('@')[0],
    displayName,
    avatar: `https://picsum.photos/seed/${email}/100/100`,
    userType,
    verified: false,
    verificationStatus: 'pending',
    bio: `Nuevo usuario de Vasílala`,
    createdAt: new Date(),
    updatedAt: new Date(),
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    followers: 0,
    following: 0,
    totalPosts: 0,
    totalLikes: 0
  };
  
  // Guardar en localStorage
  localStorage.setItem('vasilala_mock_user', JSON.stringify(newUser));
  
  return newUser;
};

// Simular login con email
export const signInWithEmailMock = async (
  email: string, 
  password: string
): Promise<VasílalaUser> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Buscar usuario por email
  const user = MOCK_USERS.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // Guardar en localStorage
  localStorage.setItem('vasilala_mock_user', JSON.stringify(user));
  
  return user;
};

// Obtener usuario actual
export const getCurrentUserMock = (): VasílalaUser | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('vasilala_mock_user');
  return stored ? JSON.parse(stored) : null;
};

// Cerrar sesión
export const signOutMock = async (): Promise<void> => {
  localStorage.removeItem('vasilala_mock_user');
};

// Verificar si está autenticado
export const isAuthenticatedMock = (): boolean => {
  return getCurrentUserMock() !== null;
};