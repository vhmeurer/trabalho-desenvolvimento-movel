import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Chip, Dialog, Divider, List, Portal, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { formatFrequency, getCategory } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useHabits } from '@/context/habits-context';
import { formatShortDate, lastDays, parseDateKey } from '@/utils/date';
import {
  bestStreak,
  completionRate,
  currentStreak,
  isCompletedOn,
  isCompletedToday,
  isScheduledOn,
} from '@/utils/habit-stats';
import { goBackOr } from '@/utils/navigation';

const HISTORY_DAYS = 28;

function formatDays(count: number) {
  return `${count} ${count === 1 ? 'dia' : 'dias'}`;
}

export default function HabitDetailsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, toggleToday, deleteHabit } = useHabits();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const habit = getHabit(id);

  if (!habit) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Hábito não encontrado"
          message="Ele pode ter sido excluído."
          actionLabel="Ver meus hábitos"
          onAction={() => router.replace('/habitos')}
        />
      </View>
    );
  }

  const habitId = habit.id;
  const category = getCategory(habit.category);
  const doneToday = isCompletedToday(habit);
  const scheduledToday = isScheduledOn(habit, new Date());
  const stats = [
    { label: 'Sequência', value: formatDays(currentStreak(habit)), icon: 'fire' },
    { label: 'Recorde', value: formatDays(bestStreak(habit)), icon: 'trophy' },
    { label: 'Últimos 30 dias', value: `${Math.round(completionRate(habit, 30) * 100)}%`, icon: 'percent' },
  ];

  function handleDelete() {
    setConfirmDelete(false);
    goBackOr('/habitos');
    deleteHabit(habitId);
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: habit.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar.Icon size={72} icon={habit.icon} color="#FFFFFF" style={{ backgroundColor: habit.color }} />
          <Text variant="headlineSmall" style={styles.center}>
            {habit.name}
          </Text>
          {habit.description !== '' && (
            <Text variant="bodyMedium" style={[styles.center, { color: theme.colors.onSurfaceVariant }]}>
              {habit.description}
            </Text>
          )}
          <View style={styles.chips}>
            <Chip compact icon={category.icon}>
              {category.label}
            </Chip>
            <Chip compact icon="calendar-sync">
              {formatFrequency(habit)}
            </Chip>
          </View>
        </View>

        <Button
          mode={doneToday ? 'contained-tonal' : 'contained'}
          icon={doneToday ? 'check-circle' : 'checkbox-blank-circle-outline'}
          onPress={() => toggleToday(habit.id)}
          disabled={!scheduledToday && !doneToday}
          buttonColor={doneToday ? undefined : habit.color}
          textColor={doneToday ? undefined : '#FFFFFF'}
          contentStyle={styles.mainButton}>
          {doneToday ? 'Concluído hoje' : scheduledToday ? 'Marcar como feito hoje' : 'Não programado para hoje'}
        </Button>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <Card key={stat.label} mode="contained" style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Avatar.Icon size={32} icon={stat.icon} />
                <Text variant="titleMedium">{stat.value}</Text>
                <Text variant="labelSmall" style={[styles.center, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Card mode="outlined">
          <Card.Title title="Histórico" subtitle={`Últimas ${HISTORY_DAYS / 7} semanas`} />
          <Card.Content>
            <View style={styles.grid}>
              {lastDays(HISTORY_DAYS).map((date) => {
                const done = isCompletedOn(habit, date);
                const scheduled = isScheduledOn(habit, date);
                return (
                  <View
                    key={date.toISOString()}
                    accessibilityLabel={`${formatShortDate(date)}: ${done ? 'feito' : scheduled ? 'não feito' : 'livre'}`}
                    style={[
                      styles.day,
                      done
                        ? { backgroundColor: habit.color }
                        : scheduled
                          ? { backgroundColor: theme.colors.surfaceVariant }
                          : { borderWidth: 1, borderColor: theme.colors.outlineVariant },
                    ]}>
                    <Text
                      variant="labelSmall"
                      style={{ color: done ? '#FFFFFF' : theme.colors.onSurfaceVariant }}>
                      {date.getDate()}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.legend}>
              <Legend color={habit.color} label="Feito" />
              <Legend color={theme.colors.surfaceVariant} label="Não feito" />
              <Legend color="transparent" borderColor={theme.colors.outlineVariant} label="Livre" />
            </View>
          </Card.Content>
        </Card>

        <Card mode="outlined">
          <List.Item title="Meta" description={habit.goal || 'Sem meta definida'} left={(props) => <List.Icon {...props} icon="target" />} />
          <Divider />
          <List.Item
            title="Lembrete"
            description={habit.reminderTime ? `Todos os dias às ${habit.reminderTime}` : 'Desativado'}
            left={(props) => <List.Icon {...props} icon={habit.reminderTime ? 'bell-ring-outline' : 'bell-off-outline'} />}
          />
          <Divider />
          <List.Item
            title="Criado em"
            description={formatShortDate(parseDateKey(habit.createdAt))}
            left={(props) => <List.Icon {...props} icon="calendar-plus" />}
          />
        </Card>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            icon="pencil"
            style={styles.flex}
            onPress={() => router.push({ pathname: '/habito/editar/[id]', params: { id: habit.id } })}>
            Editar
          </Button>
          <Button
            mode="outlined"
            icon="delete"
            style={styles.flex}
            textColor={theme.colors.error}
            onPress={() => setConfirmDelete(true)}>
            Excluir
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={confirmDelete} onDismiss={() => setConfirmDelete(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.center}>Excluir hábito?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              &quot;{habit.name}&quot; e todo o seu histórico serão apagados. Essa ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDelete(false)}>Cancelar</Button>
            <Button textColor={theme.colors.error} onPress={handleDelete}>
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function Legend({ color, label, borderColor }: { color: string; label: string; borderColor?: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }, borderColor && { borderWidth: 1, borderColor }]} />
      <Text variant="labelSmall">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  center: {
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mainButton: {
    paddingVertical: Spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  day: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
