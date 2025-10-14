import { 
  auth, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserProfileDocument,
  type FirebaseAuthUser 
} from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import type { UserType } from '@/types/user';

// Función para registrarse con email y contraseña
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<FirebaseAuthUser> => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar el displayName del usuario
    if (user) {
      await updateProfile(user, { displayName });
      
      // Crear el perfil en Firestore
      await createUserProfileDocument(user, { displayName });
    }
    
    return user;
  } catch (error: any) {
    console.error('Error signing up with email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Función para iniciar sesión con email y contraseña
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<FirebaseAuthUser> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Función para iniciar sesión con Google
export const signInWithGoogle = async (): Promise<FirebaseAuthUser> => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    // Crear el perfil en Firestore si es la primera vez
    await createUserProfileDocument(user);
    
    return user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Función para obtener mensajes de error en español
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No existe una cuenta con este email';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con este email';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta más tarde';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu internet';
    case 'auth/popup-closed-by-user':
      return 'Ventana cerrada por el usuario';
    case 'auth/cancelled-popup-request':
      return 'Solicitud cancelada';
    default:
      return 'Error de autenticación. Intenta nuevamente';
  }
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