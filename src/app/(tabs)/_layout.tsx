import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { useTheme } from 'react-native-paper';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <MaterialCommunityIcons name={name} color={color as string} size={size} />;
  };
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Hoje', tabBarIcon: tabIcon('calendar-check') }} />
      <Tabs.Screen name="habitos" options={{ title: 'Hábitos', tabBarIcon: tabIcon('format-list-checks') }} />
      <Tabs.Screen name="estatisticas" options={{ title: 'Estatísticas', tabBarIcon: tabIcon('chart-bar') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: tabIcon('account-circle') }} />
    </Tabs>
  );
}
