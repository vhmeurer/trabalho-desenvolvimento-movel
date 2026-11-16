import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Icon, Text, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useDailyQuote } from '@/hooks/use-daily-quote';

export function QuoteCard() {
  const theme = useTheme();
  const { status, quote, retry, nextQuote } = useDailyQuote();
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <Card mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Icon source="format-quote-open" size={22} color={theme.colors.primary} />
          <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
            Frase do dia
          </Text>
        </View>

        {quote ? (
          <View style={[styles.body, status === 'loading' && styles.dimmed]}>
            <Text variant="bodyLarge" style={styles.quote}>
              “{showOriginal ? quote.originalText : quote.text}”
            </Text>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              — {quote.author}
            </Text>
          </View>
        ) : status === 'loading' ? (
          <ActivityIndicator style={styles.loader} />
        ) : null}

        {status === 'error' && (
          <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
            Não foi possível carregar uma frase agora. Verifique sua conexão.
          </Text>
        )}

        <View style={styles.actions}>
          {status === 'error' && !quote ? (
            <Button mode="text" compact icon="refresh" onPress={retry}>
              Tentar de novo
            </Button>
          ) : (
            <Button mode="text" compact icon="refresh" onPress={nextQuote} disabled={status === 'loading'}>
              Outra frase
            </Button>
          )}
          {quote?.translated && (
            <Button mode="text" compact icon="translate" onPress={() => setShowOriginal((value) => !value)}>
              {showOriginal ? 'Ver tradução' : 'Ver original'}
            </Button>
          )}
        </View>

        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Frases: {quote?.source ?? 'ZenQuotes.io'} · Tradução: MyMemory
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  body: {
    gap: Spacing.xs,
  },
  dimmed: {
    opacity: 0.5,
  },
  quote: {
    fontStyle: 'italic',
  },
  loader: {
    marginVertical: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -Spacing.sm,
  },
});
