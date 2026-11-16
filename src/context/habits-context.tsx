import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth-context';
import { MOCK_HABITS } from '@/data/mock-habits';
import { db } from '@/services/firebase';
import type { Habit, HabitInput } from '@/types/habit';
import { todayKey } from '@/utils/date';

type HabitsContextValue = {
  habits: Habit[];
  loading: boolean;
  getHabit: (id: string) => Habit | undefined;
  addHabit: (input: HabitInput) => Habit;
  updateHabit: (id: string, input: HabitInput) => void;
  deleteHabit: (id: string) => void;
  toggleToday: (id: string) => void;
  addSampleHabits: () => Promise<void>;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

function habitsCollection(uid: string | null) {
  if (!uid) throw new Error('É preciso estar logado para alterar hábitos');
  return collection(db, 'users', uid, 'habits');
}

function reportWriteError(error: unknown) {
  console.error('Falha ao salvar no Firestore', error);
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [loaded, setLoaded] = useState<{ uid: string | null; habits: Habit[] }>({ uid: null, habits: [] });

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(
      query(habitsCollection(uid), orderBy('position')),
      (snapshot) => {
        const habits = snapshot.docs.map((item) => {
          const { position: _position, ...data } = item.data();
          return { ...data, id: item.id } as Habit;
        });
        setLoaded({ uid, habits });
      },
      (error) => {
        console.error('Falha ao carregar hábitos do Firestore', error);
        setLoaded({ uid, habits: [] });
      }
    );
  }, [uid]);

  const habits = uid !== null && loaded.uid === uid ? loaded.habits : [];

  const value: HabitsContextValue = {
    habits,
    loading: uid !== null && loaded.uid !== uid,
    getHabit: (id) => habits.find((habit) => habit.id === id),
    addHabit: (input) => {
      const ref = doc(habitsCollection(uid));
      const habit: Habit = { ...input, id: ref.id, createdAt: todayKey(), completions: [] };
      const { id: _id, ...data } = habit;
      setDoc(ref, { ...data, position: Date.now() }).catch(reportWriteError);
      return habit;
    },
    updateHabit: (id, input) => {
      updateDoc(doc(habitsCollection(uid), id), { ...input }).catch(reportWriteError);
    },
    deleteHabit: (id) => {
      deleteDoc(doc(habitsCollection(uid), id)).catch(reportWriteError);
    },
    toggleToday: (id) => {
      const today = todayKey();
      const done = habits.find((habit) => habit.id === id)?.completions.includes(today);
      updateDoc(doc(habitsCollection(uid), id), {
        completions: done ? arrayRemove(today) : arrayUnion(today),
      }).catch(reportWriteError);
    },
    addSampleHabits: async () => {
      const batch = writeBatch(db);
      const now = Date.now();
      MOCK_HABITS.forEach(({ id, ...data }, index) => {
        batch.set(doc(habitsCollection(uid), id), { ...data, position: now + index });
      });
      await batch.commit();
    },
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabits deve ser usado dentro de <HabitsProvider>');
  return context;
}
