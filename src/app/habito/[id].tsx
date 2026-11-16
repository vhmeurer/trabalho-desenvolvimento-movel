import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button, Card, Chip, Dialog, Divider, List, Portal, Text, useTheme } from 'react-native-paper';

import { DayChain } from '@/components/day-chain';
import { EmptyState } from '@/components/empty-state';
import { HabitIcon } from '@/components/habit-icon';
import { StatTile } from '@/components/stat-tile';
import { formatFrequency, getCategory } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useHabits } from '@/context/habits-context';
import { addDays, formatShortDate, parseDateKey } from '@/utils/date';
import {
  bestStreak,
  completionRate,
  currentStreak,
  isCompletedToday,
  isScheduledOn,
} from '@/utils/habit-stats';
import { goBackOr } from '@/utils/navigation';

const HISTORY_WEEKS = 4;

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
  const current = currentStreak(habit);
  const best = bestStreak(habit);

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
          <HabitIcon icon={habit.icon} color={habit.color} size={56} />
          <View style={styles.headerText}>
            <Text variant="headlineSmall">{habit.name}</Text>
            {habit.description !== '' && (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {habit.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.chips}>
          <Chip compact mode="outlined" icon={category.icon}>
            {category.label}
          </Chip>
          <Chip compact mode="outlined" icon="calendar-sync">
            {formatFrequency(habit)}
          </Chip>
        </View>

        <Button
          mode={doneToday ? 'outlined' : 'contained'}
          icon={doneToday ? 'check-circle' : 'checkbox-blank-circle-outline'}
          onPress={() => toggleToday(habit.id)}
          disabled={!scheduledToday && !doneToday}
          buttonColor={doneToday ? undefined : habit.color}
          textColor={doneToday ? habit.color : '#FFFFFF'}
          style={doneToday && { borderColor: habit.color }}
          contentStyle={styles.mainButton}>
          {doneToday ? 'Feito hoje' : scheduledToday ? 'Marcar como feito hoje' : 'Não programado para hoje'}
        </Button>

        <View style={styles.stats}>
          <StatTile value={String(current)} unit={current === 1 ? 'dia' : 'dias'} label="Sequência" />
          <StatTile value={String(best)} unit={best === 1 ? 'dia' : 'dias'} label="Recorde" />
          <StatTile value={`${Math.round(completionRate(habit, 30) * 100)}%`} label="Últimos 30 dias" />
        </View>

        <View style={[styles.history, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
          <View>
            <Text variant="titleMedium">Histórico</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Últimas {HISTORY_WEEKS} semanas, uma corrente por semana
            </Text>
          </View>
          {Array.from({ length: HISTORY_WEEKS }, (_, index) => HISTORY_WEEKS - 1 - index).map((weeksAgo) => (
            <DayChain key={weeksAgo} habit={habit} endDate={addDays(new Date(), -7 * weeksAgo)} labels="date" />
          ))}
          <View style={styles.legend}>
            <Legend label="Feito" node={{ backgroundColor: habit.color, borderColor: habit.color }} />
            <Legend label="Perdido" node={{ borderColor: theme.colors.outline }} />
            <Legend label="Livre" node={[styles.legendOff, { backgroundColor: theme.colors.outlineVariant }]} />
          </View>
        </View>

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

function Legend({ label, node }: { label: string; node: StyleProp<ViewStyle> }) {
  return (
    <View style={styles.legendItem}>
      <View style={styles.legendSlot}>
        <View style={[styles.legendNode, node]} />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  mainButton: {
    paddingVertical: Spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  history: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendSlot: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  legendOff: {
    width: 6,
    height: 6,
    borderWidth: 0,
  },
});
