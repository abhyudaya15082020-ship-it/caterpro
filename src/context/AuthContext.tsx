import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInAnonymously,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (asRole?: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: 'customer',
  loading: true,
  signInWithGoogle: async () => {},
  signInAsGuest: async () => {},
  switchRole: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfile(data);
            setRole(data.role || 'customer');
          } else {
            // New user registration in Firestore
            const initialRole: UserRole = currentUser.email === 'abhyudaya15082020@gmail.com' ? 'admin' : 'customer';
            const newProfile: UserProfile = {
              userId: currentUser.uid,
              name: currentUser.displayName || 'Catering Customer',
              email: currentUser.email || 'guest@caterpro.com',
              role: initialRole,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
            setRole(initialRole);
          }
        } catch (error) {
          console.warn('User doc sync notice (using local fallback state):', error);
          const fallbackProfile: UserProfile = {
            userId: currentUser.uid,
            name: currentUser.displayName || 'Catering Guest User',
            email: currentUser.email || 'guest@caterpro.com',
            role: 'customer',
            createdAt: new Date().toISOString()
          };
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signInAsGuest = async (asRole: UserRole = 'customer') => {
    try {
      const cred = await signInAnonymously(auth);
      const guestProfile: UserProfile = {
        userId: cred.user.uid,
        name: asRole === 'admin' ? 'Super Admin' : asRole === 'vendor' ? 'Master Caterer Vendor' : 'Valued Customer',
        email: `guest_${cred.user.uid.slice(0, 5)}@caterpro.com`,
        role: asRole,
        createdAt: new Date().toISOString()
      };
      setProfile(guestProfile);
      setRole(asRole);
    } catch (error) {
      console.error('Guest Sign In Error:', error);
      // Local fallback
      const mockUid = 'guest_' + Math.random().toString(36).substring(2, 9);
      setProfile({
        userId: mockUid,
        name: asRole === 'admin' ? 'Super Admin' : asRole === 'vendor' ? 'Master Caterer Vendor' : 'Valued Customer',
        email: 'guest@caterpro.com',
        role: asRole,
        createdAt: new Date().toISOString()
      });
      setRole(asRole);
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (profile) {
      setProfile({ ...profile, role: newRole });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setRole('customer');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      loading,
      signInWithGoogle,
      signInAsGuest,
      switchRole,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
