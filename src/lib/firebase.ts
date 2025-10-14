
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut, type User as FirebaseAuthUser, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import type { VasílalaUser, VerificationRequest, UserType } from '@/types/user';
import { USER_PERMISSIONS } from '@/types/user';


const firebaseConfig = {
  "projectId": "studio-9223473200-95692",
  "appId": "1:679951859699:web:7ab2391fc86404e9bcdc86",
  "storageBucket": "studio-9223473200-95692.appspot.com",
  "apiKey": "AIzaSyBmABxXlDQ1XJLK1xl34CSpVo120jL1L74",
  "authDomain": "studio-9223473200-95692.firebaseapp.com",
  "messagingSenderId": "679951859699"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

// Function to create a user profile in Firestore for Vasílala
export const createUserProfileDocument = async (firebaseUser: FirebaseAuthUser, additionalData?: Partial<VasílalaUser>) => {
  if (!firebaseUser) return;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = firebaseUser;
    const now = new Date();

    // Generar username único basado en el displayName o email
    const baseUsername = displayName?.toLowerCase().replace(/\s+/g, '') || 
                        email?.split('@')[0] || 
                        `user${Date.now()}`;
    
    const username = await generateUniqueUsername(baseUsername);

    try {
      const newUser: VasílalaUser = {
        id: firebaseUser.uid,
        email: email || '',
        username,
        displayName: displayName || 'Usuario',
        avatar: photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
        userType: 'fan', // Todos empiezan como Fan
        verified: false,
        verificationStatus: 'pending',
        socialLinks: {},
        bio: '',
        location: '',
        createdAt: now,
        updatedAt: now,
        lastLogin: now,
        notifications: {
          email: true,
          push: true,
          marketing: false,
        },
        followers: 0,
        following: 0,
        totalPosts: 0,
        totalLikes: 0,
        ...additionalData
      };

      await setDoc(userRef, newUser);
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return userRef;
};

// Función para generar username único
const generateUniqueUsername = async (baseUsername: string): Promise<string> => {
  let username = baseUsername;
  let counter = 1;
  
  while (await isUsernameTaken(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
};

// Función para verificar si un username ya existe
const isUsernameTaken = async (username: string): Promise<boolean> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Function to update a user profile in Firestore
export const updateUserProfile = async (uid: string, data: Partial<VasílalaUser>) => {
  const userRef = doc(db, 'users', uid);
  const updateData = {
    ...data,
    updatedAt: new Date()
  };
  await updateDoc(userRef, updateData);
};

// Función para solicitar cambio de tipo de usuario
export const requestUserTypeChange = async (
  userId: string, 
  requestedType: UserType, 
  documents: string[], 
  businessInfo?: VerificationRequest['businessInfo']
): Promise<string> => {
  try {
    const verificationRef = collection(db, 'verificationRequests');
    const request: Omit<VerificationRequest, 'id'> = {
      userId,
      requestedUserType: requestedType,
      documents,
      businessInfo,
      status: 'pending',
      submittedAt: new Date(),
    };
    
    const docRef = await addDoc(verificationRef, request);
    return docRef.id;
  } catch (error) {
    console.error("Error creating verification request", error);
    throw error;
  }
};

// Función para obtener el perfil completo del usuario
export const getUserProfile = async (uid: string): Promise<VasílalaUser | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as VasílalaUser;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile", error);
    return null;
  }
};

// Función para verificar permisos del usuario
export const checkUserPermission = (user: VasílalaUser, permission: keyof typeof USER_PERMISSIONS.fan): boolean => {
  if (!user.verified && user.userType !== 'fan') {
    return false; // Solo fans no verificados pueden usar funciones básicas
  }
  
  const permissions = USER_PERMISSIONS[user.userType];
  return permissions[permission] as boolean;
};


export { 
    app, 
    auth, 
    googleProvider, 
    storage, 
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    getDoc,
    doc,
    signInWithRedirect,
    getRedirectResult
};
export type { FirebaseAuthUser, VasílalaUser };

    
