import { HabitForm } from '@/components/habit-form';
import { useHabits } from '@/context/habits-context';
import { goBackOr } from '@/utils/navigation';

export default function NewHabitScreen() {
  const { addHabit } = useHabits();

  return (
    <HabitForm
      submitLabel="Criar hábito"
      onCancel={() => goBackOr('/habitos')}
      onSubmit={(input) => {
        addHabit(input);
        goBackOr('/habitos');
      }}
    />
  );
}
