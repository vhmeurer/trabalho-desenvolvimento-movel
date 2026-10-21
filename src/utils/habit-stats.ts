import type { Habit } from '@/types/habit';
import { addDays, lastDays, toDateKey, todayKey } from '@/utils/date';

export function isScheduledOn(habit: Habit, date: Date): boolean {
  return habit.frequency === 'diario' || habit.weekDays.includes(date.getDay());
}

export function isCompletedOn(habit: Habit, date: Date): boolean {
  return habit.completions.includes(toDateKey(date));
}

export function isCompletedToday(habit: Habit): boolean {
  return habit.completions.includes(todayKey());
}

export function currentStreak(habit: Habit): number {
  let date = new Date();
  if (!isCompletedOn(habit, date)) date = addDays(date, -1);

  const createdAt = habit.createdAt;
  let streak = 0;
  while (toDateKey(date) >= createdAt) {
    if (isScheduledOn(habit, date)) {
      if (!isCompletedOn(habit, date)) break;
      streak++;
    }
    date = addDays(date, -1);
  }
  return streak;
}

export function bestStreak(habit: Habit): number {
  let best = 0;
  let streak = 0;
  let date = new Date(`${habit.createdAt}T00:00:00`);
  const today = todayKey();
  while (toDateKey(date) <= today) {
    if (isScheduledOn(habit, date)) {
      streak = isCompletedOn(habit, date) ? streak + 1 : 0;
      best = Math.max(best, streak);
    }
    date = addDays(date, 1);
  }
  return best;
}

export function completionRate(habit: Habit, days: number): number {
  const scheduled = lastDays(days).filter(
    (date) => toDateKey(date) >= habit.createdAt && isScheduledOn(habit, date)
  );
  if (scheduled.length === 0) return 0;
  return scheduled.filter((date) => isCompletedOn(habit, date)).length / scheduled.length;
}
