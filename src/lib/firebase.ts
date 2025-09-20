
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut, type User as FirebaseAuthUser, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import type { User as AppUser } from '@/lib/placeholder-data';


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

// Function to create a user profile in Firestore
export const createUserProfileDocument = async (firebaseUser: FirebaseAuthUser, additionalData: Partial<AppUser>) => {
  if (!firebaseUser) return;

  const userRef = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email } = firebaseUser;
    const { role } = additionalData;

    try {
      await setDoc(userRef, {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Usuario',
        email,
        role: role || 'fan',
        // Default empty values for profile completion
        bio: '',
        location: '',
        preferences: [],
        socials: {
          facebook: '',
          youtube: '',
          instagram: '',
          tiktok: ''
        },
        website: '',
        mapUrl: '',
        avatar: {
          id: 'avatar_placeholder',
          imageUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
          imageHint: 'person avatar',
          description: 'User avatar placeholder'
        }
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return userRef;
};

// Function to update a user profile in Firestore
export const updateUserProfile = async (uid: string, data: Partial<AppUser>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}


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
export type { FirebaseAuthUser, AppUser };

    
