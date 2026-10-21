import { createContext, useContext, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type PreferencesContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  defaultReminderTime: string;
  setDefaultReminderTime: (value: string) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [darkModeChoice, setDarkMode] = useState<boolean | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultReminderTime, setDefaultReminderTime] = useState('08:00');

  const value: PreferencesContextValue = {
    darkMode: darkModeChoice ?? systemScheme === 'dark',
    setDarkMode,
    notificationsEnabled,
    setNotificationsEnabled,
    defaultReminderTime,
    setDefaultReminderTime,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences deve ser usado dentro de <PreferencesProvider>');
  return context;
}
