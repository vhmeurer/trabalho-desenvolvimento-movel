import type { Habit } from '@/types/habit';
import { addDays, lastDays, toDateKey } from '@/utils/date';

function history(days: number, pattern: (index: number) => boolean): string[] {
  return lastDays(days)
    .reverse()
    .filter((_, index) => pattern(index))
    .map(toDateKey);
}

const daysAgo = (amount: number) => toDateKey(addDays(new Date(), -amount));

export const MOCK_HABITS: Habit[] = [
  {
    id: 'agua',
    name: 'Beber água',
    description: 'Manter a hidratação ao longo do dia.',
    category: 'saude',
    icon: 'water',
    color: '#1E88E5',
    frequency: 'diario',
    weekDays: [],
    goal: '2 litros',
    reminderTime: '09:00',
    createdAt: daysAgo(45),
    completions: history(45, (i) => i > 0 && i % 9 !== 0),
  },
  {
    id: 'leitura',
    name: 'Ler um livro',
    description: 'Leitura antes de dormir.',
    category: 'estudos',
    icon: 'book-open-page-variant',
    color: '#8E24AA',
    frequency: 'diario',
    weekDays: [],
    goal: '20 páginas',
    reminderTime: '22:00',
    createdAt: daysAgo(30),
    completions: history(30, (i) => i % 4 !== 3),
  },
  {
    id: 'academia',
    name: 'Academia',
    description: 'Treino de força.',
    category: 'saude',
    icon: 'dumbbell',
    color: '#E53935',
    frequency: 'semanal',
    weekDays: [1, 3, 5],
    goal: '1 hora',
    reminderTime: '18:30',
    createdAt: daysAgo(40),
    completions: history(40, (i) => i % 5 !== 2),
  },
  {
    id: 'meditar',
    name: 'Meditar',
    description: 'Respiração guiada pela manhã.',
    category: 'bem-estar',
    icon: 'meditation',
    color: '#2E7D6B',
    frequency: 'diario',
    weekDays: [],
    goal: '10 minutos',
    reminderTime: '07:00',
    createdAt: daysAgo(20),
    completions: history(20, (i) => i > 0 && i < 12),
  },
  {
    id: 'ingles',
    name: 'Estudar inglês',
    description: 'Aplicativo de idiomas ou série com legenda em inglês.',
    category: 'estudos',
    icon: 'translate',
    color: '#FB8C00',
    frequency: 'semanal',
    weekDays: [2, 4],
    goal: '30 minutos',
    reminderTime: null,
    createdAt: daysAgo(25),
    completions: history(25, (i) => i % 3 === 0),
  },
  {
    id: 'gastos',
    name: 'Anotar gastos',
    description: 'Registrar as despesas do dia.',
    category: 'financas',
    icon: 'cash',
    color: '#6D4C41',
    frequency: 'diario',
    weekDays: [],
    goal: '',
    reminderTime: '21:00',
    createdAt: daysAgo(10),
    completions: history(10, (i) => i % 2 === 0),
  },
];
