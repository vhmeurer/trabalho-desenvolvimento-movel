import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { Fonts, Spacing } from '@/constants/theme';

type StatTileProps = {
  value: string;
  unit?: string;
  label: string;
};

export function StatTile({ value, unit, label }: StatTileProps) {
  const theme = useTheme();
  return (
    <View
      style={[styles.tile, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}
      accessible
      accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ''}`}>
      <Text style={[styles.value, { color: theme.colors.onSurface }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
        {unit ? <Text style={[styles.unit, { color: theme.colors.onSurfaceVariant }]}> {unit}</Text> : null}
      </Text>
      <Text variant="labelMedium" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: Spacing.md - 4,
    paddingHorizontal: Spacing.md - 4,
    gap: 2,
  },
  value: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  unit: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    letterSpacing: 0,
  },
});
