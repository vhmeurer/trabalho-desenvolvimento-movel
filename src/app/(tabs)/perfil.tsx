import { router, type Href } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";

import { Spacing } from "@/constants/theme";
import { useProfile } from "@/context/profile-context";

export default function ProfileScreen() {
  const theme = useTheme();
  const { profile } = useProfile();
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineSmall">Meu perfil</Text>

      <Card
        mode="contained"
        style={{ backgroundColor: theme.colors.primaryContainer }}
      >
        <Card.Content style={styles.profileCard}>
          <Avatar.Text
            size={72}
            label={initials || "U"}
            style={{ backgroundColor: theme.colors.primary }}
            color={theme.colors.onPrimary}
          />
          <View style={styles.identity}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              {profile.name}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              {profile.email}
            </Text>
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.onPrimaryContainer }}
            >
              Conta de demonstração
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleMedium">Informações pessoais</Text>
        <Card mode="outlined">
          <List.Item
            title="Nome completo"
            description={profile.name}
            left={(props) => <List.Icon {...props} icon="account-outline" />}
          />
          <Divider />
          <List.Item
            title="E-mail"
            description={profile.email}
            left={(props) => <List.Icon {...props} icon="email-outline" />}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium">Conta</Text>
        <Card mode="outlined">
          <List.Item
            title="Editar informações"
            description="Atualize seu nome e e-mail"
            left={(props) => (
              <List.Icon {...props} icon="account-edit-outline" />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push("/perfil/editar" as Href)}
          />
        </Card>
      </View>

      <Button
        mode="outlined"
        icon="pencil-outline"
        onPress={() => router.push("/perfil/editar" as Href)}
      >
        Editar perfil
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.lg },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  identity: { flex: 1, gap: Spacing.xs },
  section: { gap: Spacing.sm },
  disclaimer: { textAlign: "center" },
});
