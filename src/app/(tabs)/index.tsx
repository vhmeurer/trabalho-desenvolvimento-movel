import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Snackbar, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { HabitCard } from '@/components/habit-card';
import { QuoteCard } from '@/components/quote-card';
import { TodayProgress } from '@/components/today-progress';
import { getCategory } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useHabits } from '@/context/habits-context';
import { useProfile } from '@/context/profile-context';
import type { Habit } from '@/types/habit';
import { formatLongDate } from '@/utils/date';
import { isCompletedToday, isScheduledOn } from '@/utils/habit-stats';

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function TodayScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { habits, loading, toggleToday } = useHabits();
  const [snackbar, setSnackbar] = useState<{ habitId: string; message: string } | null>(null);

  const firstName = profile.name.trim().split(/\s+/)[0];
  const today = new Date();
  const scheduled = habits.filter((habit) => isScheduledOn(habit, today));
  const pending = scheduled.filter((habit) => !isCompletedToday(habit));
  const done = scheduled.filter(isCompletedToday);

  function handleToggle(habit: Habit) {
    const message = isCompletedToday(habit) ? `"${habit.name}" desmarcado` : `"${habit.name}" feito!`;
    toggleToday(habit.id);
    setSnackbar({ habitId: habit.id, message });
  }

  function openHabit(id: string) {
    router.push({ pathname: '/habito/[id]', params: { id } });
  }

  function renderHabit(habit: Habit) {
    const category = getCategory(habit.category).label;
    return (
      <HabitCard
        key={habit.id}
        habit={habit}
        subtitle={habit.goal || category}
        checked={isCompletedToday(habit)}
        onToggle={() => handleToggle(habit)}
        onPress={() => openHabit(habit.id)}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.greeting}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {capitalize(formatLongDate(today))}
          </Text>
          <Text variant="headlineMedium">{firstName ? `Olá, ${firstName}` : 'Olá'}</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : scheduled.length === 0 ? (
          <>
            <QuoteCard />
            <EmptyState
              icon="calendar-blank"
              title="Nenhum hábito para hoje"
              message="Crie um hábito para começar sua primeira corrente."
              actionLabel="Criar hábito"
              onAction={() => router.push('/habito/novo')}
            />
          </>
        ) : (
          <>
            <TodayProgress habits={scheduled} />

            <View style={styles.section}>
              <Text variant="titleMedium">Para fazer ({pending.length})</Text>
              {pending.length === 0 ? (
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Nada pendente por hoje.
                </Text>
              ) : (
                pending.map(renderHabit)
              )}
            </View>

            <QuoteCard />

            {done.length > 0 && (
              <View style={styles.section}>
                <Text variant="titleMedium">Feitos ({done.length})</Text>
                {done.map(renderHabit)}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Novo hábito"
        color={theme.colors.onPrimary}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/habito/novo')}
      />

      <Snackbar
        visible={snackbar !== null}
        onDismiss={() => setSnackbar(null)}
        duration={3000}
        wrapperStyle={styles.snackbar}
        action={{ label: 'Desfazer', onPress: () => snackbar && toggleToday(snackbar.habitId) }}>
        {snackbar?.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 104,
    gap: Spacing.lg,
  },
  greeting: {
    gap: 2,
  },
  section: {
    gap: Spacing.sm + 4,
  },
  snackbar: {
    bottom: 72,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    borderRadius: 16,
  },
});
