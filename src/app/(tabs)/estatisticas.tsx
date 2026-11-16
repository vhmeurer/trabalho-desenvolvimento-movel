import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { ActivityIndicator, Card, ProgressBar, SegmentedButtons, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/empty-state';
import { HabitIcon } from '@/components/habit-icon';
import { StatTile } from '@/components/stat-tile';
import { CATEGORIES, WEEK_DAYS } from '@/constants/habits';
import { Spacing } from '@/constants/theme';
import { useHabits } from '@/context/habits-context';
import { useSampleHabits } from '@/hooks/use-sample-habits';
import type { Habit } from '@/types/habit';
import { formatDayMonth, lastDays } from '@/utils/date';
import { completionRateOn, countCompletionsOn, currentStreak } from '@/utils/habit-stats';

type Period = '7' | '28';

const Y_AXIS_WIDTH = 40;

function buildBuckets(period: Period) {
  const dates = lastDays(Number(period));
  if (period === '7') return dates.map((date) => ({ label: WEEK_DAYS[date.getDay()], dates: [date] }));
  return [0, 1, 2, 3].map((week) => {
    const weekDates = dates.slice(week * 7, week * 7 + 7);
    return { label: formatDayMonth(weekDates[0]), dates: weekDates };
  });
}

function percent(rate: number | null) {
  return Math.round((rate ?? 0) * 100);
}

export default function StatsScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { habits, loading } = useHabits();
  const sample = useSampleHabits();
  const [period, setPeriod] = useState<Period>('7');

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (habits.length === 0) {
    return (
      <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
        <EmptyState
          icon="chart-bar"
          title="Ainda não há estatísticas"
          message="Crie seus hábitos e marque-os como feitos para acompanhar sua evolução aqui."
          actionLabel="Criar hábito"
          onAction={() => router.push('/habito/novo')}
          secondaryActionLabel="Carregar hábitos de exemplo"
          onSecondaryAction={sample.loadSampleHabits}
          secondaryActionLoading={sample.loading}
        />
      </ScrollView>
    );
  }

  const dates = lastDays(Number(period));
  const buckets = buildBuckets(period);
  const overallRate = completionRateOn(habits, dates);
  const checkIns = countCompletionsOn(habits, dates);
  const streakLeader = habits
    .map((habit) => ({ habit, streak: currentStreak(habit) }))
    .reduce((best, item) => (item.streak > best.streak ? item : best));

  const chartWidth = width - Spacing.md * 4 - Y_AXIS_WIDTH - Spacing.sm;
  const slot = chartWidth / buckets.length;
  const barData = buckets.map((bucket) => ({
    value: percent(completionRateOn(habits, bucket.dates)),
    label: bucket.label,
    frontColor: theme.colors.primary,
  }));

  const categoryData = CATEGORIES.map((category) => ({
    category,
    value: countCompletionsOn(
      habits.filter((habit) => habit.category === category.id),
      dates
    ),
  })).filter((item) => item.value > 0);

  const ranking = habits
    .map((habit) => ({ habit, rate: completionRateOn([habit], dates) }))
    .sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1));

  const axisText = { color: theme.colors.onSurfaceVariant, fontSize: 11 };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.content}>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        Acompanhe sua constância ao longo do tempo.
      </Text>

      <SegmentedButtons
        value={period}
        onValueChange={(value) => setPeriod(value as Period)}
        buttons={[
          { value: '7', label: '7 dias', icon: 'calendar-week' },
          { value: '28', label: '4 semanas', icon: 'calendar-month' },
        ]}
      />

      <View style={styles.summary}>
        <StatTile value={`${percent(overallRate)}%`} label="Conclusão" />
        <StatTile value={String(checkIns)} label="Check-ins" />
        <StatTile
          value={String(streakLeader.streak)}
          unit={streakLeader.streak === 1 ? 'dia' : 'dias'}
          label={streakLeader.streak > 0 ? streakLeader.habit.name : 'Maior sequência'}
        />
      </View>

      <Card mode="outlined">
        <Card.Title
          title="Conclusão por período"
          subtitle={period === '7' ? 'Hábitos programados concluídos em cada dia' : 'Média de conclusão em cada semana'}
        />
        <Card.Content>
          <BarChart
            key={period}
            data={barData}
            width={chartWidth}
            height={180}
            maxValue={100}
            noOfSections={4}
            barWidth={slot * 0.55}
            spacing={slot * 0.45}
            initialSpacing={slot * 0.225}
            endSpacing={slot * 0.225}
            barBorderRadius={8}
            yAxisLabelSuffix="%"
            yAxisLabelWidth={Y_AXIS_WIDTH}
            yAxisTextStyle={axisText}
            xAxisLabelTextStyle={axisText}
            yAxisColor="transparent"
            xAxisColor={theme.colors.outlineVariant}
            rulesColor={theme.colors.outlineVariant}
            showValuesAsTopLabel
            topLabelTextStyle={{ color: theme.colors.onSurface, fontSize: 10 }}
            disableScroll
            isAnimated
          />
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Title title="Check-ins por categoria" subtitle="Quantas vezes você concluiu hábitos de cada área" />
        <Card.Content>
          {categoryData.length === 0 ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Nenhum check-in neste período.
            </Text>
          ) : (
            <View style={styles.pieRow}>
              <PieChart
                data={categoryData.map((item) => ({ value: item.value, color: item.category.color }))}
                donut
                radius={70}
                innerRadius={46}
                innerCircleColor={theme.colors.surface}
                centerLabelComponent={() => (
                  <View style={styles.pieCenter}>
                    <Text variant="titleLarge">{checkIns}</Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      check-ins
                    </Text>
                  </View>
                )}
              />
              <View style={styles.legend}>
                {categoryData.map((item) => (
                  <View key={item.category.id} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.category.color }]} />
                    <Text variant="bodyMedium" style={styles.flex}>
                      {item.category.label}
                    </Text>
                    <Text variant="labelLarge">{Math.round((item.value / checkIns) * 100)}%</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Title title="Desempenho por hábito" subtitle="Do mais constante para o menos constante" />
        <Card.Content style={styles.ranking}>
          {ranking.map(({ habit, rate }) => (
            <HabitRow key={habit.id} habit={habit} rate={rate} />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function HabitRow({ habit, rate }: { habit: Habit; rate: number | null }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/habito/[id]', params: { id: habit.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${habit.name}: ${rate === null ? 'sem dias programados' : `${percent(rate)}% concluído`}`}
      style={styles.habitRow}>
      <HabitIcon icon={habit.icon} color={habit.color} size={36} />
      <View style={styles.flex}>
        <View style={styles.habitHeader}>
          <Text variant="bodyLarge" numberOfLines={1} style={styles.flex}>
            {habit.name}
          </Text>
          <Text variant="labelLarge">{rate === null ? '—' : `${percent(rate)}%`}</Text>
        </View>
        <ProgressBar progress={rate ?? 0} color={habit.color} style={styles.progress} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  summary: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  pieCenter: {
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  ranking: {
    gap: Spacing.md,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  progress: {
    height: 6,
    borderRadius: 3,
  },
});
