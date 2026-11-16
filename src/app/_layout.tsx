import { Sora_400Regular } from '@expo-google-fonts/sora/400Regular';
import { Sora_500Medium } from '@expo-google-fonts/sora/500Medium';
import { Sora_600SemiBold } from '@expo-google-fonts/sora/600SemiBold';
import { Sora_700Bold } from '@expo-google-fonts/sora/700Bold';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';

import { AppDarkTheme, getNavigationTheme, LightTheme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { HabitsProvider } from '@/context/habits-context';
import { ProfileProvider } from '@/context/profile-context';
import { PreferencesProvider, usePreferences } from '@/context/preferences-context';

function ThemedApp() {
  const { darkMode } = usePreferences();
  const { user, initializing: authInitializing } = useAuth();
  const [fontsLoaded, fontError] = useFonts({ Sora_400Regular, Sora_500Medium, Sora_600SemiBold, Sora_700Bold });
  const initializing = authInitializing || (!fontsLoaded && !fontError);
  const paperTheme = darkMode ? AppDarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={getNavigationTheme(paperTheme, darkMode)}>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        {initializing ? (
          <View style={[styles.loading, { backgroundColor: paperTheme.colors.background }]}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Protected guard={!user}>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="registro" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="perfil/editar" options={{ title: 'Editar perfil' }} />
              <Stack.Screen name="habito/novo" options={{ title: 'Novo hábito', presentation: 'modal' }} />
              <Stack.Screen name="habito/[id]" options={{ title: 'Detalhes do hábito' }} />
              <Stack.Screen name="habito/editar/[id]" options={{ title: 'Editar hábito' }} />
            </Stack.Protected>
          </Stack>
        )}
      </ThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <ProfileProvider>
          <HabitsProvider>
            <ThemedApp />
          </HabitsProvider>
        </ProfileProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
