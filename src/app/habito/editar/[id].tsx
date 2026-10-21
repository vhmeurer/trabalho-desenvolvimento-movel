import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { HabitForm } from '@/components/habit-form';
import { useHabits } from '@/context/habits-context';
import { goBackOr } from '@/utils/navigation';

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, updateHabit } = useHabits();
  const habit = getHabit(id);

  if (!habit) {
    return (
      <EmptyState icon="alert-circle-outline" title="Hábito não encontrado" message="Ele pode ter sido excluído." />
    );
  }

  const { id: _id, createdAt: _createdAt, completions: _completions, ...initialValues } = habit;

  return (
    <HabitForm
      initialValues={initialValues}
      submitLabel="Salvar"
      onCancel={() => goBackOr({ pathname: '/habito/[id]', params: { id: habit.id } })}
      onSubmit={(input) => {
        updateHabit(habit.id, input);
        goBackOr({ pathname: '/habito/[id]', params: { id: habit.id } });
      }}
    />
  );
}
