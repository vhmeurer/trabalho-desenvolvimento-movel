import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { Spacing } from '@/constants/theme';
import { useProfile } from '@/context/profile-context';
import { validateName } from '@/utils/validation';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const nameError = validateName(name);

  async function handleSave() {
    setSubmitted(true);
    setSaveError('');
    if (nameError) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      router.back();
    } catch {
      setSaveError('Não foi possível salvar agora. Verifique sua conexão e tente de novo.');
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: theme.colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.intro}>
          <Text variant="headlineSmall">Editar informações</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Altere como seu nome aparece no app.
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
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <HelperText type="error" visible={submitted && !!nameError}>{nameError}</HelperText>
        </View>

        <View>
          <TextInput
            mode="outlined"
            label="E-mail"
            placeholder="voce@exemplo.com"
            value={profile.email}
            disabled
            left={<TextInput.Icon icon="email-outline" />}
          />
          <HelperText type="info" visible>
            O e-mail é usado para entrar no app e não pode ser alterado aqui.
          </HelperText>
        </View>

        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Para trocar a senha, use &quot;Esqueci minha senha&quot; na tela de login.
        </Text>

        {saveError !== '' && (
          <HelperText type="error" visible>
            {saveError}
          </HelperText>
        )}

        <View style={styles.actions}>
          <Button mode="outlined" onPress={() => router.back()} style={styles.action}>
            Cancelar
          </Button>
          <Button mode="contained" icon="content-save-outline" onPress={handleSave} loading={saving} disabled={saving} style={styles.action}>
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
