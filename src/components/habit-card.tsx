import { StyleSheet, View } from 'react-native';
import { Card, Icon, Text, TouchableRipple, useTheme } from 'react-native-paper';

import { DayChain } from '@/components/day-chain';
import { HabitIcon } from '@/components/habit-icon';
import { formatFrequency, getCategory } from '@/constants/habits';
import { Fonts, Spacing } from '@/constants/theme';
import type { Habit } from '@/types/habit';
import { currentStreak } from '@/utils/habit-stats';

type HabitCardProps = {
  habit: Habit;
  subtitle?: string;
  onPress?: () => void;
  checked?: boolean;
  onToggle?: () => void;
};

export function HabitCard({ habit, subtitle, onPress, checked, onToggle }: HabitCardProps) {
  const theme = useTheme();
  const streak = currentStreak(habit);

  return (
    <Card
      mode="outlined"
      onPress={onPress}
      style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }}>
      <View style={styles.body}>
        <View style={styles.header}>
          <HabitIcon icon={habit.icon} color={habit.color} />

          <View style={styles.titles}>
            <Text variant="titleMedium" numberOfLines={1}>
              {habit.name}
            </Text>
            <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
              {subtitle ?? `${getCategory(habit.category).label} · ${formatFrequency(habit)}`}
            </Text>
          </View>

          <View style={styles.streak} accessible accessibilityLabel={`Sequência de ${streak} dias`}>
            <Text style={[styles.streakNumber, { color: streak > 0 ? theme.colors.onSurface : theme.colors.outline }]}>
              {streak}
            </Text>
            <Text style={[styles.streakUnit, { color: theme.colors.onSurfaceVariant }]}>
              {streak === 1 ? 'dia' : 'dias'}
            </Text>
          </View>

          {onToggle ? (
            <TouchableRipple
              borderless
              onPress={onToggle}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!checked }}
              accessibilityLabel={checked ? `Desmarcar ${habit.name}` : `Marcar ${habit.name} como feito hoje`}
              style={[
                styles.check,
                { borderColor: habit.color, backgroundColor: checked ? habit.color : 'transparent' },
              ]}>
              <Icon source="check" size={22} color={checked ? '#FFFFFF' : `${habit.color}66`} />
            </TouchableRipple>
          ) : (
            <Icon source="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
          )}
        </View>

        <DayChain habit={habit} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 4,
  },
  titles: {
    flex: 1,
    gap: 2,
  },
  streak: {
    alignItems: 'center',
    minWidth: 32,
  },
  streakNumber: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 24,
  },
  streakUnit: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    lineHeight: 12,
  },
  check: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
