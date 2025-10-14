// 🚫 FIREBASE DESHABILITADO - SOLO DATOS MOCK

// Tipos mock para mantener compatibilidad
export type FirebaseAuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type VasílalaUser = {
  id: string;
  email: string;
  displayName: string;
  username: string;
  userType: string;
  verified: boolean;
  avatar?: string;
};

// Funciones mock que no hacen nada
export const createUserProfileDocument = async () => null;
export const getUserProfile = async () => null;
export const onAuthStateChanged = () => () => {};
export const signOut = async () => {};

// Auth mock
export const auth = null;
export const db = null;
export const storage = null;

// Funciones de autenticación mock
export const signUpWithEmail = async () => ({ user: null });
export const signInWithEmail = async () => ({ user: null });
export const signInWithGoogle = async () => ({ user: null });