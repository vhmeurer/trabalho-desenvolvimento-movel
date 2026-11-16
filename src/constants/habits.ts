import type { CategoryId, Habit } from '@/types/habit';

export const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string }[] = [
  { id: 'saude', label: 'Saúde', icon: 'heart-pulse', color: '#D64545' },
  { id: 'estudos', label: 'Estudos', icon: 'book-open-variant', color: '#7B4FD6' },
  { id: 'produtividade', label: 'Produtividade', icon: 'briefcase-check', color: '#2F80ED' },
  { id: 'bem-estar', label: 'Bem-estar', icon: 'meditation', color: '#1E9E7A' },
  { id: 'financas', label: 'Finanças', icon: 'piggy-bank', color: '#C9961A' },
];

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];
}

export const HABIT_COLORS = ['#1F3A93', '#2F80ED', '#7B4FD6', '#D64545', '#E07A1F', '#C9961A', '#1E9E7A', '#5A6B85'];

export const HABIT_ICONS = [
  'water',
  'run',
  'book-open-page-variant',
  'meditation',
  'sleep',
  'food-apple',
  'dumbbell',
  'cash',
  'translate',
  'guitar-acoustic',
  'bike',
  'pencil',
];

export const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function formatFrequency(habit: Pick<Habit, 'frequency' | 'weekDays'>) {
  if (habit.frequency === 'diario') return 'Todos os dias';
  return [...habit.weekDays]
    .sort()
    .map((day) => WEEK_DAYS[day])
    .join(', ');
}
