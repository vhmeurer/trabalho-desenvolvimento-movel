import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserProfile = {
  name: string;
  email: string;
};

type ProfileContextValue = {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
};

const MOCK_PROFILE: UserProfile = {
  name: 'Marina Oliveira',
  email: 'marina.oliveira@email.com',
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, updateProfile] = useState(MOCK_PROFILE);

  return <ProfileContext.Provider value={{ profile, updateProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile deve ser usado dentro de <ProfileProvider>');
  return context;
}
