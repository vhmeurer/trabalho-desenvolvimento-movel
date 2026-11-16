import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { configureFonts, MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const Fonts = {
  regular: 'Sora_400Regular',
  medium: 'Sora_500Medium',
  semibold: 'Sora_600SemiBold',
  bold: 'Sora_700Bold',
} as const;

function familyFor(variant: string) {
  if (variant.startsWith('display')) return Fonts.bold;
  if (variant.startsWith('headline')) return Fonts.semibold;
  if (variant.startsWith('title')) return Fonts.semibold;
  if (variant.startsWith('label')) return Fonts.medium;
  return Fonts.regular;
}

const fontConfig = Object.fromEntries(
  Object.entries(MD3LightTheme.fonts).map(([variant, style]) => [
    variant,
    { ...style, fontFamily: familyFor(variant), fontWeight: 'normal' as const },
  ])
);

const fonts = configureFonts({ config: fontConfig });

export const Ink = {
  ink: '#1F3A93',
  inkDeep: '#14265F',
  paper: '#F5F7FB',
  sheet: '#FFFFFF',
  text: '#141B2D',
  muted: '#5B6478',
  rule: '#D9DEEA',
  night: '#0E1426',
  nightSheet: '#172038',
  nightRule: '#2A355A',
  inkLight: '#9DB4FF',
} as const;

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: Ink.ink,
    onPrimary: '#FFFFFF',
    primaryContainer: '#DCE4FF',
    onPrimaryContainer: Ink.inkDeep,
    secondary: '#4A5577',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E3E8F5',
    onSecondaryContainer: '#1B2440',
    tertiary: '#B4531F',
    tertiaryContainer: '#FFE3D3',
    onTertiaryContainer: '#3B1500',
    background: Ink.paper,
    onBackground: Ink.text,
    surface: Ink.sheet,
    onSurface: Ink.text,
    surfaceVariant: '#E9EDF6',
    onSurfaceVariant: Ink.muted,
    outline: '#8A93A8',
    outlineVariant: Ink.rule,
    elevation: {
      level0: 'transparent',
      level1: Ink.sheet,
      level2: '#F0F3FA',
      level3: '#EBEFF8',
      level4: '#E8ECF7',
      level5: '#E4E9F5',
    },
  },
};

export const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Ink.inkLight,
    onPrimary: '#0A1A4D',
    primaryContainer: '#263C80',
    onPrimaryContainer: '#DCE4FF',
    secondary: '#B9C2DE',
    onSecondary: '#232C47',
    secondaryContainer: '#2C3654',
    onSecondaryContainer: '#DCE2F7',
    tertiary: '#FFB58F',
    tertiaryContainer: '#6E2E07',
    onTertiaryContainer: '#FFE3D3',
    background: Ink.night,
    onBackground: '#E3E7F3',
    surface: Ink.nightSheet,
    onSurface: '#E3E7F3',
    surfaceVariant: '#1E2844',
    onSurfaceVariant: '#A3ABC2',
    outline: '#6B7491',
    outlineVariant: Ink.nightRule,
    elevation: {
      level0: 'transparent',
      level1: Ink.nightSheet,
      level2: '#1B2541',
      level3: '#1F2946',
      level4: '#212C4A',
      level5: '#24304F',
    },
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
      card: paperTheme.colors.background,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outlineVariant,
    },
    fonts: {
      regular: { fontFamily: Fonts.regular, fontWeight: 'normal' },
      medium: { fontFamily: Fonts.medium, fontWeight: 'normal' },
      bold: { fontFamily: Fonts.semibold, fontWeight: 'normal' },
      heavy: { fontFamily: Fonts.bold, fontWeight: 'normal' },
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
