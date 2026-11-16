import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth-context';
import { db } from '@/services/firebase';

export type UserProfile = {
  name: string;
  email: string;
};

type ProfileContextValue = {
  profile: UserProfile;
  updateProfile: (changes: Pick<UserProfile, 'name'>) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [stored, setStored] = useState<{ uid: string | null; name: string | null }>({ uid: null, name: null });

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      const name = snapshot.get('name');
      setStored({ uid, name: typeof name === 'string' ? name : null });
    });
  }, [uid]);

  const storedName = stored.uid === uid ? stored.name : null;

  const value: ProfileContextValue = {
    profile: {
      name: storedName ?? user?.displayName ?? '',
      email: user?.email ?? '',
    },
    updateProfile: async ({ name }) => {
      if (!user) throw new Error('É preciso estar logado para alterar o perfil');
      await setDoc(doc(db, 'users', user.uid), { name, email: user.email }, { merge: true });
      await updateAuthProfile(user, { displayName: name });
    },
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile deve ser usado dentro de <ProfileProvider>');
  return context;
}
