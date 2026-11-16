import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

type EmptyStateProps = {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionLoading?: boolean;
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionLoading,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconTile, { backgroundColor: theme.colors.primaryContainer }]}>
        <Icon source={icon} size={32} color={theme.colors.onPrimaryContainer} />
      </View>
      <Text variant="titleMedium" style={styles.center}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.center, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button mode="contained" icon="plus" onPress={onAction} style={styles.action}>
          {actionLabel}
        </Button>
      )}
      {secondaryActionLabel && onSecondaryAction && (
        <Button
          mode="text"
          icon="database-import-outline"
          onPress={onSecondaryAction}
          loading={secondaryActionLoading}
          disabled={secondaryActionLoading}>
          {secondaryActionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
  action: {
    marginTop: Spacing.sm,
  },
});
