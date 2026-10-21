import { StyleSheet, View } from 'react-native';
import { Avatar, Card, Checkbox, Icon, Text, useTheme } from 'react-native-paper';

import { formatFrequency, getCategory } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
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
    <Card mode="elevated" onPress={onPress} style={checked && styles.checked}>
      <Card.Title
        title={habit.name}
        titleVariant="titleMedium"
        titleStyle={checked && styles.checkedTitle}
        subtitle={subtitle ?? `${getCategory(habit.category).label} · ${formatFrequency(habit)}`}
        subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
        left={(props) => (
          <Avatar.Icon {...props} icon={habit.icon} color="#FFFFFF" style={{ backgroundColor: habit.color }} />
        )}
        right={() => (
          <View style={styles.right}>
            <View style={styles.streak} accessibilityLabel={`Sequência de ${streak} dias`}>
              <Icon source="fire" size={18} color={streak > 0 ? '#FB8C00' : theme.colors.outline} />
              <Text variant="labelLarge">{streak}</Text>
            </View>
            {onToggle ? (
              <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={onToggle} color={habit.color} />
            ) : (
              <Icon source="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
            )}
          </View>
        )}
        rightStyle={styles.rightContainer}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  checked: {
    opacity: 0.7,
  },
  checkedTitle: {
    textDecorationLine: 'line-through',
  },
  rightContainer: {
    marginRight: Spacing.sm,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
