import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { useTheme } from "@/lib/theme";

export default function ProfileTab() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>{t("tabs.profile")}</Text>
        <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email ?? ""}</Text>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => signOut()}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            {t("common.signOut")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  email: { fontSize: 14 },
  button: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
