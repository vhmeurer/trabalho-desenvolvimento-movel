import type { Habit } from '@/types/habit';
import { addDays, lastDays, parseDateKey, toDateKey, todayKey } from '@/utils/date';

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
  let date = parseDateKey(habit.createdAt);
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

export function existedOn(habit: Habit, date: Date): boolean {
  return toDateKey(date) >= habit.createdAt;
}

export function completionRate(habit: Habit, days: number): number {
  return completionRateOn([habit], lastDays(days)) ?? 0;
}

export function completionRateOn(habits: Habit[], dates: Date[]): number | null {
  let scheduled = 0;
  let done = 0;
  for (const date of dates) {
    for (const habit of habits) {
      if (!existedOn(habit, date) || !isScheduledOn(habit, date)) continue;
      scheduled++;
      if (isCompletedOn(habit, date)) done++;
    }
  }
  return scheduled === 0 ? null : done / scheduled;
}

export function countCompletionsOn(habits: Habit[], dates: Date[]): number {
  const keys = new Set(dates.map(toDateKey));
  return habits.reduce((total, habit) => total + habit.completions.filter((key) => keys.has(key)).length, 0);
}
