import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { Fonts, Spacing } from '@/constants/theme';
import type { Habit } from '@/types/habit';
import { isCompletedToday } from '@/utils/habit-stats';

function motivationMessage(done: number, total: number) {
  if (total === 0) return 'Nenhum hábito agendado para hoje.';
  if (done === total) return 'Corrente completa. Você concluiu tudo hoje!';
  if (done === 0) return 'Marque o primeiro hábito para começar a corrente.';
  if (done / total >= 0.5) return 'Falta pouco para fechar a corrente.';
  return 'Cada elo conta. Continue!';
}

type TodayProgressProps = {
  habits: Habit[];
};

export function TodayProgress({ habits }: TodayProgressProps) {
  const theme = useTheme();
  const background = theme.dark ? theme.colors.primaryContainer : theme.colors.primary;
  const foreground = theme.dark ? theme.colors.onPrimaryContainer : theme.colors.onPrimary;
  const faded = `${foreground}55`;

  const ordered = [...habits].sort((a, b) => Number(isCompletedToday(b)) - Number(isCompletedToday(a)));
  const done = ordered.filter(isCompletedToday).length;
  const total = ordered.length;

  return (
    <View
      style={[styles.panel, { backgroundColor: background }]}
      accessible
      accessibilityLabel={`${done} de ${total} hábitos feitos hoje`}>
      <View style={styles.counter}>
        <Text style={[styles.count, { color: foreground }]}>
          {done}
          <Text style={[styles.total, { color: faded }]}>/{total}</Text>
        </Text>
        <Text variant="titleSmall" style={{ color: foreground }}>
          feitos hoje
        </Text>
      </View>

      {total > 0 && (
        <View style={styles.chain}>
          {ordered.map((habit, index) => {
            const filled = isCompletedToday(habit);
            const linked = filled && index < done - 1;
            return (
              <View key={habit.id} style={[styles.cell, index < total - 1 && styles.grow]}>
                <View
                  style={[
                    styles.node,
                    { borderColor: filled ? foreground : faded, backgroundColor: filled ? foreground : 'transparent' },
                  ]}
                />
                {index < total - 1 && (
                  <View
                    style={[
                      styles.link,
                      linked ? { backgroundColor: foreground } : [styles.loose, { backgroundColor: faded }],
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      )}

      <Text variant="bodyMedium" style={{ color: foreground }}>
        {motivationMessage(done, total)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 20,
    padding: Spacing.lg - 4,
    gap: Spacing.md,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  count: {
    fontFamily: Fonts.bold,
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -1,
  },
  total: {
    fontFamily: Fonts.semibold,
    fontSize: 28,
  },
  chain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
  node: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  link: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  loose: {
    height: 1,
    marginHorizontal: 6,
  },
});
