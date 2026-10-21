import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Chip,
  HelperText,
  Icon,
  IconButton,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { CATEGORIES, HABIT_COLORS, HABIT_ICONS, WEEK_DAYS } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { usePreferences } from '@/context/preferences-context';
import type { Frequency, HabitInput } from '@/types/habit';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

type HabitFormProps = {
  initialValues?: HabitInput;
  submitLabel: string;
  onSubmit: (input: HabitInput) => void;
  onCancel: () => void;
};

export function HabitForm({ initialValues, submitLabel, onSubmit, onCancel }: HabitFormProps) {
  const theme = useTheme();
  const { notificationsEnabled, defaultReminderTime } = usePreferences();
  const [values, setValues] = useState<HabitInput>(
    initialValues ?? {
      name: '',
      description: '',
      category: 'saude',
      icon: HABIT_ICONS[0],
      color: HABIT_COLORS[0],
      frequency: 'diario',
      weekDays: [],
      goal: '',
      reminderTime: notificationsEnabled ? defaultReminderTime : null,
    }
  );
  const [reminderText, setReminderText] = useState(values.reminderTime ?? defaultReminderTime);
  const [submitted, setSubmitted] = useState(false);

  const reminderEnabled = values.reminderTime !== null;
  const errors = {
    name: values.name.trim() === '' ? 'Informe um nome para o hábito.' : null,
    weekDays:
      values.frequency === 'semanal' && values.weekDays.length === 0 ? 'Escolha pelo menos um dia da semana.' : null,
    reminder: reminderEnabled && !TIME_PATTERN.test(reminderText) ? 'Use o formato HH:MM, por exemplo 08:30.' : null,
  };
  const hasErrors = Object.values(errors).some((error) => error !== null);

  function update<K extends keyof HabitInput>(key: K, value: HabitInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function toggleWeekDay(day: number) {
    update(
      'weekDays',
      values.weekDays.includes(day) ? values.weekDays.filter((item) => item !== day) : [...values.weekDays, day]
    );
  }

  function handleSubmit() {
    setSubmitted(true);
    if (hasErrors) return;
    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      goal: values.goal.trim(),
      weekDays: values.frequency === 'semanal' ? [...values.weekDays].sort() : [],
      reminderTime: reminderEnabled ? reminderText : null,
    });
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View>
          <TextInput
            mode="outlined"
            label="Nome do hábito *"
            placeholder="Ex.: Beber água"
            value={values.name}
            onChangeText={(text) => update('name', text)}
            maxLength={40}
            error={submitted && errors.name !== null}
            left={<TextInput.Icon icon={values.icon} color={values.color} />}
          />
          <HelperText type="error" visible={submitted && errors.name !== null}>
            {errors.name}
          </HelperText>
        </View>

        <TextInput
          mode="outlined"
          label="Descrição"
          placeholder="Por que esse hábito é importante?"
          value={values.description}
          onChangeText={(text) => update('description', text)}
          multiline
          numberOfLines={3}
        />

        <TextInput
          mode="outlined"
          label="Meta"
          placeholder="Ex.: 2 litros, 30 minutos, 20 páginas"
          value={values.goal}
          onChangeText={(text) => update('goal', text)}
        />

        <Section title="Categoria">
          <View style={styles.wrap}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.id}
                icon={category.icon}
                selected={values.category === category.id}
                showSelectedOverlay
                onPress={() => update('category', category.id)}>
                {category.label}
              </Chip>
            ))}
          </View>
        </Section>

        <Section title="Frequência">
          <SegmentedButtons
            value={values.frequency}
            onValueChange={(value) => update('frequency', value as Frequency)}
            buttons={[
              { value: 'diario', label: 'Todos os dias', icon: 'calendar-today' },
              { value: 'semanal', label: 'Dias da semana', icon: 'calendar-week' },
            ]}
          />
          {values.frequency === 'semanal' && (
            <View>
              <View style={[styles.wrap, styles.weekDays]}>
                {WEEK_DAYS.map((label, day) => (
                  <Chip
                    key={label}
                    compact
                    selected={values.weekDays.includes(day)}
                    showSelectedOverlay
                    onPress={() => toggleWeekDay(day)}>
                    {label}
                  </Chip>
                ))}
              </View>
              <HelperText type="error" visible={submitted && errors.weekDays !== null}>
                {errors.weekDays}
              </HelperText>
            </View>
          )}
        </Section>

        <Section title="Cor">
          <View style={styles.wrap}>
            {HABIT_COLORS.map((color) => {
              const selected = values.color === color;
              return (
                <Pressable
                  key={color}
                  onPress={() => update('color', color)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Cor ${color}`}
                  style={[
                    styles.color,
                    { backgroundColor: color },
                    selected && { borderColor: theme.colors.onSurface },
                  ]}>
                  {selected && <Icon source="check" size={20} color="#FFFFFF" />}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Ícone">
          <View style={styles.wrap}>
            {HABIT_ICONS.map((icon) => {
              const selected = values.icon === icon;
              return (
                <IconButton
                  key={icon}
                  icon={icon}
                  mode={selected ? 'contained' : 'outlined'}
                  selected={selected}
                  iconColor={selected ? '#FFFFFF' : values.color}
                  containerColor={selected ? values.color : undefined}
                  onPress={() => update('icon', icon)}
                  accessibilityLabel={`Ícone ${icon}`}
                />
              );
            })}
          </View>
        </Section>

        <Section title="Lembrete">
          <View style={styles.switchRow}>
            <Text variant="bodyLarge">Receber lembrete diário</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={(enabled) => update('reminderTime', enabled ? reminderText : null)}
            />
          </View>
          {reminderEnabled && (
            <View>
              <TextInput
                mode="outlined"
                label="Horário"
                placeholder="HH:MM"
                value={reminderText}
                onChangeText={setReminderText}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                error={submitted && errors.reminder !== null}
                left={<TextInput.Icon icon="bell-outline" />}
              />
              <HelperText type="error" visible={submitted && errors.reminder !== null}>
                {errors.reminder}
              </HelperText>
            </View>
          )}
        </Section>

        {submitted && hasErrors && (
          <HelperText type="error" visible>
            Corrija os campos destacados para continuar.
          </HelperText>
        )}

        <View style={styles.actions}>
          <Button mode="outlined" onPress={onCancel} style={styles.flex}>
            Cancelar
          </Button>
          <Button mode="contained" icon="check" onPress={handleSubmit} style={styles.flex}>
            {submitLabel}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="titleSmall">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  weekDays: {
    marginTop: Spacing.sm,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
