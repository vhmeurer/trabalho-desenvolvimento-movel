import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, FAB, ProgressBar, Snackbar, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { HabitCard } from '@/components/habit-card';
import { getCategory } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useHabits } from '@/context/habits-context';
import type { Habit } from '@/types/habit';
import { formatLongDate } from '@/utils/date';
import { isCompletedToday, isScheduledOn } from '@/utils/habit-stats';

function motivationMessage(progress: number) {
  if (progress === 1) return 'Parabéns, você concluiu tudo hoje!';
  if (progress >= 0.5) return 'Falta pouco, continue assim!';
  return 'Cada pequeno passo conta. Bora começar?';
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function TodayScreen() {
  const theme = useTheme();
  const { habits, toggleToday } = useHabits();
  const [snackbar, setSnackbar] = useState<{ habitId: string; message: string } | null>(null);

  const today = new Date();
  const scheduled = habits.filter((habit) => isScheduledOn(habit, today));
  const pending = scheduled.filter((habit) => !isCompletedToday(habit));
  const done = scheduled.filter(isCompletedToday);
  const progress = scheduled.length > 0 ? done.length / scheduled.length : 0;

  function handleToggle(habit: Habit) {
    const message = isCompletedToday(habit) ? `"${habit.name}" desmarcado` : `"${habit.name}" concluído!`;
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
        subtitle={habit.goal ? `${category} · ${habit.goal}` : category}
        checked={isCompletedToday(habit)}
        onToggle={() => handleToggle(habit)}
        onPress={() => openHabit(habit.id)}
      />
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text variant="headlineSmall">Olá!</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {capitalize(formatLongDate(today))}
          </Text>
        </View>

        <Card mode="contained" style={{ backgroundColor: theme.colors.primaryContainer }}>
          <Card.Content style={styles.progressContent}>
            <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
              {done.length} de {scheduled.length} hábitos concluídos
            </Text>
            <View style={styles.progressWrapper}>
              <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
            </View>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
              {motivationMessage(progress)}
            </Text>
          </Card.Content>
        </Card>

        {scheduled.length === 0 ? (
          <EmptyState
            icon="calendar-blank"
            title="Nenhum hábito para hoje"
            message="Crie um hábito para começar a acompanhar sua rotina."
            actionLabel="Criar hábito"
            onAction={() => router.push('/habito/novo')}
          />
        ) : (
          <>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Pendentes ({pending.length})
            </Text>
            {pending.length === 0 ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Nenhum hábito pendente. Bom trabalho!
              </Text>
            ) : (
              pending.map(renderHabit)
            )}

            {done.length > 0 && (
              <>
                <Text variant="titleSmall" style={styles.sectionTitle}>
                  Concluídos ({done.length})
                </Text>
                {done.map(renderHabit)}
              </>
            )}
          </>
        )}
      </ScrollView>

      <FAB icon="plus" label="Novo hábito" style={styles.fab} onPress={() => router.push('/habito/novo')} />

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
    paddingBottom: 96,
    gap: Spacing.md,
  },
  progressContent: {
    gap: Spacing.sm,
  },
  progressWrapper: {
    height: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  snackbar: {
    bottom: 72,
  },
  sectionTitle: {
    marginTop: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
  },
});
