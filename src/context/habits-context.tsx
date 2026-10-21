import { createContext, useContext, useState, type ReactNode } from 'react';

import { MOCK_HABITS } from '@/data/mock-habits';
import type { Habit, HabitInput } from '@/types/habit';
import { todayKey } from '@/utils/date';

type HabitsContextValue = {
  habits: Habit[];
  getHabit: (id: string) => Habit | undefined;
  addHabit: (input: HabitInput) => Habit;
  updateHabit: (id: string, input: HabitInput) => void;
  deleteHabit: (id: string) => void;
  toggleToday: (id: string) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);

  const value: HabitsContextValue = {
    habits,
    getHabit: (id) => habits.find((habit) => habit.id === id),
    addHabit: (input) => {
      const habit: Habit = {
        ...input,
        id: Date.now().toString(36),
        createdAt: todayKey(),
        completions: [],
      };
      setHabits((current) => [...current, habit]);
      return habit;
    },
    updateHabit: (id, input) => {
      setHabits((current) => current.map((habit) => (habit.id === id ? { ...habit, ...input } : habit)));
    },
    deleteHabit: (id) => {
      setHabits((current) => current.filter((habit) => habit.id !== id));
    },
    toggleToday: (id) => {
      const today = todayKey();
      setHabits((current) =>
        current.map((habit) => {
          if (habit.id !== id) return habit;
          const completions = habit.completions.includes(today)
            ? habit.completions.filter((date) => date !== today)
            : [...habit.completions, today];
          return { ...habit, completions };
        })
      );
    },
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits deve ser usado dentro de <HabitsProvider>');
  return context;
}
