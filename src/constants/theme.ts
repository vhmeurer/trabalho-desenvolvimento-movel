

import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D6B',
    onPrimary: '#FFFFFF',
    primaryContainer: '#B4EFDB',
    onPrimaryContainer: '#00201A',
    secondary: '#4B635B',
    secondaryContainer: '#CDE8DD',
    onSecondaryContainer: '#06201A',
    tertiary: '#416277',
    tertiaryContainer: '#C5E7FF',
    background: '#F6FBF8',
    surface: '#F6FBF8',
    surfaceVariant: '#DBE5E0',
    onSurfaceVariant: '#3F4945',
    outline: '#6F7975',
    outlineVariant: '#BFC9C4',
  },
};

export const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#83D5BF',
    onPrimary: '#00382D',
    primaryContainer: '#005143',
    onPrimaryContainer: '#B4EFDB',
    secondary: '#B1CCC1',
    secondaryContainer: '#334B44',
    onSecondaryContainer: '#CDE8DD',
    tertiary: '#A9CBE3',
    tertiaryContainer: '#284A5E',
    background: '#0F1513',
    surface: '#0F1513',
    surfaceVariant: '#3F4945',
    onSurfaceVariant: '#BFC9C4',
    outline: '#89938F',
    outlineVariant: '#3F4945',
  },
};

export function getNavigationTheme(paperTheme: MD3Theme, dark: boolean): Theme {
  const base = dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outlineVariant,
    },
  };
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
