import type { CategoryId, Habit } from '@/types/habit';

export const CATEGORIES: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'saude', label: 'Saúde', icon: 'heart-pulse' },
  { id: 'estudos', label: 'Estudos', icon: 'book-open-variant' },
  { id: 'produtividade', label: 'Produtividade', icon: 'briefcase-check' },
  { id: 'bem-estar', label: 'Bem-estar', icon: 'meditation' },
  { id: 'financas', label: 'Finanças', icon: 'piggy-bank' },
];

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];
}

export const HABIT_COLORS = ['#2E7D6B', '#1E88E5', '#8E24AA', '#E53935', '#FB8C00', '#F9A825', '#6D4C41', '#546E7A'];

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
