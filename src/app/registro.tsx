import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { PasswordRequirements } from '@/components/password-requirements';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { authErrorMessage } from '@/services/auth-errors';
import { validateEmail, validateName, validateNewPassword, validatePasswordConfirmation } from '@/utils/validation';

export default function RegisterScreen() {
  const theme = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validateNewPassword(password);
  const confirmationError = validatePasswordConfirmation(password, confirmation);

  async function handleSubmit() {
    setSubmitted(true);
    setAuthError('');
    if (nameError || emailError || passwordError || confirmationError) return;
    setLoading(true);
    try {
      await signUp(name, email, password);
    } catch (error) {
      setAuthError(authErrorMessage(error));
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="account-plus-outline" size={38} color={theme.colors.primary} />
          </View>
          <Text variant="headlineMedium" style={styles.title}>Crie sua conta</Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            Um passo de cada vez para construir uma rotina melhor.
          </Text>
        </View>

        <View style={styles.form}>
          <View>
            <TextInput
              mode="outlined"
              label="Nome"
              placeholder="Como podemos te chamar?"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              left={<TextInput.Icon icon="account-outline" />}
              error={submitted && !!nameError}
              returnKeyType="next"
            />
            <HelperText type="error" visible={submitted && !!nameError}>{nameError}</HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="E-mail"
              placeholder="voce@exemplo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              left={<TextInput.Icon icon="email-outline" />}
              error={submitted && !!emailError}
              returnKeyType="next"
            />
            <HelperText type="error" visible={submitted && !!emailError}>{emailError}</HelperText>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoComplete="new-password"
              textContentType="newPassword"
              left={<TextInput.Icon icon="lock-outline" />}
              right={<TextInput.Icon icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'} onPress={() => setPasswordVisible((value) => !value)} />}
              error={submitted && !!passwordError}
              returnKeyType="next"
            />
            <PasswordRequirements password={password} showErrors={submitted} />
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Confirmar senha"
              value={confirmation}
              onChangeText={setConfirmation}
              secureTextEntry={!confirmationVisible}
              autoComplete="new-password"
              left={<TextInput.Icon icon="lock-check-outline" />}
              right={<TextInput.Icon icon={confirmationVisible ? 'eye-off-outline' : 'eye-outline'} onPress={() => setConfirmationVisible((value) => !value)} />}
              error={submitted && !!confirmationError}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <HelperText type="error" visible={submitted && !!confirmationError}>{confirmationError}</HelperText>
          </View>
          {authError !== '' && (
            <HelperText type="error" visible style={styles.feedback}>
              {authError}
            </HelperText>
          )}
          <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.submit} contentStyle={styles.buttonContent}>
            Criar conta
          </Button>
          <View style={styles.switchRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Já tem uma conta?</Text>
            <Link href="/login" asChild><Button mode="text" compact> Entrar </Button></Link>
          </View>
        </View>
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
  feedback: { textAlign: 'center' },
  submit: { marginTop: Spacing.sm },
  buttonContent: { minHeight: 48 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: Spacing.sm },
});
