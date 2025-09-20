
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, onAuthStateChanged, getDoc, doc, db, createUserProfileDocument, type FirebaseAuthUser, type AppUser } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: (FirebaseAuthUser & { profile: AppUser | null }) | null;
  loading: boolean;
  setProfile: (profile: AppUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  setProfile: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<(FirebaseAuthUser & { profile: AppUser | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        let userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // This will be triggered for new sign-ups (email & Google)
          await createUserProfileDocument(user, { role: 'fan' });
          userDoc = await getDoc(userDocRef);
          toast({ title: '¡Bienvenido/a a Ritmo Latino!', description: 'Tu cuenta ha sido creada.' });
        }
        
        const userProfile = userDoc.data() as AppUser;
        setCurrentUser({ ...user, profile: userProfile });

        // --- Centralized Redirection Logic ---
        const isPublicAuthPath = pathname === '/login' || pathname === '/signup';
        const needsProfileCompletion = !userProfile.name || userProfile.name === 'Usuario';

        if (needsProfileCompletion) {
            if (pathname !== '/profile/edit') {
                toast({ title: 'Completa tu perfil', description: 'Por favor, completa tu información para continuar.' });
                router.push('/profile/edit');
            }
        } else if (isPublicAuthPath) {
            router.push('/');
        }
        // --- End of Redirection Logic ---

      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setProfile = (profile: AppUser) => {
      if(currentUser) {
          setCurrentUser({...currentUser, profile});
      }
  }

  const value = {
    currentUser,
    loading,
    setProfile,
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-background">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-lg">Cargando sesión...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
