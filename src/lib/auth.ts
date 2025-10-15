import { 
  signInWithGoogleMock,
  signUpWithEmailMock,
  signInWithEmailMock
} from '@/lib/auth-mock';
import type { UserType, VasílalaUser } from '@/types/user';

// Función para registrarse con email y contraseña (MOCK)
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string,
  userType: UserType = 'fan'
): Promise<VasílalaUser> => {
  try {
    console.log('🎭 Registro mock con:', { email, displayName, userType });
    const user = await signUpWithEmailMock(email, password, displayName, userType);
    console.log('✅ Usuario registrado:', user);
    return user;
  } catch (error: any) {
    console.error('Error signing up with email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Función para iniciar sesión con email y contraseña (MOCK)
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<VasílalaUser> => {
  try {
    console.log('🎭 Login mock con:', { email });
    const user = await signInWithEmailMock(email, password);
    console.log('✅ Usuario logueado:', user);
    return user;
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    throw new Error(getAuthErrorMessage(error.message));
  }
};

// Función para iniciar sesión con Google (MOCK)
export const signInWithGoogle = async (): Promise<VasílalaUser> => {
  try {
    console.log('🎭 Login con Google mock...');
    const user = await signInWithGoogleMock();
    console.log('✅ Usuario logueado con Google:', user);
    return user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error('Error al iniciar sesión con Google');
  }
};

// Función para obtener mensajes de error en español
const getAuthErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes('Usuario no encontrado')) {
    return 'No existe una cuenta con este email';
  }
  if (errorMessage.includes('Contraseña')) {
    return 'Contraseña incorrecta';
  }
  return errorMessage || 'Error de autenticación';
};

// Función para validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar contraseña
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Función para validar username
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Función para obtener el nombre del tipo de usuario en español
export const getUserTypeDisplayName = (userType: UserType): string => {
  const displayNames = {
    fan: 'Fan',
    artist: 'Artista Musical',
    dj: 'DJ',
    dancer: 'Bailarín/Coreógrafo',
    school: 'Escuela de Música/Baile',
    venue: 'Local/Negocio',
    organizer: 'Organizador de Eventos'
  };
  
  return displayNames[userType];
};

// Función para obtener la descripción del tipo de usuario
export const getUserTypeDescription = (userType: UserType): string => {
  const descriptions = {
    fan: 'Acceso básico para ver contenido, seguir artistas y comprar entradas',
    artist: 'Puede subir música, crear eventos, tener página profesional',
    dj: 'Puede subir sets y música, crear eventos, tener página profesional',
    dancer: 'Puede publicar videos de baile, crear eventos, tener página profesional',
    school: 'Puede subir contenido educativo, crear eventos, tener página institucional',
    venue: 'Puede crear eventos, vender entradas, tener página de negocio',
    organizer: 'Puede crear eventos masivos, vender entradas, tener página profesional'
  };
  
  return descriptions[userType];
};