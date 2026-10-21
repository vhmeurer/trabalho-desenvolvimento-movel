import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, FAB, Searchbar, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { HabitCard } from '@/components/habit-card';
import { CATEGORIES } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useHabits } from '@/context/habits-context';
import type { CategoryId } from '@/types/habit';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export default function HabitsScreen() {
  const theme = useTheme();
  const { habits } = useHabits();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);

  const search = normalize(query);
  const filtered = habits.filter(
    (habit) => (category === null || habit.category === category) && normalize(habit.name).includes(search)
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(habit) => habit.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Searchbar placeholder="Buscar hábito" value={query} onChangeText={setQuery} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              <Chip selected={category === null} showSelectedOverlay onPress={() => setCategory(null)}>
                Todos
              </Chip>
              {CATEGORIES.map((item) => (
                <Chip
                  key={item.id}
                  icon={item.icon}
                  selected={category === item.id}
                  showSelectedOverlay
                  onPress={() => setCategory(category === item.id ? null : item.id)}>
                  {item.label}
                </Chip>
              ))}
            </ScrollView>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {filtered.length} {filtered.length === 1 ? 'hábito' : 'hábitos'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HabitCard habit={item} onPress={() => router.push({ pathname: '/habito/[id]', params: { id: item.id } })} />
        )}
        ListEmptyComponent={
          habits.length === 0 ? (
            <EmptyState
              icon="playlist-plus"
              title="Você ainda não tem hábitos"
              message="Que tal criar o primeiro agora?"
              actionLabel="Criar hábito"
              onAction={() => router.push('/habito/novo')}
            />
          ) : (
            <EmptyState
              icon="magnify-close"
              title="Nenhum hábito encontrado"
              message="Tente buscar por outro nome ou mudar o filtro de categoria."
            />
          )
        }
      />

      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/habito/novo')} accessibilityLabel="Novo hábito" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 96,
    gap: Spacing.md,
  },
  header: {
    gap: Spacing.md,
  },
  chips: {
    gap: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
  },
});
