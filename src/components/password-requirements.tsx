import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { PASSWORD_RULES } from '@/utils/validation';

export function PasswordRequirements({ password, showErrors }: { password: string; showErrors: boolean }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        const color = passed ? theme.colors.primary : showErrors ? theme.colors.error : theme.colors.onSurfaceVariant;
        return (
          <View
            key={rule.label}
            style={styles.row}
            accessibilityLabel={`${rule.label}: ${passed ? 'atendido' : 'pendente'}`}>
            <Icon source={passed ? 'check-circle' : 'circle-outline'} size={16} color={color} />
            <Text variant="bodySmall" style={{ color }}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
