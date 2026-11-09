import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useProfile } from '@/context/profile-context';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [submitted, setSubmitted] = useState(false);

  const nameError = name.trim() ? '' : 'Informe seu nome.';
  const emailError = email.trim() === '' ? 'Informe seu e-mail.' : !/^\S+@\S+\.\S+$/.test(email.trim()) ? 'Informe um e-mail válido.' : '';

  function handleSave() {
    setSubmitted(true);
    if (nameError || emailError) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.intro}>
          <Text variant="headlineSmall">Editar informações</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Mantenha seus dados de perfil atualizados.
          </Text>
        </View>

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
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <HelperText type="error" visible={submitted && !!emailError}>{emailError}</HelperText>
        </View>

        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          A senha não é exibida nem armazenada nos dados do perfil. A gestão de credenciais será feita pelo serviço de autenticação.
        </Text>

        <View style={styles.actions}>
          <Button mode="outlined" onPress={() => router.back()} style={styles.action}>
            Cancelar
          </Button>
          <Button mode="contained" icon="content-save-outline" onPress={handleSave} style={styles.action}>
            Salvar
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  intro: { gap: Spacing.xs, marginBottom: Spacing.sm },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  action: { flex: 1 },
});
