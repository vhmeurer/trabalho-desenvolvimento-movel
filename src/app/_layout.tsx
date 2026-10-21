import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { AppDarkTheme, getNavigationTheme, LightTheme } from '@/constants/theme';
import { HabitsProvider } from '@/context/habits-context';
import { PreferencesProvider, usePreferences } from '@/context/preferences-context';

function ThemedApp() {
  const { darkMode } = usePreferences();
  const paperTheme = darkMode ? AppDarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={getNavigationTheme(paperTheme, darkMode)}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="habito/novo" options={{ title: 'Novo hábito', presentation: 'modal' }} />
          <Stack.Screen name="habito/[id]" options={{ title: 'Detalhes do hábito' }} />
          <Stack.Screen name="habito/editar/[id]" options={{ title: 'Editar hábito' }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <HabitsProvider>
        <ThemedApp />
      </HabitsProvider>
    </PreferencesProvider>
  );
}
