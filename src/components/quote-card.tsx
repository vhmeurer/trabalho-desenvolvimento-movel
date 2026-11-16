import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

import { Fonts, Spacing } from '@/constants/theme';
import { useDailyQuote } from '@/hooks/use-daily-quote';

export function QuoteCard() {
  const theme = useTheme();
  const { status, quote, retry, nextQuote } = useDailyQuote();
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text style={[styles.mark, { color: theme.colors.primary }]} accessibilityElementsHidden>
        “
      </Text>

      {quote ? (
        <View style={[styles.body, status === 'loading' && styles.dimmed]}>
          <Text style={[styles.quote, { color: theme.colors.onSurface }]}>
            {showOriginal ? quote.originalText : quote.text}
          </Text>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            {quote.author}
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
        Frases: {quote?.source ?? 'ZenQuotes.io'}. Tradução: MyMemory.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: Spacing.lg - 4,
    gap: Spacing.sm,
  },
  mark: {
    fontFamily: Fonts.bold,
    fontSize: 56,
    lineHeight: 48,
    height: 32,
  },
  body: {
    gap: Spacing.sm,
  },
  dimmed: {
    opacity: 0.5,
  },
  quote: {
    fontFamily: Fonts.medium,
    fontSize: 18,
    lineHeight: 27,
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
