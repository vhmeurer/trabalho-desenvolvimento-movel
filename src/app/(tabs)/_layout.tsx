import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';
import { useTheme } from 'react-native-paper';

import { Fonts } from '@/constants/theme';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

function tabIcon(name: IconName, focusedName: IconName) {
  return function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    return <MaterialCommunityIcons name={focused ? focusedName : name} color={color as string} size={size} />;
  };
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
        tabBarLabelStyle: { fontFamily: Fonts.medium, fontSize: 11 },
        headerStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: Fonts.semibold, fontSize: 20, color: theme.colors.onBackground },
        headerTitleAlign: 'left',
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Hoje', headerShown: false, tabBarIcon: tabIcon('link-variant', 'link-variant') }}
      />
      <Tabs.Screen
        name="habitos"
        options={{ title: 'Hábitos', tabBarIcon: tabIcon('format-list-checks', 'format-list-checks') }}
      />
      <Tabs.Screen
        name="estatisticas"
        options={{ title: 'Estatísticas', tabBarIcon: tabIcon('chart-box-outline', 'chart-box') }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: 'Perfil', tabBarIcon: tabIcon('account-circle-outline', 'account-circle') }}
      />
    </Tabs>
  );
}
