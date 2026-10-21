export type Frequency = 'diario' | 'semanal';

export type CategoryId = 'saude' | 'estudos' | 'produtividade' | 'bem-estar' | 'financas';

export type Habit = {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: string;
  color: string;
  frequency: Frequency;
  weekDays: number[];
  goal: string;
  reminderTime: string | null;
  createdAt: string;
  completions: string[];
};

export type HabitInput = Omit<Habit, 'id' | 'createdAt' | 'completions'>;
