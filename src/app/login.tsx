import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const emailError = email.trim() === '' ? 'Informe seu e-mail.' : !/^\S+@\S+\.\S+$/.test(email.trim()) ? 'Informe um e-mail válido.' : '';
  const passwordError = password.length === 0 ? 'Informe sua senha.' : '';

  function handleSubmit() {
    setSubmitted(true);
    if (emailError || passwordError) return;
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="check-circle-outline" size={38} color={theme.colors.primary} />
          </View>
          <Text variant="headlineMedium" style={styles.title}>Bem-vindo de volta</Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            Entre para continuar acompanhando seus hábitos.
          </Text>
        </View>

        <View style={styles.form}>
          <View>
            <TextInput mode="outlined" label="E-mail" placeholder="voce@exemplo.com" value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" left={<TextInput.Icon icon="email-outline" />} error={submitted && !!emailError} returnKeyType="next" />
            <HelperText type="error" visible={submitted && !!emailError}>{emailError}</HelperText>
          </View>
          <View>
            <TextInput mode="outlined" label="Senha" value={password} onChangeText={setPassword} secureTextEntry={!passwordVisible} autoComplete="current-password" textContentType="password" left={<TextInput.Icon icon="lock-outline" />} right={<TextInput.Icon icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'} onPress={() => setPasswordVisible((value) => !value)} />} error={submitted && !!passwordError} returnKeyType="done" onSubmitEditing={handleSubmit} />
            <HelperText type="error" visible={submitted && !!passwordError}>{passwordError}</HelperText>
          </View>
          <Button mode="contained" onPress={handleSubmit} style={styles.submit} contentStyle={styles.buttonContent}>
            Entrar
          </Button>
          <View style={styles.switchRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Ainda não tem uma conta?</Text>
            <Link href="/registro" asChild><Button mode="text" compact> Criar conta </Button></Link>
          </View>
        </View>
        <Text variant="bodySmall" style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
          A autenticação será conectada quando houver um serviço de contas configurado.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xl, gap: Spacing.xl },
  brand: { alignItems: 'center', gap: Spacing.sm },
  logo: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  title: { textAlign: 'center' },
  form: { gap: Spacing.sm },
  submit: { marginTop: Spacing.sm },
  buttonContent: { minHeight: 48 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: Spacing.sm },
  note: { textAlign: 'center' },
});
