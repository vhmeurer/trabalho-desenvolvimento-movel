import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { Fonts } from '@/constants/theme';
import type { Habit } from '@/types/habit';
import { addDays, isSameDay } from '@/utils/date';
import { existedOn, isCompletedOn, isScheduledOn } from '@/utils/habit-stats';

type DayState = 'done' | 'missed' | 'pending' | 'off';

const INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const NODE = 14;
const LINK = 3;

function dayState(habit: Habit, date: Date, isToday: boolean): DayState {
  if (isCompletedOn(habit, date)) return 'done';
  if (!existedOn(habit, date) || !isScheduledOn(habit, date)) return 'off';
  return isToday ? 'pending' : 'missed';
}

function holds(state: DayState) {
  return state === 'done' || state === 'off';
}

type DayChainProps = {
  habit: Habit;
  days?: number;
  endDate?: Date;
  labels?: 'weekday' | 'date';
};

export function DayChain({ habit, days = 7, endDate, labels = 'weekday' }: DayChainProps) {
  const theme = useTheme();
  const today = new Date();
  const end = endDate ?? today;
  const dates = Array.from({ length: days }, (_, index) => addDays(end, index - (days - 1)));
  const states = dates.map((date): DayState => {
    if (date > today && !isSameDay(date, today)) return 'off';
    return dayState(habit, date, isSameDay(date, today));
  });
  const doneCount = states.filter((state) => state === 'done').length;

  function nodeStyle(state: DayState) {
    switch (state) {
      case 'done':
        return { backgroundColor: habit.color, borderColor: habit.color };
      case 'pending':
        return { backgroundColor: theme.colors.surface, borderColor: habit.color, borderStyle: 'dashed' as const };
      case 'missed':
        return { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline };
      case 'off':
        return [styles.offNode, { backgroundColor: theme.colors.outlineVariant, borderColor: theme.colors.outlineVariant }];
    }
  }

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Feito em ${doneCount} dos últimos ${days} dias`}>
      {dates.map((date, index) => {
        const state = states[index];
        const next = states[index + 1];
        const linked = next !== undefined && holds(state) && holds(next) && (state === 'done' || next === 'done');
        const isToday = isSameDay(date, today);

        return (
          <View key={date.toISOString()} style={[styles.cell, next !== undefined && styles.grow]}>
            <View style={styles.track}>
              <View style={styles.slot}>
                <View style={[styles.node, nodeStyle(state)]} />
              </View>
              {next !== undefined && (
                <View
                  style={[
                    styles.link,
                    linked
                      ? { backgroundColor: habit.color }
                      : [styles.brokenLink, { backgroundColor: theme.colors.outlineVariant }],
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: isToday ? theme.colors.onSurface : theme.colors.onSurfaceVariant },
                isToday && styles.todayLabel,
              ]}>
              {labels === 'date' ? date.getDate() : INITIALS[date.getDay()]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    gap: 4,
  },
  grow: {
    flex: 1,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NODE,
  },
  slot: {
    width: NODE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 2,
  },
  offNode: {
    width: 6,
    height: 6,
    borderWidth: 0,
  },
  link: {
    flex: 1,
    height: LINK,
    borderRadius: LINK / 2,
    marginHorizontal: 2,
  },
  brokenLink: {
    height: 1,
    marginHorizontal: 6,
  },
  label: {
    width: NODE + 8,
    marginLeft: -4,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12,
    fontFamily: Fonts.medium,
  },
  todayLabel: {
    fontFamily: Fonts.bold,
  },
});
