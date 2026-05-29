import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { ProfileForm } from "@/features/profile";
import { useTheme } from "@/lib/theme";

export default function ProfileTab() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["bottom"]}>
      <View style={styles.flex}>
        <ProfileForm />
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email ?? ""}</Text>
          <Pressable onPress={() => signOut()} hitSlop={8}>
            <Text style={[styles.signOut, { color: colors.danger }]}>{t("common.signOut")}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  email: { fontSize: 12 },
  signOut: { fontSize: 14, fontWeight: "600" },
});
