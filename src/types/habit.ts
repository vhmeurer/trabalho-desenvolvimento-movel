/** Tipos de dados dos hábitos. */

export type Frequency = 'diario' | 'semanal';

export type CategoryId = 'saude' | 'estudos' | 'produtividade' | 'bem-estar' | 'financas';

export type Habit = {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  /** Nome de um ícone do MaterialCommunityIcons. */
  icon: string;
  color: string;
  frequency: Frequency;
  /** Dias da semana em que o hábito vale (0 = domingo ... 6 = sábado). Só é usado na frequência semanal. */
  weekDays: number[];
  /** Meta livre, por exemplo "2 litros" ou "30 minutos". */
  goal: string;
  /** Horário do lembrete no formato "HH:MM", ou null se não houver lembrete. */
  reminderTime: string | null;
  /** Data de criação no formato "YYYY-MM-DD". */
  createdAt: string;
  /** Dias em que o hábito foi concluído, no formato "YYYY-MM-DD". */
  completions: string[];
};

/** Dados preenchidos no formulário de criação e de edição. */
export type HabitInput = Omit<Habit, 'id' | 'createdAt' | 'completions'>;
